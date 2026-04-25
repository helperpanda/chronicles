import { useState, useEffect } from 'react';
import { useGameStore, type RoomNode } from '../store/gameStore';
import { useBattleStore } from '../store/battleStore';
import { useLegacyStore } from '../store/legacyStore';
import { chapter1, chapter1Monsters, chapter1Combos, chapter2, chapter2Monsters, chapter2Combos, chapter3, chapter3Monsters, chapter3Combos, CRAFTED_ITEMS, CRAFT_MATERIAL_IDS, matchRecipe } from '../data';
import type { SkillCard, Item } from '../data/_schema';
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

// ─── Craft Modal ──────────────────────────────────────────────────────────────

interface SelectedMaterial { item: Item; idx: number; }

function CraftModal({ inventory, onClose, onCraft }: {
  inventory: Item[];
  onClose: () => void;
  onCraft: (removeIndices: number[], result: Item) => void;
}) {
  const [selected, setSelected] = useState<SelectedMaterial[]>([]);
  const [result, setResult] = useState<{ success: boolean; item?: Item } | null>(null);

  const materials = inventory
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => CRAFT_MATERIAL_IDS.has(item.id));

  const toggleSelect = (item: Item, idx: number) => {
    const existing = selected.findIndex(s => s.idx === idx);
    if (existing !== -1) {
      setSelected(prev => prev.filter((_, i) => i !== existing));
    } else if (selected.length < 3) {
      setSelected(prev => [...prev, { item, idx }]);
    }
  };

  const tryCraft = () => {
    if (selected.length < 2) return;
    const ingredientIds = selected.map(s => s.item.id);
    const recipe = matchRecipe(ingredientIds);
    if (!recipe) {
      setResult({ success: false });
      setSelected([]);
      return;
    }
    const craftedItem = CRAFTED_ITEMS.find(i => i.id === recipe.resultId)!;
    const removeIndices = selected.map(s => s.idx);
    onCraft(removeIndices, craftedItem);
    setResult({ success: true, item: craftedItem });
    setSelected([]);
  };

  // Group materials by id for display
  const grouped: { item: Item; indices: number[] }[] = [];
  for (const { item, idx } of materials) {
    const g = grouped.find(g => g.item.id === item.id);
    if (g) g.indices.push(idx);
    else grouped.push({ item, indices: [idx] });
  }

  return (
    <div style={craftStyles.overlay} onClick={onClose}>
      <div style={craftStyles.panel} onClick={e => e.stopPropagation()}>
        <div style={craftStyles.header}>
          <span style={craftStyles.title}>⚗️ 아이템 조합</span>
          <button style={craftStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={craftStyles.hint}>재료를 2~3개 선택 후 조합을 시도하세요. 조합식은 스스로 찾아야 합니다.</p>

        {result && (
          <div style={{
            ...craftStyles.resultBox,
            borderColor: result.success ? '#2ecc71' : '#e74c3c',
            background: result.success ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)',
          }}>
            {result.success
              ? <p style={{ ...craftStyles.resultText, color: '#2ecc71' }}>✨ 조합 성공! {result.item?.name} 획득</p>
              : <p style={{ ...craftStyles.resultText, color: '#e74c3c' }}>❌ 알 수 없는 조합 — 재료 유지</p>
            }
            <button style={craftStyles.resultDismiss} onClick={() => setResult(null)}>확인</button>
          </div>
        )}

        <div style={craftStyles.grid}>
          {grouped.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
              조합 재료가 없습니다.
            </p>
          )}
          {grouped.map(({ item, indices }) => {
            const selectedCount = selected.filter(s => s.item.id === item.id).length;
            const canSelect = selected.length < 3 && selectedCount < indices.length;
            return (
              <div
                key={item.id}
                style={{
                  ...craftStyles.materialCard,
                  borderColor: selectedCount > 0 ? '#f39c12' : 'rgba(255,255,255,0.15)',
                  background: selectedCount > 0 ? 'rgba(243,156,18,0.1)' : 'rgba(255,255,255,0.04)',
                  cursor: canSelect || selectedCount > 0 ? 'pointer' : 'default',
                  opacity: !canSelect && selectedCount === 0 ? 0.5 : 1,
                }}
                onClick={() => {
                  if (selectedCount > 0) {
                    // Deselect last one of this id
                    const lastIdx = selected.map((s, i) => ({ s, i })).reverse().find(({ s }) => s.item.id === item.id);
                    if (lastIdx) setSelected(prev => prev.filter((_, i) => i !== lastIdx.i));
                  } else if (canSelect) {
                    const unusedIdx = indices.find(i => !selected.some(s => s.idx === i));
                    if (unusedIdx !== undefined) toggleSelect(item, unusedIdx);
                  }
                }}
              >
                <p style={craftStyles.matName}>{item.name}</p>
                <p style={craftStyles.matCount}>보유 {indices.length}개{selectedCount > 0 ? ` · 선택됨 ${selectedCount}` : ''}</p>
              </div>
            );
          })}
        </div>

        <div style={craftStyles.footer}>
          <div style={craftStyles.selectedRow}>
            {selected.length > 0
              ? selected.map((s, i) => <span key={i} style={craftStyles.selectedTag}>{s.item.name}</span>)
              : <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>재료를 선택하세요 ({selected.length}/3)</span>
            }
          </div>
          <button
            style={{
              ...craftStyles.craftBtn,
              opacity: selected.length >= 2 ? 1 : 0.4,
              cursor: selected.length >= 2 ? 'pointer' : 'default',
            }}
            onClick={tryCraft}
            disabled={selected.length < 2}
          >
            ⚗️ 조합 시도
          </button>
        </div>
      </div>
    </div>
  );
}

const craftStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 250,
  },
  panel: {
    background: 'var(--bg-secondary, #1a1a2e)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', width: '92%', maxWidth: '600px',
    maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: { fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--text-gold)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' },
  hint: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)',
    fontStyle: 'italic', margin: '0.6rem 1rem 0',
  },
  resultBox: {
    margin: '0.6rem 1rem', padding: '0.6rem 1rem',
    border: '1px solid', borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
  },
  resultText: { fontFamily: 'var(--font-body)', fontSize: '0.82rem', margin: 0 },
  resultDismiss: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '4px',
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', padding: '0.25rem 0.6rem',
    whiteSpace: 'nowrap' as const,
  },
  grid: {
    display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
    padding: '0.75rem 1rem', overflowY: 'auto', flex: 1,
  },
  materialCard: {
    border: '1px solid', borderRadius: '6px', padding: '0.5rem 0.75rem',
    minWidth: '120px', transition: 'all 0.15s',
  },
  matName: { fontFamily: 'var(--font-title)', fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0 },
  matCount: { fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0' },
  footer: {
    padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
  },
  selectedRow: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '24px' },
  selectedTag: {
    background: 'rgba(243,156,18,0.2)', border: '1px solid rgba(243,156,18,0.5)',
    borderRadius: '4px', padding: '0.15rem 0.5rem',
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#f39c12',
  },
  craftBtn: {
    padding: '0.55rem 1.5rem', background: 'rgba(155,89,182,0.25)',
    border: '1px solid #9b59b6', borderRadius: '6px',
    color: '#9b59b6', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    fontWeight: 'bold', alignSelf: 'flex-end',
    transition: 'opacity 0.15s',
  },
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MapScreen() {
  const { character, run, setScreen, enterRoom, advanceFloor, useItem, removeInventoryItems, addItemToInventory, triggerBeat, dismissBeat, pendingBeat, endRun } = useGameStore();
  const { initBattle } = useBattleStore();
  const { getBonus } = useLegacyStore();
  const [showDeck, setShowDeck] = useState(false);
  const [showAbandon, setShowAbandon] = useState(false);
  const [showCraft, setShowCraft] = useState(false);
  const t = useT();
  const tc = useContent();

  if (!character || !run) return null;

  const monsters = run.chapter === 1 ? chapter1Monsters : run.chapter === 2 ? chapter2Monsters : chapter3Monsters;
  const combos = run.chapter === 1 ? chapter1Combos : run.chapter === 2 ? [...chapter1Combos, ...chapter2Combos] : [...chapter1Combos, ...chapter2Combos, ...chapter3Combos];
  const chapterData = run.chapter === 1 ? chapter1 : run.chapter === 2 ? chapter2 : chapter3;

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
      const legacyManaBonus = getBonus('mana');
      const legacyCardBonus = getBonus('startCards');
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
        relicManaBonus + legacyManaBonus,
        3 + legacyCardBonus,
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
      {/* Abandon confirmation overlay */}
      {showAbandon && (
        <div style={styles.abandonOverlay}>
          <div style={styles.abandonBox}>
            <p style={styles.abandonTitle}>런을 포기하시겠습니까?</p>
            <p style={styles.abandonSub}>모든 진행 상황이 사라집니다.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button style={styles.abandonConfirm} onClick={() => endRun(false)}>
                포기
              </button>
              <button style={styles.abandonCancel} onClick={() => setShowAbandon(false)}>
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button style={styles.deckBtn} onClick={() => setShowDeck(true)}>
              {t('map.deck', { n: character.deck.length })}
            </button>
            <button style={{ ...styles.deckBtn, borderColor: 'rgba(155,89,182,0.5)', color: '#9b59b6' }} onClick={() => setShowCraft(true)}>
              ⚗️ 조합
            </button>
            <button style={styles.abandonBtn} onClick={() => setShowAbandon(true)}>
              🏳️
            </button>
          </div>
        </div>
      </div>
      {showDeck && <DeckModal deck={character.deck} onClose={() => setShowDeck(false)} />}
      {showCraft && (
        <CraftModal
          inventory={character.inventory}
          onClose={() => setShowCraft(false)}
          onCraft={(removeIndices, result) => {
            removeInventoryItems(removeIndices);
            addItemToInventory(result);
          }}
        />
      )}

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
            : run.chapter < 3
              ? `챕터 ${run.chapter + 1}로 진행 →`
              : t('map.adventureComplete')}
        </button>
      ) : (
        <p style={styles.tip}>
          {t('map.nextRoom', { type: t(`map.room.${floorRooms[run.roomIndex]?.type ?? 'combat'}`) })}
        </p>
      )}

      {/* Inventory — map-usable potions + crafted combat items */}
      {character.inventory.filter(i => i.type === 'potion' && !CRAFT_MATERIAL_IDS.has(i.id)).length > 0 && (
        <div style={styles.inventoryPanel}>
          <p style={styles.inventoryTitle}>{t('map.inventory')}</p>
          <div style={styles.inventoryRow}>
            {character.inventory
              .map((item, idx) => ({ item, idx }))
              .filter(({ item }) => item.type === 'potion' && !CRAFT_MATERIAL_IDS.has(item.id))
              .map(({ item, idx }) => {
                const isCombatOnly = item.id.startsWith('crafted_') && !item.effects.some(e => e.type === 'heal' || e.type === 'mana');
                return (
                  <div key={`${item.id}-${idx}`} style={styles.itemCard}>
                    <p style={styles.itemName}>{tc.item(item.id, 'name', item.name)}</p>
                    <p style={styles.itemDesc}>{tc.item(item.id, 'description', item.description)}</p>
                    {isCombatOnly ? (
                      <p style={{ ...styles.itemDesc, color: '#9b59b6', marginTop: '0.25rem' }}>⚔️ 전투 전용</p>
                    ) : (
                      <button style={styles.useBtn} onClick={() => useItem(item.id)}>
                        {t('map.useItem')}
                      </button>
                    )}
                  </div>
                );
              })}
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
  abandonBtn: {
    marginTop: '0.3rem', padding: '0.25rem 0.5rem', background: 'transparent',
    border: '1px solid rgba(231,76,60,0.35)', color: 'rgba(231,76,60,0.6)',
    cursor: 'pointer', borderRadius: '4px', fontSize: '0.75rem',
  },
  abandonOverlay: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400,
  },
  abandonBox: {
    background: 'var(--bg-secondary, #1a1a2e)',
    border: '1px solid rgba(231,76,60,0.4)',
    borderRadius: '10px', padding: '2rem', maxWidth: '320px', width: '90%',
    display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', alignItems: 'center' as const,
    textAlign: 'center' as const,
  },
  abandonTitle: {
    fontFamily: 'var(--font-title)', fontSize: '1.1rem',
    color: 'var(--text-primary)', margin: 0,
  },
  abandonSub: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--text-secondary)', margin: 0,
  },
  abandonConfirm: {
    padding: '0.55rem 1.5rem', background: '#e74c3c', border: 'none',
    borderRadius: '4px', color: '#fff', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 'bold',
  },
  abandonCancel: {
    padding: '0.55rem 1.5rem', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
    color: 'var(--text-primary)', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
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
