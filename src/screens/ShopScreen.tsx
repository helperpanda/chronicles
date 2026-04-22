import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { chapter1SkillCards, chapter1Items, chapter2SkillCards, chapter2Items } from '../data';
import type { SkillCard, Item } from '../data/_schema';
import { useT, useContent } from '../i18n';

const RARITY_COLOR: Record<string, string> = {
  common: '#aaa', rare: '#3498db', epic: '#9b59b6', legendary: '#f39c12',
};

const CARD_PRICES: Record<string, number> = {
  common: 60, rare: 150, epic: 300, legendary: 600,
};

export default function ShopScreen() {
  const { character, run, spendGold, addCardToDeck, addItemToInventory, clearRoom, setScreen } = useGameStore();
  const t = useT();
  const tc = useContent();

  const shopCards = useMemo(() => {
    const ch = run?.chapter ?? 1;
    const pool = ch === 1
      ? [...chapter1SkillCards]
      : [...chapter1SkillCards, ...chapter2SkillCards];
    const picked: SkillCard[] = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }, []);

  const shopItems = useMemo(() => {
    const ch = run?.chapter ?? 1;
    const pool = (ch === 1 ? chapter1Items : [...chapter1Items, ...chapter2Items])
      .filter(i => i.type === 'potion');
    const picked: Item[] = [];
    for (let i = 0; i < 2 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }, []);

  if (!character) return null;

  const buyCard = (card: SkillCard) => {
    const price = CARD_PRICES[card.rarity] ?? 100;
    if (spendGold(price)) addCardToDeck(card);
  };

  const buyItem = (item: Item) => {
    if (spendGold(item.price)) addItemToInventory(item);
  };

  const leave = () => { clearRoom(); setScreen('map'); };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <h2 style={styles.title}>{t('shop.title')}</h2>
          <div style={styles.gold}>{t('shop.gold', { n: character.gold })}</div>
        </div>

        <h3 style={styles.sectionTitle}>{t('shop.cards')}</h3>
        <div style={styles.itemRow}>
          {shopCards.map(card => {
            const price = CARD_PRICES[card.rarity] ?? 100;
            const canAfford = character.gold >= price;
            const color = RARITY_COLOR[card.rarity];
            return (
              <div key={card.id} style={{ ...styles.shopCard, borderColor: color }}>
                <p style={{ ...styles.cardName, color }}>{tc.card(card.id, 'name', card.name)}</p>
                <p style={styles.cardRarity}>
                  {t(`rarity.${card.rarity}`)} · {t(`type.${card.type}`)} · {card.manaCost}💧
                </p>
                <p style={styles.cardDesc}>{tc.card(card.id, 'description', card.description)}</p>
                <button
                  style={{ ...styles.buyBtn, opacity: canAfford ? 1 : 0.4 }}
                  onClick={() => buyCard(card)}
                  disabled={!canAfford}
                >
                  {t('shop.buy', { price })}
                </button>
              </div>
            );
          })}
        </div>

        <h3 style={styles.sectionTitle}>{t('shop.consumables')}</h3>
        <div style={styles.itemRow}>
          {shopItems.map(item => {
            const canAfford = character.gold >= item.price;
            return (
              <div key={item.id} style={styles.shopItem}>
                <p style={styles.cardName}>{tc.item(item.id, 'name', item.name)}</p>
                <p style={styles.cardDesc}>{tc.item(item.id, 'description', item.description)}</p>
                <button
                  style={{ ...styles.buyBtn, opacity: canAfford ? 1 : 0.4 }}
                  onClick={() => buyItem(item)}
                  disabled={!canAfford}
                >
                  {t('shop.buy', { price: item.price })}
                </button>
              </div>
            );
          })}
        </div>

        <button style={styles.leaveBtn} onClick={leave}>{t('shop.leave')}</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', background: 'var(--bg-primary)',
    display: 'flex', justifyContent: 'center', padding: '1.5rem 1rem',
  },
  inner: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--text-gold)', margin: 0 },
  gold: { fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-gold)' },
  sectionTitle: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em',
    margin: '0.5rem 0 0',
  },
  itemRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  shopCard: {
    flex: '1 1 160px', border: '1px solid', borderRadius: '8px',
    padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
    background: 'rgba(255,255,255,0.04)',
  },
  shopItem: {
    flex: '1 1 160px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
    padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
    background: 'rgba(255,255,255,0.04)',
  },
  cardName: { fontFamily: 'var(--font-title)', fontSize: '0.9rem', margin: 0 },
  cardRarity: { fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0 },
  cardDesc: { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.4 },
  buyBtn: {
    marginTop: 'auto', padding: '0.4rem 0.75rem', background: '#27ae60',
    border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px',
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
  },
  leaveBtn: {
    alignSelf: 'center', marginTop: '1rem', padding: '0.65rem 2rem',
    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '4px',
    fontFamily: 'var(--font-body)', fontSize: '0.85rem',
  },
};
