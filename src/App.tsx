import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import type { RunStats } from './store/gameStore';
import { useLegacyStore, LEGACY_UPGRADES } from './store/legacyStore';
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
  const totalShards = useLegacyStore(s => s.shards);
  const t = useT();
  const shards = lastRunStats?.shardsEarned ?? 0;
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg-primary)', padding: '2rem', overflowY: 'auto',
    }}>
      <h1 style={{ fontFamily: 'var(--font-title)', color: '#e74c3c', fontSize: '2.5rem', margin: 0 }}>
        {t('gameover.title')}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
        {t('gameover.subtitle')}
      </p>
      {lastRunStats && <RunSummary stats={lastRunStats} accent="#e74c3c" />}

      {/* Shard reward */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
        padding: '0.85rem 1.5rem', background: 'rgba(243,156,18,0.08)',
        border: '1px solid rgba(243,156,18,0.3)', borderRadius: '8px',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#f39c12', margin: 0 }}>
          ◆ 이번 죽음으로 <strong>{shards}개</strong>의 파편을 획득했습니다
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
          총 보유 파편: ◆ {totalShards}개 · 죽을수록 강해진다
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
        <button
          onClick={() => setScreen('legacy')}
          style={{
            padding: '0.7rem 1.5rem', background: 'rgba(243,156,18,0.15)',
            border: '1px solid #f39c12', color: '#f39c12', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.95rem', borderRadius: '4px', fontWeight: 'bold',
          }}
        >
          ◆ 유산 강화
        </button>
        <button
          onClick={() => setScreen('title')}
          style={{
            padding: '0.7rem 1.5rem', background: 'transparent',
            border: '1px solid #e74c3c', color: '#e74c3c', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.95rem', borderRadius: '4px',
          }}
        >
          {t('gameover.back')}
        </button>
      </div>
    </div>
  );
}

// ─── Legacy Screen ─────────────────────────────────────────────────────────────

function LegacyScreen() {
  const { setScreen } = useGameStore(s => ({ setScreen: s.setScreen }));
  const { shards, getLevel, getNextCost, purchaseUpgrade } = useLegacyStore();
  const [lastBought, setLastBought] = useState<string | null>(null);

  const handleBuy = (id: string) => {
    const ok = purchaseUpgrade(id);
    if (ok) { setLastBought(id); setTimeout(() => setLastBought(null), 600); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2rem 1rem', gap: '1.5rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', color: '#f39c12', fontSize: '2rem', margin: '0 0 0.3rem' }}>
          영원한 유산
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
          죽을수록 강해진다. 파편을 소비해 영구 능력치를 강화하라.
        </p>
      </div>

      <div style={{
        padding: '0.6rem 1.5rem', background: 'rgba(243,156,18,0.12)',
        border: '1px solid #f39c12', borderRadius: '8px',
        fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: '#f39c12',
      }}>
        ◆ {shards} 파편 보유
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem', width: '100%', maxWidth: '680px',
      }}>
        {LEGACY_UPGRADES.map(upg => {
          const level = getLevel(upg.id);
          const cost = getNextCost(upg.id);
          const maxed = level >= upg.maxLevel;
          const canAfford = cost !== null && shards >= cost;
          const justBought = lastBought === upg.id;

          return (
            <div
              key={upg.id}
              style={{
                border: `1px solid ${maxed ? '#f39c1244' : canAfford ? '#f39c12' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '8px', padding: '0.9rem',
                background: maxed ? 'rgba(243,156,18,0.05)' : 'rgba(255,255,255,0.03)',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                transition: 'all 0.2s',
                boxShadow: justBought ? '0 0 16px #f39c1266' : 'none',
              }}
            >
              <p style={{ fontFamily: 'var(--font-title)', fontSize: '0.85rem', color: maxed ? '#f39c12' : 'var(--text-primary)', margin: 0 }}>
                {upg.name}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                {upg.description}
              </p>
              {/* Level dots */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '0.1rem' }}>
                {Array.from({ length: upg.maxLevel }).map((_, i) => (
                  <div key={i} style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: i < level ? '#f39c12' : 'rgba(255,255,255,0.12)',
                    boxShadow: i < level ? '0 0 5px #f39c1288' : 'none',
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
              {maxed ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#f39c12', margin: 0, fontWeight: 'bold' }}>
                  최대 레벨
                </p>
              ) : (
                <button
                  onClick={() => handleBuy(upg.id)}
                  disabled={!canAfford}
                  style={{
                    padding: '0.3rem 0.6rem', marginTop: '0.1rem',
                    background: canAfford ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${canAfford ? '#f39c12' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '4px',
                    color: canAfford ? '#f39c12' : 'var(--text-secondary)',
                    cursor: canAfford ? 'pointer' : 'default',
                    fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                    transition: 'all 0.15s',
                  }}
                >
                  ◆ {cost} 파편
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setScreen('title')}
        style={{
          padding: '0.65rem 2rem', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.25)', color: 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', borderRadius: '4px',
        }}
      >
        ← 타이틀로
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
  const totalShards = useLegacyStore(s => s.shards);
  const t = useT();
  const ch = lastRunStats?.chapterCompleted ?? 1;
  const flavorText = t(`victory.ch${ch}`);
  const shards = lastRunStats?.shardsEarned ?? 0;
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg-primary)', padding: '2rem', overflowY: 'auto',
    }}>
      <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-gold)', fontSize: '2.5rem', margin: 0 }}>
        {t('victory.title')}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
        {flavorText}
      </p>
      {lastRunStats && <RunSummary stats={lastRunStats} accent="var(--text-gold)" />}
      <div style={{
        padding: '0.7rem 1.5rem', background: 'rgba(243,156,18,0.08)',
        border: '1px solid rgba(243,156,18,0.3)', borderRadius: '8px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#f39c12', margin: '0 0 0.2rem' }}>
          ◆ 승리 보너스 포함 <strong>{shards}개</strong>의 파편 획득
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
          총 보유 파편: ◆ {totalShards}개
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setScreen('legacy')}
          style={{
            padding: '0.7rem 1.5rem', background: 'rgba(243,156,18,0.15)',
            border: '1px solid #f39c12', color: '#f39c12', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.95rem', borderRadius: '4px', fontWeight: 'bold',
          }}
        >
          ◆ 유산 강화
        </button>
        <button
          onClick={() => setScreen('title')}
          style={{
            padding: '0.7rem 1.5rem', background: 'var(--text-gold)',
            border: 'none', color: '#111', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.95rem', borderRadius: '4px', fontWeight: 'bold',
          }}
        >
          {t('victory.back')}
        </button>
      </div>
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
    case 'legacy':       content = <LegacyScreen />; break;
    default:             content = <TitleScreen />;
  }

  return (
    <>
      <LangToggle />
      {content}
    </>
  );
}
