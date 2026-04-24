import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLegacyStore } from '../store/legacyStore';
import { NOTICES } from '../data/notice';
import { useT } from '../i18n';

function NoticeModal({ onClose }: { onClose: () => void }) {
  const latest = NOTICES[NOTICES.length - 1];
  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <p style={modal.date}>{latest.date}</p>
        <h2 style={modal.title}>{latest.title}</h2>
        <p style={modal.content}>{latest.content}</p>
        <button style={modal.close} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

const modal: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  box: {
    background: 'var(--bg-secondary, #1a1a2e)',
    border: '1px solid rgba(212,175,55,0.4)',
    borderRadius: '10px', padding: '2rem', maxWidth: '360px', width: '90%',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
  },
  date: {
    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
    color: 'var(--text-secondary)', margin: 0,
  },
  title: {
    fontFamily: 'var(--font-title)', fontSize: '1.1rem',
    color: 'var(--text-gold)', margin: 0,
  },
  content: {
    fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    color: 'var(--text-primary)', lineHeight: 1.6, margin: 0,
  },
  close: {
    alignSelf: 'flex-end', padding: '0.4rem 1.2rem',
    background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
    color: 'var(--text-secondary)', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '0.85rem', borderRadius: '4px',
  },
};

export default function TitleScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const savedRun = useGameStore(s => s.run);
  const shards = useLegacyStore(s => s.shards);
  const t = useT();
  const [showNotice, setShowNotice] = useState(false);

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
        <button
          style={{ ...styles.btn, marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}
          onClick={() => setScreen('legacy')}
        >
          ◆ 유산 강화 {shards > 0 ? `(${shards})` : ''}
        </button>
        <button
          style={{ ...styles.btn, marginTop: '0.25rem', fontSize: '0.8rem', opacity: 0.65 }}
          onClick={() => setShowNotice(true)}
        >
          📢 공지
        </button>
      </div>
      {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}
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
