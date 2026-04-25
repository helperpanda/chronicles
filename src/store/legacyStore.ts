import { create } from 'zustand';

export interface LegacyUpgradeDef {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  costs: number[];
  stat: string;
  valuePerLevel: number;
}

export const LEGACY_UPGRADES: LegacyUpgradeDef[] = [
  { id: 'legacy_hp',          name: '강인한 육체',   description: '시작 HP +35',                        maxLevel: 1, costs: [30], stat: 'hp',             valuePerLevel: 35 },
  { id: 'legacy_mp',          name: '마법 친화',     description: '시작 MP +30',                        maxLevel: 1, costs: [30], stat: 'mp',             valuePerLevel: 30 },
  { id: 'legacy_gold',        name: '행운의 주머니', description: '시작 골드 +80',                      maxLevel: 1, costs: [20], stat: 'gold',           valuePerLevel: 80 },
  { id: 'legacy_card',        name: '날카로운 본능', description: '시작 덱에 에픽 카드 1장',            maxLevel: 1, costs: [40], stat: 'rareCard',       valuePerLevel: 1  },
  { id: 'legacy_revive',      name: '불사의 의지',   description: '런당 부활 1회 (HP 40% 회복)',        maxLevel: 1, costs: [50], stat: 'revive',         valuePerLevel: 1  },
  { id: 'legacy_combo_card',  name: '전투의 기억',   description: '시작 덱에 랜덤 콤보 카드 1장',       maxLevel: 1, costs: [40], stat: 'startComboCard', valuePerLevel: 1  },
  { id: 'legacy_card_choice', name: '유산의 지혜',   description: '매 챕터 시작 시 카드 선택지 +1개',   maxLevel: 1, costs: [60], stat: 'extraCardChoice', valuePerLevel: 1 },
];

interface LegacyState {
  shards: number;
  upgrades: Record<string, number>;
}

interface LegacyStore extends LegacyState {
  addShards: (n: number) => void;
  purchaseUpgrade: (id: string) => boolean;
  getLevel: (id: string) => number;
  getNextCost: (id: string) => number | null;
  getBonus: (stat: string) => number;
}

function loadLegacy(): LegacyState {
  try {
    const raw = localStorage.getItem('chronicles_legacy');
    if (!raw) return { shards: 0, upgrades: {} };
    return JSON.parse(raw) as LegacyState;
  } catch {
    return { shards: 0, upgrades: {} };
  }
}

function saveLegacy(state: LegacyState) {
  localStorage.setItem('chronicles_legacy', JSON.stringify(state));
}

const _legacySaved = loadLegacy();

export const useLegacyStore = create<LegacyStore>((set, get) => ({
  shards: _legacySaved.shards,
  upgrades: _legacySaved.upgrades,

  addShards: (n) => set(s => {
    const next: LegacyState = { shards: s.shards + n, upgrades: s.upgrades };
    saveLegacy(next);
    return { shards: next.shards };
  }),

  purchaseUpgrade: (id) => {
    const s = get();
    const cost = s.getNextCost(id);
    if (cost === null || s.shards < cost) return false;
    const upgrades = { ...s.upgrades, [id]: (s.upgrades[id] ?? 0) + 1 };
    const shards = s.shards - cost;
    saveLegacy({ shards, upgrades });
    set({ shards, upgrades });
    return true;
  },

  getLevel: (id) => get().upgrades[id] ?? 0,

  getNextCost: (id) => {
    const def = LEGACY_UPGRADES.find(u => u.id === id);
    if (!def) return null;
    const level = get().upgrades[id] ?? 0;
    if (level >= def.maxLevel) return null;
    return def.costs[level];
  },

  getBonus: (stat) => {
    const { upgrades } = get();
    return LEGACY_UPGRADES
      .filter(u => u.stat === stat)
      .reduce((acc, u) => acc + (upgrades[u.id] ?? 0) * u.valuePerLevel, 0);
  },
}));
