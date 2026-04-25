import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLegacyStore } from '../store/legacyStore';
import { chapter1Classes, chapter2Classes, chapter1HiddenClasses, chapter1HiddenConditions, hiddenClassHints, chapter2HiddenClasses, chapter2HiddenConditions, chapter2HiddenHints, chapter3HiddenClasses, chapter3HiddenConditions, chapter3HiddenHints } from '../data';
import type { GameClass } from '../data/_schema';
import { useT, useContent } from '../i18n';
import '../styles/ClassSelect.css';

const CLASS_COLORS: Record<string, string> = {
  warrior: '#c0392b', mage: '#2980b9', rogue: '#8e44ad', priest: '#f39c12',
  druid: '#27ae60', marshal: '#7f8c8d',
};

const CLASS_ICONS: Record<string, string> = {
  warrior: '⚔️', mage: '🔮', rogue: '🗡️', priest: '✨',
  druid: '🌿', marshal: '🛡️',
};

const HIDDEN_ICONS: Record<string, string> = {
  blood_knight: '🩸', void_mage: '🌌', phantom: '👻', inquisitor: '⚖️',
  rune_knight: '🔮', shadow_inquisitor: '☯️', storm_caller: '⚡', holy_avenger: '☀️',
  flame_vanguard: '🔥', poison_alchemist: '☠️', legendary_hero: '🌟',
  void_wanderer: '🌀', archmage: '🔯', dragon_heir: '🐉',
};

function ClassCard({ cls, isSelected, color, bg, onSelect }: {
  cls: GameClass; isSelected: boolean; color: string; bg: string;
  onSelect: (cls: GameClass) => void;
}) {
  const tc = useContent();
  return (
    <button
      className="cs-card"
      style={{
        ...styles.card,
        borderColor: isSelected ? color : 'rgba(255,255,255,0.1)',
        boxShadow: isSelected ? `0 0 20px ${color}55` : 'none',
        background: isSelected ? `${color}11` : bg,
      }}
      onClick={() => onSelect(cls)}
    >
      <span className="cs-icon" style={styles.icon}>{CLASS_ICONS[cls.id] ?? '⚡'}</span>
      <div style={{ ...styles.classColor, background: color }} />
      <h3 className="cs-name" style={{ ...styles.className, color: isSelected ? color : 'var(--text-primary)' }}>
        {tc.cls(cls.id, 'name', cls.name)}
      </h3>
      <p style={styles.subtitle}>{cls.subtitle}</p>
      <p className="cs-desc" style={styles.desc}>{tc.cls(cls.id, 'description', cls.description)}</p>
      <div style={styles.stats}>
        {(['hp', 'mp', 'str', 'int', 'dex', 'con'] as const).map(stat => (
          <div key={stat} style={styles.stat}>
            <span style={styles.statLabel}>{stat.toUpperCase()}</span>
            <span className="cs-stat-value" style={styles.statValue}>{cls.baseStats[stat]}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function ClassSelectScreen() {
  const { startRun, setScreen, unlockedHiddenClasses, pendingAwakenings, clearPendingAwakenings, careerData } = useGameStore();
  const { getBonus } = useLegacyStore();
  const [selected, setSelected] = useState<GameClass | null>(null);
  const [name, setName] = useState('');
  const t = useT();
  const tc = useContent();

  const allHiddenClasses = [...chapter1HiddenClasses, ...chapter2HiddenClasses, ...chapter3HiddenClasses];
  const allHiddenConditions = [...chapter1HiddenConditions, ...chapter2HiddenConditions, ...chapter3HiddenConditions];
  const allHiddenHints = { ...hiddenClassHints, ...chapter2HiddenHints, ...chapter3HiddenHints };

  const unlockedHidden = allHiddenClasses.filter(c => unlockedHiddenClasses.includes(c.id));
  const lockedHidden = allHiddenConditions.filter(c => !unlockedHiddenClasses.includes(c.id));

  // Career progress helper for 50% hint
  const getCareerProgress = (condId: string): { current: number; threshold: number } | null => {
    const cond = allHiddenConditions.find(c => c.id === condId);
    if (!cond || cond.condition.scope !== 'career' || !cond.condition.threshold) return null;
    const { type, threshold } = cond.condition;
    let current = 0;
    if (type === 'career_chapter3_clears') current = careerData.chapterClears[3] ?? 0;
    else if (type === 'career_deaths') current = careerData.totalDeaths;
    else if (type === 'career_poison_damage') current = careerData.totalPoisonDamage;
    else if (type === 'career_combos') current = careerData.totalCombos;
    else if (type === 'career_dragon_kills') current = careerData.dragonKills;
    else return null;
    return { current, threshold };
  };

  const handleStart = () => {
    if (!selected) return;
    const charName = name.trim() || selected.name;
    startRun(selected.id, charName, {
      hp: getBonus('hp'),
      mp: getBonus('mp'),
      gold: getBonus('gold'),
      rareCard: getBonus('rareCard') > 0,
      revive: getBonus('revive') > 0,
      startComboCard: getBonus('startComboCard') > 0,
      extraCardChoice: getBonus('extraCardChoice'),
    });
  };

  return (
    <div className="cs-container" style={styles.container}>
      {/* Awakening Modal */}
      {pendingAwakenings.length > 0 && (
        <div style={styles.awakeningOverlay}>
          <div style={styles.awakeningBox}>
            <p style={styles.awakeningTitle}>⚡ 각성!</p>
            {pendingAwakenings.map(id => {
              const cls = allHiddenClasses.find(c => c.id === id);
              return (
                <div key={id} style={styles.awakeningItem}>
                  <span style={styles.awakeningIcon}>{HIDDEN_ICONS[id] ?? '✨'}</span>
                  <div>
                    <p style={styles.awakeningName}>{cls?.name ?? id} 해금!</p>
                    <p style={styles.awakeningDesc}>{cls?.description ?? ''}</p>
                  </div>
                </div>
              );
            })}
            <button style={styles.awakeningBtn} onClick={clearPendingAwakenings}>확인</button>
          </div>
        </div>
      )}

      <button style={styles.backBtn} onClick={() => setScreen('title')}>{t('classSelect.back')}</button>
      <h2 className="cs-heading" style={styles.heading}>{t('classSelect.heading')}</h2>
      <p className="cs-hint" style={styles.hint}>{t('classSelect.hint')}</p>

      {[
        { label: t('classSelect.chapter1Label'), classes: chapter1Classes, accent: 'rgba(255,255,255,0.06)' },
        { label: t('classSelect.chapter2Label'), classes: chapter2Classes, accent: 'rgba(52,152,219,0.06)' },
      ].map(section => (
        <div key={section.label} className="cs-section">
          <p style={styles.chapterLabel}>{section.label}</p>
          <div className="cs-grid">
            {section.classes.map(cls => (
              <ClassCard
                key={cls.id}
                cls={cls}
                isSelected={selected?.id === cls.id}
                color={CLASS_COLORS[cls.id] ?? '#888'}
                bg={section.accent}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="cs-hidden-section" style={styles.hiddenSection}>
        <h3 style={styles.hiddenHeading}>
          🔓 {t('classSelect.hidden')}
          {unlockedHidden.length > 0 && (
            <span style={styles.hiddenCount}> {t('classSelect.unlockedCount', { n: unlockedHidden.length })}/{allHiddenConditions.length}</span>
          )}
        </h3>

        {unlockedHidden.length > 0 && (
          <div className="cs-grid">
            {unlockedHidden.map(cls => {
              const isSelected = selected?.id === cls.id;
              return (
                <button
                  key={cls.id}
                  className="cs-card"
                  style={{
                    ...styles.card,
                    borderColor: isSelected ? '#f39c12' : 'rgba(243,156,18,0.4)',
                    boxShadow: isSelected ? '0 0 20px rgba(243,156,18,0.4)' : 'none',
                    background: 'rgba(243,156,18,0.06)',
                  }}
                  onClick={() => setSelected(cls)}
                >
                  <span className="cs-icon" style={styles.icon}>{HIDDEN_ICONS[cls.id] ?? '⚡'}</span>
                  <div style={{ ...styles.classColor, background: '#f39c12' }} />
                  <h3 className="cs-name" style={{ ...styles.className, color: isSelected ? '#f39c12' : 'var(--text-primary)' }}>
                    {tc.cls(cls.id, 'name', cls.name)}
                  </h3>
                  <p style={styles.subtitle}>{cls.subtitle}</p>
                  <p className="cs-desc" style={styles.desc}>{tc.cls(cls.id, 'description', cls.description)}</p>
                  <div style={styles.stats}>
                    {(['hp', 'mp', 'str', 'int', 'dex', 'con'] as const).map(stat => (
                      <div key={stat} style={styles.stat}>
                        <span style={styles.statLabel}>{stat.toUpperCase()}</span>
                        <span className="cs-stat-value" style={styles.statValue}>{cls.baseStats[stat]}</span>
                      </div>
                    ))}
                  </div>
                  <p style={styles.unlockedBadge}>{t('classSelect.unlockedBadge')}</p>
                </button>
              );
            })}
          </div>
        )}

        <div style={styles.lockedGrid}>
          {lockedHidden.map(cond => {
            const progress = getCareerProgress(cond.id);
            const halfMet = progress ? progress.current >= progress.threshold / 2 : false;
            const pct = progress ? Math.min(100, Math.floor((progress.current / progress.threshold) * 100)) : 0;
            return (
              <div key={cond.id} className="cs-locked-card" style={{ ...styles.lockedCard, opacity: halfMet ? 0.85 : 0.6 }}>
                <span style={styles.lockedIcon}>{halfMet ? '🔒' : '❓'}</span>
                <p style={{ ...styles.lockedName, color: halfMet ? 'rgba(243,156,18,0.7)' : undefined }}>
                  {halfMet ? '???' : '???'}
                </p>
                <p style={styles.lockedHint}>{allHiddenHints[cond.id]}</p>
                {progress && (
                  <p style={{ ...styles.lockedHint, color: halfMet ? 'rgba(243,156,18,0.8)' : undefined, marginTop: '0.2rem' }}>
                    달성률 {pct}% ({progress.current}/{progress.threshold})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bar 높이만큼 하단 여백 */}
      {selected && <div style={{ height: '80px' }} />}

      {selected && (
        <div style={styles.confirmBar}>
          <div className="cs-confirm-inner" style={styles.confirmInner}>
            <input
              style={styles.nameInput}
              placeholder={t('classSelect.nameHint', { name: tc.cls(selected.id, 'name', selected.name) })}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
              maxLength={20}
            />
            <button className="cs-start-btn" style={styles.startBtn} onClick={handleStart}>
              {CLASS_ICONS[selected.id] ?? '⚡'} {t('classSelect.startBtn', { name: tc.cls(selected.id, 'name', selected.name) })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start', background: 'transparent', border: 'none',
    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
    fontFamily: 'var(--font-body)', marginBottom: '1rem',
  },
  heading: {
    fontFamily: 'var(--font-title)',
    color: 'var(--text-gold)',
  },
  hint: {
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)', fontStyle: 'italic',
  },
  chapterLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    margin: '0 0 0.6rem', paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  card: {
    border: '1px solid', borderRadius: '8px', cursor: 'pointer',
    textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.3rem',
    transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
    width: '100%',
  },
  icon: {},
  classColor: { position: 'absolute', top: 0, left: 0, right: 0, height: '3px' },
  className: { fontFamily: 'var(--font-title)', margin: 0, transition: 'color 0.2s' },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 },
  desc: { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', margin: '0.2rem 0', lineHeight: 1.4 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem', marginTop: '0.4rem' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '0.15rem' },
  statLabel: { fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'var(--text-secondary)' },
  statValue: { fontFamily: 'var(--font-title)', color: 'var(--text-primary)' },
  confirmBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,10,20,0.96)', backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    padding: '0.65rem 1rem',
  },
  confirmInner: {
    display: 'flex', alignItems: 'center',
    maxWidth: '600px', margin: '0 auto',
  },
  nameInput: {
    flex: 1, padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  },
  hiddenSection: {
    width: '100%', maxWidth: '700px',
  },
  hiddenHeading: {
    fontFamily: 'var(--font-title)', fontSize: '0.95rem', color: 'var(--text-secondary)',
    marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem',
  },
  hiddenCount: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f39c12' },
  lockedGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' },
  lockedCard: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.25rem',
  },
  lockedIcon: { fontSize: '1.2rem' },
  lockedName: { fontFamily: 'var(--font-title)', fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 },
  lockedHint: { fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'center' as const, margin: 0, lineHeight: 1.4 },
  unlockedBadge: { fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#f39c12', margin: '0.2rem 0 0', textAlign: 'center' },
  startBtn: {
    background: 'var(--text-gold)', border: 'none', color: '#111', cursor: 'pointer',
    borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.05em',
    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
  },
  awakeningOverlay: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500,
  },
  awakeningBox: {
    background: 'rgba(15,10,25,0.98)', border: '1px solid rgba(243,156,18,0.6)',
    borderRadius: '12px', padding: '2rem', maxWidth: '420px', width: '90%',
    display: 'flex', flexDirection: 'column' as const, gap: '1rem', alignItems: 'center',
    boxShadow: '0 0 40px rgba(243,156,18,0.3)',
  },
  awakeningTitle: {
    fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: '#f39c12',
    margin: 0, textAlign: 'center' as const, letterSpacing: '0.1em',
  },
  awakeningItem: {
    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.25)',
    borderRadius: '8px', padding: '0.75rem', width: '100%',
  },
  awakeningIcon: { fontSize: '1.5rem' },
  awakeningName: {
    fontFamily: 'var(--font-title)', fontSize: '0.95rem', color: '#f39c12', margin: '0 0 0.2rem',
  },
  awakeningDesc: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4,
  },
  awakeningBtn: {
    padding: '0.6rem 2rem', background: 'linear-gradient(135deg, #f39c12, #e67e22)',
    border: 'none', borderRadius: '6px', color: '#111', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 'bold',
  },
};
