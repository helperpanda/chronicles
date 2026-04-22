import { useState, useEffect } from 'react';
import { useGameStore, type RoomNode } from '../store/gameStore';
import { useBattleStore } from '../store/battleStore';
import { chapter1, chapter1Monsters, chapter1Combos, chapter2, chapter2Monsters, chapter2Combos } from '../data';
import type { SkillCard } from '../data/_schema';
import { useT, useContent } from '../i18n';

const RARITY_COLOR: Record<string, string> = {
  common: '#aaa', rare: '#3498db', epic: '#9b59b6', legendary: '#f39c12',
};
const TYPE_ICON: Record<string, string> = {
  attack: '⚔️', defense: '🛡', buff: '⬆️', special: '✨',
};

function DeckModal({ deck, onClose }: { deck: SkillCard[]; onClose: () => void }) {
  const t = useT();
  const tc = useContent();
  return (
    <div style={deckStyles.overlay} onClick={onClose}>
      <div style={deckStyles.panel} onClick={e => e.stopPropagation()}>
        <div style={deckStyles.header}>
          <span style={deckStyles.title}>{t('map.deckTitle', { n: deck.length })}</span>
          <button style={deckStyles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={deckStyles.grid}>
          {deck.map((card, i) => {
            const color = RARITY_COLOR[card.rarity] ?? '#aaa';
            return (
              <div key={`${card.id}-${i}`} style={{ ...deckStyles.card, borderColor: color }}>
                <div style={deckStyles.cardTop}>
                  <span style={{ color: '#3498db', fontSize: '0.72rem' }}>{card.manaCost}💧</span>
                  <span style={{ fontSize: '0.8rem' }}>{TYPE_ICON[card.type]}</span>
                </div>
                <p style={{ ...deckStyles.cardName, color }}>{tc.card(card.id, 'name', card.name)}</p>
                <p style={deckStyles.cardDesc}>{tc.card(card.id, 'description', card.description)}</p>
                <p style={deckStyles.cardRarity}>{t(`rarity.${card.rarity}`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const deckStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  panel: {
    background: 'var(--bg-secondary, #1a1a2e)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', width: '90%', maxWidth: '680px',
    maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: { fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--text-primary)' },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text-secondary)',
    cursor: 'pointer', fontSize: '1rem',
  },
  grid: {
    display: 'flex', flexWrap: 'wrap', gap: '0.6rem',
    padding: '1rem', overflowY: 'auto',
  },
  card: {
    width: '110px', border: '1px solid', borderRadius: '6px',
    background: 'rgba(255,255,255,0.04)', padding: '0.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.2rem',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between' },
  cardName: { fontFamily: 'var(--font-title)', fontSize: '0.75rem', margin: 0 },
  cardDesc: {
    fontFamily: 'var(--font-body)', fontSize: '0.62rem',
    color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3,
  },
  cardRarity: {
    fontFamily: 'var(--font-body)', fontSize: '0.6rem',
    color: 'var(--text-secondary)', margin: 0, textTransform: 'capitalize',
  },
};

const ROOM_ICONS: Record<string, string> = {
  combat:  '⚔️',
  elite:   '💀',
  event:   '📜',
  shop:    '🏪',
  rest:    '🔥',
  boss:    '👹',
};

export default function MapScreen() {
  const { character, run, setScreen, enterRoom, advanceFloor, useItem, triggerBeat, dismissBeat, pendingBeat } = useGameStore();
  const { initBattle } = useBattleStore();
  const [showDeck, setShowDeck] = useState(false);
  const t = useT();
  const tc = useContent();

  if (!character || !run) return null;

  const monsters = run.chapter === 1 ? chapter1Monsters : chapter2Monsters;
  const combos = run.chapter === 1 ? chapter1Combos : [...chapter1Combos, ...chapter2Combos];
  const chapterData = run.chapter === 1 ? chapter1 : chapter2;

  // Story beat triggers
  useEffect(() => {
    const beatText = (trigger: string) =>
      chapterData.storyBeats.find(b => b.trigger === trigger)?.text;
    const key = `ch${run.chapter}`;
    if (run.floor === 1 && run.roomIndex === 0) {
      const t = beatText('chapter_start');
      if (t) triggerBeat(`${key}_start`, t);
    }
    if (run.floor === 2 && run.roomIndex === 0) {
      const t = beatText('floor_2_enter');
      if (t) triggerBeat(`${key}_floor2`, t);
    }
  }, [run.chapter, run.floor, run.roomIndex]);

  const relicManaBonus = character.relics.reduce((sum, r) =>
    sum + r.effects.filter(e => e.type === 'mana').reduce((s, e) => s + e.value, 0), 0);

  const handleRoom = (room: RoomNode) => {
    if (room.cleared) return;
    if (room.floor !== run.floor) return;
    const idx = run.rooms.findIndex(r => r.id === room.id);
    if (idx !== run.roomIndex) return;

    enterRoom(room.id);

    if (room.type === 'combat' || room.type === 'elite' || room.type === 'boss') {
      if (room.type === 'boss') {
        const t = chapterData.storyBeats.find(b => b.trigger === 'boss_encounter')?.text;
        if (t) triggerBeat(`ch${run.chapter}_boss`, t);
      }
      const pool = monsters.filter(m => {
        if (room.type === 'boss') return m.tier === 'boss';
        if (room.type === 'elite') return m.tier === 'elite';
        return m.tier === 'normal';
      });
      const enemy = pool[Math.floor(Math.random() * pool.length)];
      initBattle(
        {
          hp: character.hp,
          maxHp: character.maxHp,
          shield: 0,
          mp: character.mp,
          maxMp: character.maxMp,
          str: character.str,
          int: character.int,
          dex: character.dex,
          statuses: [],
        },
        enemy,
        character.deck,
        combos,
        relicManaBonus,
      );
      setScreen('battle');
    } else if (room.type === 'rest') {
      setScreen('rest');
    } else if (room.type === 'event') {
      setScreen('event');
    } else if (room.type === 'shop') {
      setScreen('shop');
    }
  };

  const allCleared = run.roomIndex >= run.rooms.filter(r => r.floor === run.floor).length;

  const floorRooms = run.rooms.filter(r => r.floor === run.floor);
  const hpPct = (character.hp / character.maxHp) * 100;
  const mpPct = (character.mp / character.maxMp) * 100;

  return (
    <div style={styles.container}>
      {/* Story Beat Overlay */}
      {pendingBeat && (
        <div style={styles.beatOverlay} onClick={dismissBeat}>
          <div style={styles.beatBox}>
            <p style={styles.beatText}>{pendingBeat}</p>
            <span style={styles.beatDismiss}>{t('map.storyDismiss')}</span>
          </div>
        </div>
      )}
      {/* Header HUD */}
      <div style={styles.hud}>
        <div style={styles.hudLeft}>
          <span style={styles.charName}>{character.name}</span>
          <span style={styles.charClass}>{t(`class.${character.classId}`)} Lv.{character.level}</span>
        </div>
        <div style={styles.bars}>
          <div style={styles.barRow}>
            <span style={styles.barLabel}>HP</span>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${hpPct}%`, background: '#e74c3c' }} />
            </div>
            <span style={styles.barText}>{character.hp}/{character.maxHp}</span>
          </div>
          <div style={styles.barRow}>
            <span style={styles.barLabel}>MP</span>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${mpPct}%`, background: '#3498db' }} />
            </div>
            <span style={styles.barText}>{character.mp}/{character.maxMp}</span>
          </div>
        </div>
        <div style={styles.hudRight}>
          <span style={styles.gold}>💰 {character.gold}</span>
          <span style={styles.floor}>Chapter {run.chapter} · {t('map.floor', { n: run.floor })}</span>
          <button style={styles.deckBtn} onClick={() => setShowDeck(true)}>
            {t('map.deck', { n: character.deck.length })}
          </button>
        </div>
      </div>
      {showDeck && <DeckModal deck={character.deck} onClose={() => setShowDeck(false)} />}

      {/* Chapter title */}
      <div style={styles.chapterTitle}>
        <p style={styles.chapterSub}>{t(`map.chapter.sub.${run.chapter}`)}</p>
      </div>

      {/* Room nodes */}
      <div style={styles.floorLabel}>{t('map.floor', { n: run.floor })}</div>
      <div style={styles.rooms}>
        {floorRooms.map((room, idx) => {
          const isCurrent = idx === run.roomIndex;
          const isCleared = room.cleared;
          const isLocked = idx > run.roomIndex;
          return (
            <button
              key={room.id}
              style={{
                ...styles.room,
                opacity: isLocked ? 0.35 : 1,
                borderColor: isCurrent ? 'var(--text-gold)' : isCleared ? '#444' : 'rgba(255,255,255,0.2)',
                cursor: isCurrent ? 'pointer' : 'default',
                background: isCleared ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
              }}
              onClick={() => handleRoom(room)}
              disabled={isLocked || isCleared}
            >
              <span style={styles.roomIcon}>{ROOM_ICONS[room.type]}</span>
              <span style={styles.roomLabel}>{t(`map.room.${room.type}`)}</span>
              {isCleared && <span style={styles.clearedBadge}>✓</span>}
              {isCurrent && !isCleared && (
                <div style={styles.currentIndicator} />
              )}
            </button>
          );
        })}
      </div>

      {allCleared ? (
        <button style={styles.advanceBtn} onClick={() => advanceFloor()}>
          {run.floor < 3
            ? t('map.advanceFloor', { n: run.floor + 1 })
            : run.chapter < 2
              ? t('map.advanceChapter2')
              : t('map.adventureComplete')}
        </button>
      ) : (
        <p style={styles.tip}>
          {t('map.nextRoom', { type: t(`map.room.${floorRooms[run.roomIndex]?.type ?? 'combat'}`) })}
        </p>
      )}

      {/* Inventory (potions only) */}
      {character.inventory.filter(i => i.type === 'potion').length > 0 && (
        <div style={styles.inventoryPanel}>
          <p style={styles.inventoryTitle}>{t('map.inventory')}</p>
          <div style={styles.inventoryRow}>
            {character.inventory
              .map((item, idx) => ({ item, idx }))
              .filter(({ item }) => item.type === 'potion')
              .map(({ item, idx }) => (
                <div key={`${item.id}-${idx}`} style={styles.itemCard}>
                  <p style={styles.itemName}>{tc.item(item.id, 'name', item.name)}</p>
                  <p style={styles.itemDesc}>{tc.item(item.id, 'description', item.description)}</p>
                  <button style={styles.useBtn} onClick={() => useItem(item.id)}>
                    {t('map.useItem')}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '1rem',
  },
  hud: {
    width: '100%', maxWidth: '700px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px', marginBottom: '1.5rem', gap: '1rem',
  },
  hudLeft: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  charName: {
    fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--text-primary)',
  },
  charClass: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)',
  },
  bars: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  barLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
    color: 'var(--text-secondary)', width: '20px',
  },
  barBg: {
    flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px', overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  barText: {
    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
    color: 'var(--text-secondary)', width: '50px', textAlign: 'right',
  },
  hudRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' },
  gold: { fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-gold)' },
  floor: { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)' },
  chapterTitle: { marginBottom: '1rem', textAlign: 'center' },
  chapterSub: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--text-secondary)', fontStyle: 'italic',
  },
  floorLabel: {
    fontFamily: 'var(--font-title)', fontSize: '1.1rem',
    color: 'var(--text-gold)', marginBottom: '1.5rem',
  },
  rooms: {
    display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
    maxWidth: '700px', width: '100%',
  },
  room: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
    padding: '1.25rem 1rem', border: '1px solid', borderRadius: '8px',
    minWidth: '100px', transition: 'all 0.2s', position: 'relative',
  },
  roomIcon: { fontSize: '1.8rem' },
  roomLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-secondary)',
  },
  clearedBadge: {
    position: 'absolute', top: '6px', right: '8px',
    fontSize: '0.7rem', color: '#2ecc71',
  },
  currentIndicator: {
    position: 'absolute', bottom: '6px',
    width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-gold)',
  },
  tip: {
    marginTop: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem',
    color: 'var(--text-secondary)', fontStyle: 'italic',
  },
  beatOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 300, cursor: 'pointer', padding: '2rem',
  },
  beatBox: {
    maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem',
    padding: '2rem', background: 'rgba(20,15,35,0.95)',
    border: '1px solid rgba(212,175,55,0.35)', borderRadius: '10px',
  },
  beatText: {
    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
    color: 'var(--text-primary)', lineHeight: 1.8, margin: 0,
    borderLeft: '2px solid rgba(212,175,55,0.5)', paddingLeft: '1rem',
    fontStyle: 'italic',
  },
  beatDismiss: {
    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
    color: 'var(--text-secondary)', textAlign: 'center' as const,
    letterSpacing: '0.08em',
  },
  advanceBtn: {
    marginTop: '2rem', padding: '0.75rem 2.5rem',
    background: 'var(--text-gold)', border: 'none', borderRadius: '6px',
    color: '#111', cursor: 'pointer', fontFamily: 'var(--font-body)',
    fontSize: '1rem', fontWeight: 'bold', letterSpacing: '0.03em',
  },
  deckBtn: {
    marginTop: '0.3rem', padding: '0.25rem 0.6rem', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.25)', color: 'var(--text-secondary)',
    cursor: 'pointer', borderRadius: '4px',
    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
  },
  inventoryPanel: {
    marginTop: '1.5rem', width: '100%', maxWidth: '700px',
    padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
  },
  inventoryTitle: {
    fontFamily: 'var(--font-title)', fontSize: '0.85rem',
    color: 'var(--text-secondary)', margin: '0 0 0.6rem',
  },
  inventoryRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  itemCard: {
    padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
    display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '130px',
  },
  itemName: {
    fontFamily: 'var(--font-title)', fontSize: '0.78rem',
    color: 'var(--text-primary)', margin: 0,
  },
  itemDesc: {
    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
    color: 'var(--text-secondary)', margin: 0,
  },
  useBtn: {
    marginTop: '0.3rem', padding: '0.25rem 0.5rem', background: '#27ae60',
    border: 'none', borderRadius: '3px', color: '#fff',
    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.72rem',
    alignSelf: 'flex-start',
  },
};
