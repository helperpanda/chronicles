import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { chapter1Classes, chapter2Classes, chapter1HiddenClasses, chapter1HiddenConditions, hiddenClassHints, chapter2HiddenClasses, chapter2HiddenConditions, chapter2HiddenHints } from '../data';
import type { GameClass } from '../data/_schema';
import { useT, useContent } from '../i18n';

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
};

function ClassCard({ cls, isSelected, color, bg, onSelect }: {
  cls: GameClass; isSelected: boolean; color: string; bg: string;
  onSelect: (cls: GameClass) => void;
}) {
  const tc = useContent();
  return (
    <button
      style={{
        ...styles.card,
        borderColor: isSelected ? color : 'rgba(255,255,255,0.1)',
        boxShadow: isSelected ? `0 0 20px ${color}55` : 'none',
        background: isSelected ? `${color}11` : bg,
      }}
      onClick={() => onSelect(cls)}
    >
      <span style={styles.icon}>{CLASS_ICONS[cls.id] ?? '⚡'}</span>
      <div style={{ ...styles.classColor, background: color }} />
      <h3 style={{ ...styles.className, color: isSelected ? color : 'var(--text-primary)' }}>
        {tc.cls(cls.id, 'name', cls.name)}
      </h3>
      <p style={styles.subtitle}>{cls.subtitle}</p>
      <p style={styles.desc}>{tc.cls(cls.id, 'description', cls.description)}</p>
      <div style={styles.stats}>
        {(['hp', 'mp', 'str', 'int', 'dex', 'con'] as const).map(stat => (
          <div key={stat} style={styles.stat}>
            <span style={styles.statLabel}>{stat.toUpperCase()}</span>
            <span style={styles.statValue}>{cls.baseStats[stat]}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function ClassSelectScreen() {
  const { startRun, setScreen, unlockedHiddenClasses } = useGameStore();
  const [selected, setSelected] = useState<GameClass | null>(null);
  const [name, setName] = useState('');
  const t = useT();
  const tc = useContent();

  const allHiddenClasses = [...chapter1HiddenClasses, ...chapter2HiddenClasses];
  const allHiddenConditions = [...chapter1HiddenConditions, ...chapter2HiddenConditions];
  const allHiddenHints = { ...hiddenClassHints, ...chapter2HiddenHints };

  const unlockedHidden = allHiddenClasses.filter(c => unlockedHiddenClasses.includes(c.id));
  const lockedHidden = allHiddenConditions.filter(c => !unlockedHiddenClasses.includes(c.id));

  const handleStart = () => {
    if (!selected) return;
    const charName = name.trim() || selected.name;
    startRun(selected.id, charName);
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => setScreen('title')}>{t('classSelect.back')}</button>
      <h2 style={styles.heading}>{t('classSelect.heading')}</h2>
      <p style={styles.hint}>{t('classSelect.hint')}</p>

      {[
        { label: t('classSelect.chapter1Label'), classes: chapter1Classes, accent: 'rgba(255,255,255,0.06)' },
        { label: t('classSelect.chapter2Label'), classes: chapter2Classes, accent: 'rgba(52,152,219,0.06)' },
      ].map(section => (
        <div key={section.label} style={{ width: '100%', maxWidth: '700px', marginBottom: '1.5rem' }}>
          <p style={styles.chapterLabel}>{section.label}</p>
          <div style={styles.grid}>
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

      <div style={styles.hiddenSection}>
        <h3 style={styles.hiddenHeading}>
          🔓 {t('classSelect.hidden')}
          {unlockedHidden.length > 0 && (
            <span style={styles.hiddenCount}> {t('classSelect.unlockedCount', { n: unlockedHidden.length })}/{allHiddenConditions.length}</span>
          )}
        </h3>

        {unlockedHidden.length > 0 && (
          <div style={styles.grid}>
            {unlockedHidden.map(cls => {
              const isSelected = selected?.id === cls.id;
              return (
                <button
                  key={cls.id}
                  style={{
                    ...styles.card,
                    borderColor: isSelected ? '#f39c12' : 'rgba(243,156,18,0.4)',
                    boxShadow: isSelected ? '0 0 20px rgba(243,156,18,0.4)' : 'none',
                    background: 'rgba(243,156,18,0.06)',
                  }}
                  onClick={() => setSelected(cls)}
                >
                  <span style={styles.icon}>{HIDDEN_ICONS[cls.id] ?? '⚡'}</span>
                  <div style={{ ...styles.classColor, background: '#f39c12' }} />
                  <h3 style={{ ...styles.className, color: isSelected ? '#f39c12' : 'var(--text-primary)' }}>
                    {tc.cls(cls.id, 'name', cls.name)}
                  </h3>
                  <p style={styles.subtitle}>{cls.subtitle}</p>
                  <p style={styles.desc}>{tc.cls(cls.id, 'description', cls.description)}</p>
                  <div style={styles.stats}>
                    {(['hp', 'mp', 'str', 'int', 'dex', 'con'] as const).map(stat => (
                      <div key={stat} style={styles.stat}>
                        <span style={styles.statLabel}>{stat.toUpperCase()}</span>
                        <span style={styles.statValue}>{cls.baseStats[stat]}</span>
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
          {lockedHidden.map(cond => (
            <div key={cond.id} style={styles.lockedCard}>
              <span style={styles.lockedIcon}>❓</span>
              <p style={styles.lockedName}>???</p>
              <p style={styles.lockedHint}>{allHiddenHints[cond.id]}</p>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={styles.confirm}>
          <input
            style={styles.nameInput}
            placeholder={t('classSelect.nameHint', { name: tc.cls(selected.id, 'name', selected.name) })}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
          />
          <button style={styles.startBtn} onClick={handleStart}>
            {CLASS_ICONS[selected.id] ?? '⚡'} {t('classSelect.startBtn', { name: tc.cls(selected.id, 'name', selected.name) })}
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '2rem 1rem', overflowY: 'auto',
  },
  backBtn: {
    alignSelf: 'flex-start', background: 'transparent', border: 'none',
    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
    fontFamily: 'var(--font-body)', marginBottom: '1rem',
  },
  heading: {
    fontFamily: 'var(--font-title)', fontSize: '2rem',
    color: 'var(--text-gold)', marginBottom: '0.25rem',
  },
  hint: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '700px', width: '100%' },
  chapterLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    margin: '0 0 0.6rem', paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  card: {
    border: '1px solid', borderRadius: '8px', padding: '1.25rem', cursor: 'pointer',
    textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.4rem',
    transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
  },
  icon: { fontSize: '1.8rem' },
  classColor: { position: 'absolute', top: 0, left: 0, right: 0, height: '3px' },
  className: { fontFamily: 'var(--font-title)', fontSize: '1.1rem', margin: 0, transition: 'color 0.2s' },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 },
  desc: { fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.25rem 0', lineHeight: 1.5 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem', marginTop: '0.5rem' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '0.2rem' },
  statLabel: { fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-secondary)' },
  statValue: { fontFamily: 'var(--font-title)', fontSize: '0.9rem', color: 'var(--text-primary)' },
  confirm: { marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '400px' },
  nameInput: {
    width: '100%', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  },
  hiddenSection: { marginTop: '2.5rem', width: '100%', maxWidth: '700px' },
  hiddenHeading: {
    fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--text-secondary)',
    marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem',
  },
  hiddenCount: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f39c12' },
  lockedGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' },
  lockedCard: {
    padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.3rem', minWidth: '120px', opacity: 0.6,
  },
  lockedIcon: { fontSize: '1.4rem' },
  lockedName: { fontFamily: 'var(--font-title)', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 },
  lockedHint: { fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: 1.4 },
  unlockedBadge: { fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#f39c12', margin: '0.25rem 0 0', textAlign: 'center' },
  startBtn: {
    padding: '0.75rem 2.5rem', fontFamily: 'var(--font-body)', fontSize: '1rem',
    background: 'var(--text-gold)', border: 'none', color: '#111', cursor: 'pointer',
    borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.05em',
  },
};
