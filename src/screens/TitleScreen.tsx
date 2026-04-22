import { useGameStore } from '../store/gameStore';
import { useT } from '../i18n';

export default function TitleScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const savedRun = useGameStore(s => s.run);
  const t = useT();

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <p style={styles.subtitle}>CHRONICLES OF THE</p>
        <h1 style={styles.title}>FORGOTTEN</h1>
        <p style={styles.tagline}>{t('title.tagline')}</p>
        {savedRun && (
          <button style={{ ...styles.btn, marginBottom: '0.5rem' }} onClick={() => setScreen('map')}>
            {t('title.continue')}
          </button>
        )}
        <button style={styles.btn} onClick={() => setScreen('class_select')}>
          {t('title.start')}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-primary)',
  },
  inner: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
  },
  subtitle: {
    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    color: 'var(--text-secondary)', letterSpacing: '0.3em',
  },
  title: {
    fontFamily: 'var(--font-title)', fontSize: '3.5rem',
    color: 'var(--text-gold)', letterSpacing: '0.15em',
    textShadow: '0 0 30px rgba(212,175,55,0.5)',
  },
  tagline: {
    fontFamily: 'var(--font-body)', fontSize: '0.85rem',
    color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem',
  },
  btn: {
    padding: '0.75rem 2.5rem', fontFamily: 'var(--font-body)',
    fontSize: '1rem', background: 'transparent',
    border: '1px solid var(--text-gold)', color: 'var(--text-gold)',
    cursor: 'pointer', letterSpacing: '0.1em',
    transition: 'all 0.2s',
  },
};
