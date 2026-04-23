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
  { id: 'legacy_hp',     name: '강인한 육체',   description: '시작 최대 HP +10',      maxLevel: 5, costs: [5, 8, 12, 18, 25], stat: 'hp',          valuePerLevel: 10 },
  { id: 'legacy_gold',   name: '황금의 손길',   description: '시작 골드 +20',         maxLevel: 4, costs: [5, 8, 12, 18],     stat: 'gold',        valuePerLevel: 20 },
  { id: 'legacy_str',    name: '근력 수련',     description: '시작 STR +1',           maxLevel: 3, costs: [8, 14, 22],        stat: 'str',         valuePerLevel: 1  },
  { id: 'legacy_int',    name: '마법 연구',     description: '시작 INT +1',           maxLevel: 3, costs: [8, 14, 22],        stat: 'int',         valuePerLevel: 1  },
  { id: 'legacy_dex',    name: '민첩 훈련',     description: '시작 DEX +1',           maxLevel: 3, costs: [8, 14, 22],        stat: 'dex',         valuePerLevel: 1  },
  { id: 'legacy_mana',   name: '마나 확장',     description: '전투 시작 마나 +1',     maxLevel: 2, costs: [20, 35],           stat: 'mana',        valuePerLevel: 1  },
  { id: 'legacy_card',   name: '카드 통찰',     description: '첫 손패 +1장',          maxLevel: 1, costs: [30],              stat: 'startCards',  valuePerLevel: 1  },
  { id: 'legacy_potion', name: '여행자의 준비', description: '런 시작 시 포션 1개',   maxLevel: 1, costs: [20],              stat: 'startPotion', valuePerLevel: 1  },
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
