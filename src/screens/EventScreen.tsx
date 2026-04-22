import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { chapter1Events, chapter2Events } from '../data';
import type { EventChoice, EventOutcome } from '../data/_schema';
import { useT, useContent } from '../i18n';

export default function EventScreen() {
  const { clearRoom, setScreen, gainGold, healHp, takeDamage, run } = useGameStore();
  const [outcome, setOutcome] = useState<{ data: EventOutcome; idx: number; choiceId: string } | null>(null);
  const t = useT();
  const tc = useContent();

  const event = useMemo(() => {
    const pool = (run?.chapter ?? 1) === 1 ? chapter1Events : chapter2Events;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const handleChoice = (choice: EventChoice) => {
    const total = choice.outcomes.reduce((a, b) => a + b.probability, 0);
    let r = Math.random() * total;
    let picked = choice.outcomes[0];
    let pickedIdx = 0;
    for (let i = 0; i < choice.outcomes.length; i++) {
      r -= choice.outcomes[i].probability;
      if (r <= 0) { picked = choice.outcomes[i]; pickedIdx = i; break; }
    }
    picked.effects.forEach(e => {
      if (e.type === 'heal') healHp(e.value);
      if (e.type === 'damage') takeDamage(e.value);
      if (e.type === 'special' && e.value > 0) gainGold(e.value);
    });
    setOutcome({ data: picked, idx: pickedIdx, choiceId: choice.id });
  };

  const handleContinue = () => {
    clearRoom();
    setScreen('map');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{tc.eventTitle(event.id, event.title)}</h2>
        <p style={styles.desc}>{tc.eventDesc(event.id, event.description)}</p>

        {!outcome ? (
          <div style={styles.choices}>
            {event.choices.map(choice => (
              <button
                key={choice.id}
                style={styles.choiceBtn}
                onClick={() => handleChoice(choice)}
              >
                {tc.choiceText(event.id, choice.id, choice.text)}
                {choice.requirement && (
                  <span style={styles.req}> ({choice.requirement})</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div style={styles.outcomeArea}>
            <p style={styles.outcomeText}>
              {tc.outcomeText(event.id, outcome.choiceId, outcome.idx, outcome.data.description)}
            </p>
            <button style={styles.continueBtn} onClick={handleContinue}>
              {t('event.continue')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)', padding: '1rem',
  },
  card: {
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
    padding: '2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
    maxWidth: '480px', width: '100%',
  },
  title: {
    fontFamily: 'var(--font-title)', fontSize: '1.4rem',
    color: 'var(--text-gold)', margin: 0,
  },
  desc: {
    fontFamily: 'var(--font-body)', fontSize: '0.87rem',
    color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0,
    borderLeft: '2px solid rgba(212,175,55,0.4)', paddingLeft: '0.75rem',
    fontStyle: 'italic',
  },
  choices: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  choiceBtn: {
    padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
    color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
    fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.4,
    transition: 'background 0.2s',
  },
  req: { color: 'var(--text-secondary)', fontSize: '0.75rem' },
  outcomeArea: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  outcomeText: {
    fontFamily: 'var(--font-body)', fontSize: '0.87rem',
    color: 'var(--text-primary)', lineHeight: 1.7,
    padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px',
    borderLeft: '2px solid #f39c12',
  },
  continueBtn: {
    padding: '0.65rem 1.5rem', background: 'var(--text-gold)', border: 'none',
    color: '#111', cursor: 'pointer', borderRadius: '4px', alignSelf: 'flex-end',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 'bold',
  },
};
