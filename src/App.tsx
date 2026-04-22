import React from 'react';
import { useGameStore } from './store/gameStore';
import type { RunStats } from './store/gameStore';
import { chapter1, chapter2 } from './data';
import TitleScreen from './screens/TitleScreen';
import ClassSelectScreen from './screens/ClassSelectScreen';
import MapScreen from './screens/MapScreen';
import BattleScreen from './screens/BattleScreen';
import EventScreen from './screens/EventScreen';
import ShopScreen from './screens/ShopScreen';
import RestScreen from './screens/RestScreen';
import { useT, useLangStore } from './i18n';

function LangToggle() {
  const { lang, toggle } = useLangStore();
  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed', top: '0.75rem', right: '0.75rem', zIndex: 9999,
        padding: '0.3rem 0.65rem', background: 'rgba(30,30,40,0.85)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
        color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
        fontSize: '0.78rem', cursor: 'pointer', backdropFilter: 'blur(4px)',
        letterSpacing: '0.04em',
      }}
    >
      {lang === 'ko' ? 'EN' : '한'}
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={statStyles.row}>
      <span style={statStyles.label}>{label}</span>
      <span style={statStyles.value}>{value}</span>
    </div>
  );
}

function RunSummary({ stats, accent }: { stats: RunStats; accent: string }) {
  const t = useT();
  return (
    <div style={{ ...statStyles.box, borderColor: accent }}>
      <p style={{ ...statStyles.name, color: accent }}>{stats.characterName}</p>
      <p style={statStyles.sub}>{t(`class.${stats.classId}`) ?? stats.classId} · Lv.{stats.level}</p>
      <div style={statStyles.grid}>
        <StatRow label={t('stats.kills')} value={stats.kills} />
        <StatRow label={t('stats.combos')} value={stats.combos} />
        <StatRow label={t('stats.turns')} value={stats.turns} />
        <StatRow label={t('stats.floors')} value={stats.floorsCleared} />
        <StatRow label={t('stats.gold')} value={`${stats.gold}G`} />
        <StatRow label={t('stats.deck')} value={stats.deckSize} />
      </div>
    </div>
  );
}

const statStyles: Record<string, React.CSSProperties> = {
  box: {
    width: '100%', maxWidth: '360px', border: '1px solid',
    borderRadius: '8px', padding: '1.25rem',
    background: 'rgba(255,255,255,0.04)',
  },
  name: {
    fontFamily: 'var(--font-title)', fontSize: '1.1rem', margin: '0 0 0.2rem',
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'var(--font-body)', fontSize: '0.78rem',
    color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 1rem',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' },
  row: { display: 'flex', justifyContent: 'space-between' },
  label: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-secondary)' },
  value: { fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' },
};

function GameOverScreen() {
  const { setScreen, lastRunStats } = useGameStore(s => ({ setScreen: s.setScreen, lastRunStats: s.lastRunStats }));
  const t = useT();
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg-primary)', padding: '2rem',
    }}>
      <h1 style={{ fontFamily: 'var(--font-title)', color: '#e74c3c', fontSize: '2.5rem', margin: 0 }}>
        {t('gameover.title')}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
        {t('gameover.subtitle')}
      </p>
      {lastRunStats && <RunSummary stats={lastRunStats} accent="#e74c3c" />}
      <button
        onClick={() => setScreen('title')}
        style={{
          marginTop: '0.5rem', padding: '0.7rem 2rem', background: 'transparent',
          border: '1px solid #e74c3c', color: '#e74c3c', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '1rem', borderRadius: '4px',
        }}
      >
        {t('gameover.back')}
      </button>
    </div>
  );
}

function ChapterClearScreen() {
  const { setScreen, run } = useGameStore(s => ({ setScreen: s.setScreen, run: s.run }));
  const t = useT();
  const chapterData = run?.chapter === 2 ? chapter2 : chapter1;
  const prevChapter = chapterData.id - 1;
  const prevData = prevChapter === 1 ? chapter1 : null;
  const storyText = (prevData ?? chapter1).storyBeats.find(b => b.trigger === 'boss_defeated')?.text ?? '';

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
      background: 'var(--bg-primary)', padding: '2rem',
    }}>
      <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-gold)', fontSize: '2rem', margin: 0 }}>
        {t('chapterClear.title', { n: prevChapter })}
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', color: 'var(--text-secondary)',
        fontStyle: 'italic', maxWidth: '480px', textAlign: 'center',
        lineHeight: 1.7, borderLeft: '2px solid rgba(212,175,55,0.4)',
        paddingLeft: '1rem',
      }}>
        {storyText}
      </p>
      <div style={{
        padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-title)', color: '#3498db', fontSize: '1rem', margin: '0 0 0.25rem' }}>
          Chapter {run?.chapter}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>
          {chapterData.subtitle}
        </p>
      </div>
      <button
        onClick={() => setScreen('map')}
        style={{
          padding: '0.75rem 2.5rem', background: 'var(--text-gold)',
          border: 'none', color: '#111', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '1rem', borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        {t('chapterClear.next')}
      </button>
    </div>
  );
}

function VictoryScreen() {
  const { setScreen, lastRunStats } = useGameStore(s => ({ setScreen: s.setScreen, lastRunStats: s.lastRunStats }));
  const t = useT();
  const ch = lastRunStats?.chapterCompleted ?? 1;
  const flavorText = t(`victory.ch${ch}`);
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg-primary)', padding: '2rem',
    }}>
      <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-gold)', fontSize: '2.5rem', margin: 0 }}>
        {t('victory.title')}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
        {flavorText}
      </p>
      {lastRunStats && <RunSummary stats={lastRunStats} accent="var(--text-gold)" />}
      <button
        onClick={() => setScreen('title')}
        style={{
          marginTop: '0.5rem', padding: '0.7rem 2rem', background: 'var(--text-gold)',
          border: 'none', color: '#111', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '1rem', borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        {t('victory.back')}
      </button>
    </div>
  );
}

export default function App() {
  const screen = useGameStore(s => s.screen);

  let content: React.ReactElement;
  switch (screen) {
    case 'title':        content = <TitleScreen />; break;
    case 'class_select': content = <ClassSelectScreen />; break;
    case 'map':          content = <MapScreen />; break;
    case 'battle':       content = <BattleScreen />; break;
    case 'event':        content = <EventScreen />; break;
    case 'shop':         content = <ShopScreen />; break;
    case 'rest':         content = <RestScreen />; break;
    case 'chapter_clear': content = <ChapterClearScreen />; break;
    case 'game_over':    content = <GameOverScreen />; break;
    case 'victory':      content = <VictoryScreen />; break;
    default:             content = <TitleScreen />;
  }

  return (
    <>
      <LangToggle />
      {content}
    </>
  );
}
