// ─── Effect ───────────────────────────────────────────────
export type EffectType =
  | 'damage' | 'magic_damage' | 'heal' | 'shield'
  | 'buff' | 'debuff' | 'draw' | 'mana' | 'special';

export interface Effect {
  type: EffectType;
  value: number;
  duration?: number;       // 버프/디버프 지속 턴
  target?: 'self' | 'enemy' | 'all_enemies';
  stat?: string;           // buff/debuff 대상 스탯
  element?: string;
}

// ─── Skill Card ───────────────────────────────────────────
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardType = 'attack' | 'defense' | 'buff' | 'special';
export type Element = 'fire' | 'ice' | 'lightning' | 'dark' | 'holy' | 'nature';

export interface SkillCard {
  id: string;
  name: string;
  class: string;
  chapter: number;
  manaCost: number;
  type: CardType;
  element?: Element;
  description: string;
  effects: Effect[];
  comboTag?: string[];
  rarity: CardRarity;
}

// ─── Combo Recipe ─────────────────────────────────────────
export interface ComboRecipe {
  id: string;
  name: string;
  requiredTags: string[][];
  resultEffect: Effect[];
  manaCost: number;
  flavor: string;
  unlockChapter?: number;
}

// ─── Monster ──────────────────────────────────────────────
export type MonsterTier = 'normal' | 'elite' | 'boss';

export interface MonsterAction {
  id: string;
  name: string;
  description: string;
  effects: Effect[];
  weight: number;          // 행동 선택 가중치
}

export interface Monster {
  id: string;
  name: string;
  description: string;
  tier: MonsterTier;
  chapter: number;
  hp: number;
  maxHp: number;
  defense: number;
  magicDefense: number;
  actions: MonsterAction[];
  drops: DropTable[];
  expReward: number;
  goldReward: [number, number];  // [min, max]
}

export interface DropTable {
  itemId: string;
  chance: number;
}

// ─── Class ────────────────────────────────────────────────
export interface GameClass {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  chapter: number;
  hidden: boolean;
  baseStats: {
    hp: number; mp: number;
    str: number; int: number; dex: number; con: number;
  };
  startingDeck: string[];   // skill card ids
  passives: string[];
}

// ─── Multiclass ───────────────────────────────────────────
export interface MulticlassRecipe {
  classes: string[];
  result: string;
  unlockCondition: string;
  bonusSkills: string[];
  hiddenVariant?: { condition: string; result: string };
}

// ─── Hidden Class ─────────────────────────────────────────
export interface HiddenClass {
  id: string;
  name: string;
  condition: {
    type: string;
    threshold?: number;
    count?: number;
    scope: 'run' | 'career';
  };
  hint: string;
}

// ─── Event ────────────────────────────────────────────────
export interface EventChoice {
  id: string;
  text: string;
  requirement?: string;
  outcomes: EventOutcome[];
}

export interface EventOutcome {
  description: string;      // DM 나레이션
  effects: Effect[];
  probability: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;      // DM 나레이션 도입부
  choices: EventChoice[];
  chapter: number;
}

// ─── Item ─────────────────────────────────────────────────
export type ItemType = 'potion' | 'relic' | 'equipment';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  effects: Effect[];
  chapter: number;
  price: number;
}

// ─── Chapter ──────────────────────────────────────────────
export interface RoomConfig {
  type: 'combat' | 'elite' | 'event' | 'shop' | 'rest' | 'boss';
  weight: number;
}

export interface StoryBeat {
  trigger: string;
  text: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  floors: number;
  roomsPerFloor: number;
  roomConfig: RoomConfig[];
  newClasses?: string[];
  newCombos?: string[];
  hiddenUnlocks?: HiddenClass[];
  bossId: string;
  storyBeats: StoryBeat[];
}

// ─── Game State ───────────────────────────────────────────
export interface CharacterState {
  classId: string;
  name: string;
  level: number;
  exp: number;
  expToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number; int: number; dex: number; con: number;
  gold: number;
  deck: SkillCard[];
  inventory: Item[];
  relics: Item[];
  unlockedCombos: string[];
  careerStats: Record<string, number>;  // 히든 직업 조건 추적용
}
