import { useGameStore } from '../store/gameStore';
import { useT } from '../i18n';

export default function RestScreen() {
  const { character, healHp, clearRoom, setScreen } = useGameStore();
  const t = useT();
  if (!character) return null;

  const healAmount = Math.floor(character.maxHp * 0.3);
  const canHeal = character.hp < character.maxHp;

  const handleRest = () => {
    if (canHeal) healHp(healAmount);
    clearRoom();
    setScreen('map');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.icon}>🔥</span>
        <h2 style={styles.title}>{t('rest.title')}</h2>
        <p style={styles.desc}>{t('rest.desc')}</p>
        <div style={styles.info}>
          <span style={styles.infoLabel}>{t('rest.currentHp')}</span>
          <span style={styles.infoValue}>{character.hp} / {character.maxHp}</span>
        </div>
        {canHeal && (
          <div style={styles.info}>
            <span style={styles.infoLabel}>{t('rest.recovery')}</span>
            <span style={{ ...styles.infoValue, color: '#2ecc71' }}>+{healAmount}</span>
          </div>
        )}
        <button style={styles.btn} onClick={handleRest}>
          {canHeal ? t('rest.doRest', { n: healAmount }) : t('rest.noRest')}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)',
  },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
    padding: '2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
    maxWidth: '360px', width: '90%', textAlign: 'center',
  },
  icon: { fontSize: '3rem' },
  title: {
    fontFamily: 'var(--font-title)', fontSize: '1.5rem',
    color: 'var(--text-gold)', margin: 0,
  },
  desc: {
    fontFamily: 'var(--font-body)', fontSize: '0.85rem',
    color: 'var(--text-secondary)', lineHeight: 1.6,
  },
  info: { display: 'flex', gap: '1rem', alignItems: 'center' },
  infoLabel: { fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' },
  infoValue: { fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--text-primary)' },
  btn: {
    padding: '0.75rem 1.5rem', background: '#e67e22', border: 'none',
    color: '#fff', cursor: 'pointer', borderRadius: '6px',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '0.5rem',
  },
};
