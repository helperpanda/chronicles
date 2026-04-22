import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useBattleStore } from '../store/battleStore';
import { chapter1, chapter2, chapter1Items, chapter2Items } from '../data';
import type { SkillCard, Item } from '../data/_schema';
import { useT, useContent } from '../i18n';

const RARITY_COLOR: Record<string, string> = {
  common:    '#aaa',
  rare:      '#3498db',
  epic:      '#9b59b6',
  legendary: '#f39c12',
};

const TYPE_ICON: Record<string, string> = {
  attack:  '⚔️',
  defense: '🛡',
  buff:    '⬆️',
  special: '✨',
};

interface FloatPopup { id: number; text: string; color: string; }

function DamagePopups({ popups }: { popups: FloatPopup[] }) {
  return (
    <div style={{ position: 'relative', height: 0, width: '100%', maxWidth: '500px' }}>
      {popups.map(p => (
        <span
          key={p.id}
          className="anim-float-up"
          style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 'bold',
            color: p.color, pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 10,
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}

function CardView({ card, onClick, disabled, playing }: {
  card: SkillCard;
  onClick: () => void;
  disabled: boolean;
  playing: boolean;
}) {
  const rarity = RARITY_COLOR[card.rarity] ?? '#aaa';
  const tc = useContent();
  return (
    <button
      className={playing ? 'anim-card-play' : undefined}
      style={{
        ...styles.card,
        borderColor: disabled ? '#333' : rarity,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : `0 0 8px ${rarity}44`,
      }}
      onClick={disabled ? undefined : onClick}
    >
      <div style={{ ...styles.cardTop, borderBottomColor: rarity }}>
        <span style={styles.cardCost}>{card.manaCost}💧</span>
        <span style={styles.cardTypeIcon}>{TYPE_ICON[card.type]}</span>
      </div>
      <div style={styles.cardBody}>
        <p style={{ ...styles.cardName, color: rarity }}>{tc.card(card.id, 'name', card.name)}</p>
        <p style={styles.cardDesc}>{tc.card(card.id, 'description', card.description)}</p>
      </div>
    </button>
  );
}

function PotionPanel({ items, onUse, disabled }: {
  items: Item[];
  onUse: (id: string) => void;
  disabled: boolean;
}) {
  const potions = items.filter(i => i.type === 'potion');
  const t = useT();
  const tc = useContent();
  if (potions.length === 0) return <span style={styles.noPotions}>{t('battle.noPotions')}</span>;
  return (
    <div style={styles.potionList}>
      {potions.map(p => (
        <button
          key={p.id}
          style={{ ...styles.potionBtn, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer' }}
          onClick={() => !disabled && onUse(p.id)}
          title={tc.item(p.id, 'description', p.description)}
        >
          🧪 {tc.item(p.id, 'name', p.name)}
        </button>
      ))}
    </div>
  );
}

export default function BattleScreen() {
  const [showPotions, setShowPotions] = useState(false);
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [enemyPopups, setEnemyPopups] = useState<FloatPopup[]>([]);
  const [playerPopups, setPlayerPopups] = useState<FloatPopup[]>([]);
  const [playerShaking, setPlayerShaking] = useState(false);
  const popupCounter = useRef(0);
  const prevLogLen = useRef(0);

  const t = useT();
  const tc = useContent();

  const { character, run, clearRoom, setScreen, takeDamage, healHp, gainExp, gainGold, incrementKills, incrementCombos, addTurns, addDamageTaken, useItem, triggerBeat, addItemToInventory, addRelic } = useGameStore();
  const {
    phase, turn, hand, enemy, enemyCurrentHp, enemyShield,
    player, currentMana, maxMana, log, playCard, endPlayerTurn, resetBattle,
    executeCombo, getAvailableCombo, playerDamageTaken,
  } = useBattleStore();

  // Spawn float popups from new log entries
  useEffect(() => {
    const newEntries = log.slice(prevLogLen.current);
    prevLogLen.current = log.length;
    newEntries.forEach(entry => {
      const id = ++popupCounter.current;
      const ttl = 800;
      if (entry.type === 'damage') {
        const match = entry.text.match(/(\d+)/);
        if (match) {
          const text = `−${match[1]}`;
          const isPlayerDmg = entry.text.includes('받음');
          if (isPlayerDmg) {
            setPlayerPopups(p => [...p, { id, text, color: '#e74c3c' }]);
            setTimeout(() => setPlayerPopups(p => p.filter(x => x.id !== id)), ttl);
            setPlayerShaking(true);
            setTimeout(() => setPlayerShaking(false), 350);
          } else {
            setEnemyPopups(p => [...p, { id, text, color: '#e74c3c' }]);
            setTimeout(() => setEnemyPopups(p => p.filter(x => x.id !== id)), ttl);
          }
        }
      } else if (entry.type === 'heal') {
        const match = entry.text.match(/(\d+)/);
        if (match) {
          const text = `+${match[1]}`;
          setPlayerPopups(p => [...p, { id, text, color: '#2ecc71' }]);
          setTimeout(() => setPlayerPopups(p => p.filter(x => x.id !== id)), ttl);
        }
      } else if (entry.type === 'combo') {
        const id2 = ++popupCounter.current;
        setEnemyPopups(p => [...p, { id: id2, text: '✨ COMBO!', color: '#f39c12' }]);
        setTimeout(() => setEnemyPopups(p => p.filter(x => x.id !== id2)), ttl);
      }
    });
  }, [log]);

  const availableCombo = getAvailableCombo();

  if (!character || !enemy || !player) return null;

  const hpPct = (player.hp / player.maxHp) * 100;
  const mpPct = player.mp != null ? (player.mp / (player.maxMp ?? 1)) * 100 : 0;
  const enemyHpPct = (enemyCurrentHp / enemy.maxHp) * 100;

  const handlePlayCard = (card: SkillCard) => {
    if (phase !== 'player_turn') return;
    if (currentMana < card.manaCost) return;
    setPlayingCardId(card.id);
    setTimeout(() => setPlayingCardId(null), 400);
    playCard(card);
  };

  const handleEndTurn = () => {
    if (phase !== 'player_turn') return;
    endPlayerTurn();
  };

  const handleVictory = () => {
    const [minG, maxG] = enemy.goldReward;
    const gold = Math.floor(Math.random() * (maxG - minG + 1)) + minG;
    gainExp(enemy.expReward);
    gainGold(gold);
    healHp(player.hp - character.hp);

    // Process drops
    const allItems = [...chapter1Items, ...chapter2Items];
    for (const drop of enemy.drops) {
      if (Math.random() < drop.chance) {
        const item = allItems.find(i => i.id === drop.itemId);
        if (item) {
          if (item.type === 'relic') addRelic(item);
          else addItemToInventory(item);
        }
      }
    }
    incrementKills();
    addTurns(turn);
    addDamageTaken(playerDamageTaken);
    if (enemy.tier === 'elite' && run) {
      const chData = run.chapter === 1 ? chapter1 : chapter2;
      const t = chData.storyBeats.find(b => b.trigger === 'elite_defeated')?.text;
      if (t) triggerBeat(`ch${run.chapter}_elite`, t);
    }
    clearRoom();
    resetBattle();
    setScreen('map');
  };

  const handleDefeat = () => {
    addDamageTaken(playerDamageTaken);
    takeDamage(character.hp);
  };

  return (
    <div style={styles.container}>
      {/* Enemy */}
      <DamagePopups popups={enemyPopups} />
      <div style={styles.enemyArea}>
        <p style={styles.enemyName}>
          {tc.monster(enemy.id, 'name', enemy.name)}
          {enemy.tier === 'elite' && <span style={styles.tierBadge}> {t('battle.elite')}</span>}
          {enemy.tier === 'boss' && <span style={{ ...styles.tierBadge, color: '#e74c3c' }}> {t('battle.boss')}</span>}
        </p>
        <div style={styles.hpRow}>
          <div style={styles.barBg}>
            <div style={{ ...styles.barFill, width: `${enemyHpPct}%`, background: '#e74c3c' }} />
          </div>
          <span style={styles.hpText}>{enemyCurrentHp}/{enemy.maxHp}</span>
          {enemyShield > 0 && <span style={styles.shieldBadge}>🛡 {enemyShield}</span>}
        </div>
        <p style={styles.enemyDesc}>{tc.monster(enemy.id, 'description', enemy.description)}</p>
      </div>

      {/* Turn / phase indicator */}
      <div style={styles.phaseRow}>
        <span style={styles.turnLabel}>{t('battle.turn', { n: turn })}</span>
        <span style={{
          ...styles.phaseLabel,
          color: phase === 'player_turn' ? '#2ecc71' : '#e74c3c',
        }}>
          {phase === 'player_turn' ? t('battle.playerTurn') : phase === 'result' ? t('battle.battleOver') : t('battle.enemyTurn')}
        </span>
      </div>

      {/* Battle log */}
      <div style={styles.log}>
        {log.slice(-8).map(entry => (
          <p key={entry.id} style={{
            ...styles.logEntry,
            color: entry.type === 'damage' ? '#e74c3c'
              : entry.type === 'heal' ? '#2ecc71'
              : entry.type === 'buff' ? '#3498db'
              : entry.type === 'combo' ? '#f39c12'
              : 'var(--text-secondary)',
          }}>
            {entry.text}
          </p>
        ))}
      </div>

      {/* Player HUD */}
      <DamagePopups popups={playerPopups} />
      <div className={playerShaking ? 'anim-damage' : undefined} style={styles.playerHud}>
        <div style={styles.playerBars}>
          <div style={styles.barRow}>
            <span style={styles.barLabel}>HP</span>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${hpPct}%`, background: '#e74c3c' }} />
            </div>
            <span style={styles.hpText}>{player.hp}/{player.maxHp}</span>
          </div>
          <div style={styles.barRow}>
            <span style={styles.barLabel}>MP</span>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${mpPct}%`, background: '#3498db' }} />
            </div>
            <span style={styles.hpText}>{player.mp}/{player.maxMp}</span>
          </div>
        </div>
        <div style={styles.manaArea}>
          {Array.from({ length: maxMana }).map((_, i) => (
            <div key={i} style={{
              ...styles.manaOrb,
              background: i < currentMana ? '#3498db' : 'rgba(52,152,219,0.2)',
            }} />
          ))}
          {player.shield > 0 && (
            <span style={styles.playerShield}>🛡 {player.shield}</span>
          )}
        </div>
        <button
          style={{
            ...styles.potionToggle,
            background: showPotions ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.05)',
            borderColor: showPotions ? '#2ecc71' : 'rgba(255,255,255,0.15)',
          }}
          onClick={() => setShowPotions(p => !p)}
        >
          🧪 {character.inventory.filter(i => i.type === 'potion').length}
        </button>
      </div>
      {showPotions && (
        <PotionPanel
          items={character.inventory}
          disabled={phase !== 'player_turn'}
          onUse={(id) => { useItem(id); setShowPotions(false); }}
        />
      )}

      {/* Result overlay */}
      {phase === 'result' && (
        <div style={styles.resultOverlay}>
          {enemyCurrentHp <= 0 ? (
            <>
              <h2 style={{ color: '#f39c12', fontFamily: 'var(--font-title)' }}>{t('battle.victory')}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t('battle.victoryReward', { exp: enemy.expReward, gold: Math.floor((enemy.goldReward[0] + enemy.goldReward[1]) / 2) })}
              </p>
              <button style={styles.resultBtn} onClick={handleVictory}>{t('battle.continue')}</button>
            </>
          ) : (
            <>
              <h2 style={{ color: '#e74c3c', fontFamily: 'var(--font-title)' }}>{t('battle.defeat')}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{t('battle.defeated')}</p>
              <button style={{ ...styles.resultBtn, background: '#e74c3c' }} onClick={handleDefeat}>
                {t('battle.record')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Hand */}
      <div style={styles.hand}>
        {hand.map((card, i) => (
          <CardView
            key={`${card.id}-${i}`}
            card={card}
            disabled={phase !== 'player_turn' || currentMana < card.manaCost}
            playing={playingCardId === card.id}
            onClick={() => handlePlayCard(card)}
          />
        ))}
      </div>

      {/* Combo button */}
      {phase === 'player_turn' && availableCombo && (
        <div style={styles.comboArea}>
          <div style={styles.comboHint}>{t('battle.comboReady')}</div>
          <button
            style={{
              ...styles.comboBtn,
              opacity: currentMana >= availableCombo.manaCost ? 1 : 0.4,
              cursor: currentMana >= availableCombo.manaCost ? 'pointer' : 'default',
            }}
            onClick={() => {
              if (currentMana >= availableCombo.manaCost) {
                executeCombo(availableCombo.id);
                incrementCombos();
              }
            }}
          >
            <span style={styles.comboBtnName}>✨ {tc.combo(availableCombo.id, 'name', availableCombo.name)}</span>
            <span style={styles.comboBtnCost}>{availableCombo.manaCost}💧</span>
          </button>
          <p style={styles.comboFlavor}>{tc.combo(availableCombo.id, 'flavor', availableCombo.flavor)}</p>
        </div>
      )}

      {/* End turn button */}
      {phase === 'player_turn' && (
        <button style={styles.endTurnBtn} onClick={handleEndTurn}>
          {t('battle.endTurn')}
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh', background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '1rem', gap: '0.75rem', overflowY: 'auto',
  },
  enemyArea: {
    width: '100%', maxWidth: '500px', textAlign: 'center',
    padding: '1rem', background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
  },
  enemyName: {
    fontFamily: 'var(--font-title)', fontSize: '1.2rem',
    color: 'var(--text-primary)', margin: '0 0 0.5rem',
  },
  tierBadge: { fontSize: '0.75rem', color: '#f39c12' },
  hpRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  barBg: {
    flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)',
    borderRadius: '5px', overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: '5px', transition: 'width 0.3s' },
  hpText: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)',
    minWidth: '60px', textAlign: 'right',
  },
  shieldBadge: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#3498db' },
  enemyDesc: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
    color: 'var(--text-secondary)', fontStyle: 'italic',
  },
  phaseRow: {
    display: 'flex', gap: '1rem', alignItems: 'center',
  },
  turnLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)',
  },
  phaseLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 'bold',
  },
  log: {
    width: '100%', maxWidth: '500px', height: '100px',
    overflowY: 'auto', background: 'rgba(0,0,0,0.3)',
    borderRadius: '6px', padding: '0.5rem',
  },
  logEntry: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', margin: '0.1rem 0',
  },
  playerHud: {
    width: '100%', maxWidth: '500px', display: 'flex',
    gap: '1rem', alignItems: 'center',
    padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
  },
  playerBars: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  barLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
    color: 'var(--text-secondary)', width: '20px',
  },
  manaArea: { display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' },
  manaOrb: { width: '14px', height: '14px', borderRadius: '50%', transition: 'background 0.2s' },
  playerShield: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#3498db', marginLeft: '0.5rem',
  },
  hand: {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
    justifyContent: 'center', width: '100%', maxWidth: '700px',
  },
  card: {
    width: '120px', minHeight: '160px', border: '1px solid',
    borderRadius: '8px', background: 'var(--bg-secondary, #1a1a2e)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.4rem 0.5rem', borderBottom: '1px solid',
    background: 'rgba(0,0,0,0.2)',
  },
  cardCost: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#3498db' },
  cardTypeIcon: { fontSize: '0.9rem' },
  cardBody: { padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  cardName: { fontFamily: 'var(--font-title)', fontSize: '0.78rem', margin: 0 },
  cardDesc: {
    fontFamily: 'var(--font-body)', fontSize: '0.66rem',
    color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0,
  },
  comboArea: {
    width: '100%', maxWidth: '500px',
    background: 'rgba(243,156,18,0.12)', border: '1px solid #f39c12',
    borderRadius: '8px', padding: '0.75rem', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
  },
  comboHint: {
    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
    color: '#f39c12', letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  comboBtn: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #f39c12, #e67e22)',
    border: 'none', borderRadius: '6px', cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  comboBtnName: {
    fontFamily: 'var(--font-title)', fontSize: '0.95rem', color: '#111', fontWeight: 'bold',
  },
  comboBtnCost: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#111',
  },
  comboFlavor: {
    fontFamily: 'var(--font-body)', fontSize: '0.68rem',
    color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', margin: 0,
  },
  endTurnBtn: {
    padding: '0.6rem 2rem', fontFamily: 'var(--font-body)',
    fontSize: '0.9rem', background: '#27ae60', border: 'none',
    color: '#fff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold',
  },
  resultOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '1rem', zIndex: 100,
  },
  resultBtn: {
    padding: '0.75rem 2.5rem', background: '#f39c12', border: 'none',
    color: '#111', cursor: 'pointer', borderRadius: '4px',
    fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 'bold',
  },
  potionToggle: {
    padding: '0.3rem 0.6rem', border: '1px solid', borderRadius: '6px',
    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--text-primary)', transition: 'all 0.15s', whiteSpace: 'nowrap',
  },
  potionList: {
    width: '100%', maxWidth: '500px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
    padding: '0.6rem', background: 'rgba(46,204,113,0.06)',
    border: '1px solid rgba(46,204,113,0.2)', borderRadius: '6px',
  },
  potionBtn: {
    padding: '0.35rem 0.75rem', background: 'rgba(46,204,113,0.15)',
    border: '1px solid rgba(46,204,113,0.4)', borderRadius: '4px',
    color: '#2ecc71', fontFamily: 'var(--font-body)', fontSize: '0.78rem',
    transition: 'opacity 0.15s',
  },
  noPotions: {
    fontFamily: 'var(--font-body)', fontSize: '0.75rem',
    color: 'var(--text-secondary)', fontStyle: 'italic',
  },
};
