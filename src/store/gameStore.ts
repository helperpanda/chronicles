import { create } from 'zustand';
import type { CharacterState, SkillCard, Item, GameClass } from '../data/_schema';
import { chapter1Classes, chapter1SkillCards, chapter1HiddenClasses, chapter2Classes, chapter2SkillCards, chapter2HiddenClasses, chapter3Classes, chapter3SkillCards, chapter3HiddenClasses } from '../data';
import { useLegacyStore } from './legacyStore';

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadLS(key: string, fallback: string[]): string[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]; }
  catch { return fallback; }
}
function saveLS(key: string, val: string[]) {
  localStorage.setItem(key, JSON.stringify([...new Set(val)]));
}

function loadRunSave(): { character: CharacterState; run: RunState } | null {
  try {
    const raw = localStorage.getItem('chronicles_run_save');
    if (!raw) return null;
    return JSON.parse(raw) as { character: CharacterState; run: RunState };
  } catch { return null; }
}
function saveRun(character: CharacterState, run: RunState) {
  localStorage.setItem('chronicles_run_save', JSON.stringify({ character, run }));
}
function clearRunSave() {
  localStorage.removeItem('chronicles_run_save');
}

// ─── Career Stats ─────────────────────────────────────────────────────────────

export interface CareerData {
  totalRuns: number;
  chapterClears: Record<number, number>;
  totalKills: number;
  totalDeaths: number;
  totalCombos: number;
  totalPoisonDamage: number;
  dragonKills: number;
}

function loadCareer(): CareerData {
  try {
    const raw = localStorage.getItem('chronicles_career');
    if (!raw) return { totalRuns: 0, chapterClears: {}, totalKills: 0, totalDeaths: 0, totalCombos: 0, totalPoisonDamage: 0, dragonKills: 0 };
    return JSON.parse(raw) as CareerData;
  } catch {
    return { totalRuns: 0, chapterClears: {}, totalKills: 0, totalDeaths: 0, totalCombos: 0, totalPoisonDamage: 0, dragonKills: 0 };
  }
}
function saveCareer(c: CareerData) {
  localStorage.setItem('chronicles_career', JSON.stringify(c));
}

const DRAGON_MONSTER_IDS = new Set(['wyvern_scout', 'dragon_guard', 'ancient_dragon']);

// ─── Run State ────────────────────────────────────────────────────────────────

export type Screen =
  | 'title'
  | 'class_select'
  | 'map'
  | 'battle'
  | 'event'
  | 'shop'
  | 'rest'
  | 'chapter_clear'
  | 'game_over'
  | 'victory'
  | 'legacy';

export type RoomType = 'combat' | 'elite' | 'event' | 'shop' | 'rest' | 'boss';

export interface RoomNode {
  id: string;
  type: RoomType;
  floor: number;
  cleared: boolean;
}

export interface RunState {
  chapter: number;
  floor: number;
  roomIndex: number;
  rooms: RoomNode[];
  currentRoomId: string | null;
  extraCardChoice: number;
  pendingCardChoice: boolean;
}

export interface RunStats {
  characterName: string;
  classId: string;
  level: number;
  kills: number;
  combos: number;
  turns: number;
  floorsCleared: number;
  gold: number;
  deckSize: number;
  victory: boolean;
  chapterCompleted: number;
  bossKills: number;
  chaptersCleared: number;
  shardsEarned: number;
}

export interface LegacyBonuses {
  hp: number;
  mp: number;
  gold: number;
  rareCard: boolean;
  revive: boolean;
  startComboCard: boolean;
  extraCardChoice: number;
}

// Epic card granted by 날카로운 본능 legacy upgrade
const LEGACY_INSTINCT_CARD: SkillCard = {
  id: 'legacy_sharp_instinct',
  name: '날카로운 직관',
  class: 'any',
  chapter: 1,
  manaCost: 1,
  type: 'special',
  rarity: 'epic',
  description: '유산의 에픽 본능. 카드 3장을 드로우하고 이번 턴 STR +15.',
  effects: [
    { type: 'draw', value: 3, target: 'self' },
    { type: 'buff', value: 15, duration: 1, target: 'self', stat: 'str' },
  ],
  comboTag: ['draw', 'special'],
};

// ─── Store Interface ──────────────────────────────────────────────────────────

interface GameStore {
  screen: Screen;
  character: CharacterState | null;
  run: RunState | null;
  availableClasses: GameClass[];
  lastRunStats: RunStats | null;

  unlockedHiddenClasses: string[];
  completedClasses: string[];
  pendingAwakenings: string[];
  careerData: CareerData;

  runKills: number;
  runCombos: number;
  runTurns: number;
  runDamageTaken: number;
  runBossKills: number;
  runChaptersCleared: number;
  runReviveAvailable: boolean;
  runPoisonDamage: number;
  runDragonKills: number;

  pendingBeat: string | null;
  shownBeats: string[];
  triggerBeat: (key: string, text: string) => void;
  dismissBeat: () => void;

  setScreen: (screen: Screen) => void;

  startRun: (classId: string, name: string, legacyBonuses?: LegacyBonuses) => void;
  endRun: (victory: boolean) => void;
  advanceChapter: () => void;
  incrementKills: () => void;
  incrementCombos: () => void;
  incrementBossKills: () => void;
  addTurns: (n: number) => void;
  addDamageTaken: (n: number) => void;
  addPoisonDamage: (n: number) => void;
  incrementDragonKills: () => void;
  useRevive: () => void;
  clearPendingAwakenings: () => void;
  dismissCardChoice: () => void;

  gainExp: (amount: number) => void;
  gainGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  healHp: (amount: number) => void;
  syncHp: (hp: number) => void;
  takeDamage: (amount: number) => void;
  restoremp: (amount: number) => void;
  addCardToDeck: (card: SkillCard) => void;
  removeCardFromDeck: (cardId: string) => void;
  addItemToInventory: (item: Item) => void;
  removeInventoryItems: (indices: number[]) => void;
  addRelic: (relic: Item) => void;
  useItem: (itemId: string) => void;

  enterRoom: (roomId: string) => void;
  clearRoom: () => void;
  advanceFloor: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EXP_PER_LEVEL = (level: number) => Math.floor(50 * Math.pow(level, 1.8));

const ALL_CLASSES = [...chapter1Classes, ...chapter2Classes, ...chapter3Classes, ...chapter1HiddenClasses, ...chapter2HiddenClasses, ...chapter3HiddenClasses];
const ALL_SKILL_CARDS = [...chapter1SkillCards, ...chapter2SkillCards, ...chapter3SkillCards];

function buildStartingDeck(classId: string): SkillCard[] {
  const cls = ALL_CLASSES.find(c => c.id === classId)!;
  return cls.startingDeck.map(id => ALL_SKILL_CARDS.find(c => c.id === id)!);
}

function getRandomComboCard(): SkillCard {
  const comboCards = ALL_SKILL_CARDS.filter(c => c.comboTag && c.comboTag.length > 0 && c.chapter === 1);
  if (comboCards.length === 0) return LEGACY_INSTINCT_CARD;
  return comboCards[Math.floor(Math.random() * comboCards.length)];
}

function buildCharacter(cls: GameClass, name: string, bonuses: LegacyBonuses): CharacterState {
  const { hp, mp, str, int: int_, dex, con } = cls.baseStats;
  const deck = buildStartingDeck(cls.id);
  if (bonuses.rareCard) deck.push({ ...LEGACY_INSTINCT_CARD });
  if (bonuses.startComboCard) deck.push(getRandomComboCard());
  return {
    classId: cls.id,
    name,
    level: 1,
    exp: 0,
    expToNext: EXP_PER_LEVEL(1),
    hp: hp + bonuses.hp,
    maxHp: hp + bonuses.hp,
    mp: mp + bonuses.mp,
    maxMp: mp + bonuses.mp,
    str,
    int: int_,
    dex,
    con,
    gold: 100 + bonuses.gold,
    deck,
    inventory: [],
    relics: [],
    unlockedCombos: [],
    careerStats: {},
  };
}

function generateRooms(floor: number): RoomNode[] {
  const rooms: RoomNode[] = [];
  const types: RoomType[] = ['combat', 'combat', 'elite', 'event', 'shop', 'rest'];
  const weights =                 [45,       45,       15,     20,     12,    8];
  const total = weights.reduce((a, b) => a + b, 0);

  const roomCount = 4;
  for (let i = 0; i < roomCount; i++) {
    if (floor === 3 && i === roomCount - 1) {
      rooms.push({ id: `f${floor}r${i}`, type: 'boss', floor, cleared: false });
      continue;
    }
    let r = Math.random() * total;
    let picked: RoomType = 'combat';
    for (let j = 0; j < types.length; j++) {
      r -= weights[j];
      if (r <= 0) { picked = types[j]; break; }
    }
    rooms.push({ id: `f${floor}r${i}`, type: picked, floor, cleared: false });
  }
  return rooms;
}

function calcPoints(victory: boolean, bossKills: number, chaptersCleared: number): number {
  return (victory ? 0 : 10) + bossKills * 20 + chaptersCleared * 50;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const _savedRun = loadRunSave();

export const useGameStore = create<GameStore>((set, get) => {
  const persist = () => {
    const { character, run } = get();
    if (character && run) saveRun(character, run);
  };

  return {
    screen: 'title',
    character: _savedRun?.character ?? null,
    run: _savedRun?.run ?? null,
    availableClasses: ALL_CLASSES,
    lastRunStats: null,
    unlockedHiddenClasses: loadLS('unlocked_hidden_classes', []),
    completedClasses: loadLS('completed_classes', []),
    pendingAwakenings: loadLS('chronicles_pending_awakenings', []),
    careerData: loadCareer(),
    runKills: 0,
    runCombos: 0,
    runTurns: 0,
    runDamageTaken: 0,
    runBossKills: 0,
    runChaptersCleared: 0,
    runReviveAvailable: false,
    runPoisonDamage: 0,
    runDragonKills: 0,
    pendingBeat: null,
    shownBeats: [],

    setScreen: (screen) => set({ screen }),

    triggerBeat: (key, text) => {
      const { shownBeats } = get();
      if (shownBeats.includes(key)) return;
      set({ pendingBeat: text, shownBeats: [...shownBeats, key] });
    },
    dismissBeat: () => set({ pendingBeat: null }),

    clearPendingAwakenings: () => {
      saveLS('chronicles_pending_awakenings', []);
      set({ pendingAwakenings: [] });
    },

    dismissCardChoice: () => {
      set(s => {
        if (!s.run) return s;
        return { run: { ...s.run, pendingCardChoice: false } };
      });
      persist();
    },

    startRun: (classId, name, legacyBonuses) => {
      clearRunSave();
      const bonuses: LegacyBonuses = legacyBonuses ?? { hp: 0, mp: 0, gold: 0, rareCard: false, revive: false, startComboCard: false, extraCardChoice: 0 };
      const cls = ALL_CLASSES.find(c => c.id === classId);
      if (!cls) return;
      const character = buildCharacter(cls, name, bonuses);
      const run: RunState = {
        chapter: 1, floor: 1, roomIndex: 0, rooms: generateRooms(1), currentRoomId: null,
        extraCardChoice: bonuses.extraCardChoice,
        pendingCardChoice: false,
      };
      set({
        character, run, screen: 'map',
        runKills: 0, runCombos: 0, runTurns: 0, runDamageTaken: 0,
        runBossKills: 0, runChaptersCleared: 0, runPoisonDamage: 0, runDragonKills: 0,
        runReviveAvailable: bonuses.revive,
        pendingBeat: null, shownBeats: [],
      });
      saveRun(character, run);
    },

    endRun: (victory) => {
      const {
        character, run, runKills, runCombos, runTurns, runDamageTaken,
        runBossKills, runChaptersCleared, runPoisonDamage, runDragonKills,
        unlockedHiddenClasses, completedClasses, careerData,
      } = get();

      const points = calcPoints(victory, runBossKills, runChaptersCleared);
      useLegacyStore.getState().addShards(points);

      const floorsCleared = run ? run.floor - 1 : 0;
      const stats: RunStats | null = character ? {
        characterName: character.name,
        classId: character.classId,
        level: character.level,
        kills: runKills,
        combos: runCombos,
        turns: runTurns,
        floorsCleared,
        gold: character.gold,
        deckSize: character.deck.length,
        victory,
        chapterCompleted: run?.chapter ?? 1,
        bossKills: runBossKills,
        chaptersCleared: runChaptersCleared,
        shardsEarned: points,
      } : null;

      // ─── Update career stats ───────────────────────────────────────────────
      const newCareer: CareerData = {
        totalRuns: careerData.totalRuns + 1,
        chapterClears: { ...careerData.chapterClears },
        totalKills: careerData.totalKills + runKills,
        totalDeaths: careerData.totalDeaths + (victory ? 0 : 1),
        totalCombos: careerData.totalCombos + runCombos,
        totalPoisonDamage: careerData.totalPoisonDamage + runPoisonDamage,
        dragonKills: careerData.dragonKills + runDragonKills,
      };
      if (victory && runChaptersCleared >= 3) {
        newCareer.chapterClears[3] = (newCareer.chapterClears[3] ?? 0) + 1;
      }
      saveCareer(newCareer);

      // ─── Per-run hidden class unlocks (existing logic) ─────────────────────
      const newUnlocked = [...unlockedHiddenClasses];
      if (character) {
        const c = character.classId;
        if (c === 'warrior' && runKills >= 10 && !newUnlocked.includes('blood_knight'))
          newUnlocked.push('blood_knight');
        if (c === 'mage' && runCombos >= 5 && !newUnlocked.includes('void_mage'))
          newUnlocked.push('void_mage');
        if (c === 'rogue' && runDamageTaken <= 50 && !newUnlocked.includes('phantom'))
          newUnlocked.push('phantom');
        if (c === 'priest' && runKills >= 8 && !newUnlocked.includes('inquisitor'))
          newUnlocked.push('inquisitor');
        if (c === 'druid' && runCombos >= 4 && !newUnlocked.includes('storm_caller'))
          newUnlocked.push('storm_caller');
        if (c === 'marshal' && runKills >= 10 && !newUnlocked.includes('holy_avenger'))
          newUnlocked.push('holy_avenger');
        if (c === 'dragon_knight' && runBossKills >= 2 && !newUnlocked.includes('flame_vanguard'))
          newUnlocked.push('flame_vanguard');

        if (victory) {
          const newCompleted = [...completedClasses, c];
          const hasWarrior = newCompleted.includes('warrior');
          const hasMage = newCompleted.includes('mage');
          const hasRogue = newCompleted.includes('rogue');
          const hasPriest = newCompleted.includes('priest');
          if (hasWarrior && hasMage && !newUnlocked.includes('rune_knight'))
            newUnlocked.push('rune_knight');
          if (hasRogue && hasPriest && !newUnlocked.includes('shadow_inquisitor'))
            newUnlocked.push('shadow_inquisitor');
          saveLS('completed_classes', newCompleted);
          set({ completedClasses: newCompleted });
        }
      }

      // ─── Career-based hidden class unlocks ────────────────────────────────
      const newAwakenings: string[] = [];
      const checkCareer = (id: string, cond: boolean) => {
        if (cond && !newUnlocked.includes(id)) {
          newUnlocked.push(id);
          newAwakenings.push(id);
        }
      };
      checkCareer('legendary_hero',   (newCareer.chapterClears[3] ?? 0) >= 3);
      checkCareer('poison_alchemist',  newCareer.totalPoisonDamage >= 3000);
      checkCareer('void_wanderer',     newCareer.totalDeaths >= 15);
      checkCareer('archmage',          newCareer.totalCombos >= 30);
      checkCareer('dragon_heir',       newCareer.dragonKills >= 50);

      if (newUnlocked.length !== unlockedHiddenClasses.length) {
        saveLS('unlocked_hidden_classes', newUnlocked);
        set({ unlockedHiddenClasses: newUnlocked });
      }

      const allPending = [...loadLS('chronicles_pending_awakenings', []), ...newAwakenings];
      if (newAwakenings.length > 0) {
        saveLS('chronicles_pending_awakenings', allPending);
        set({ pendingAwakenings: allPending });
      }

      clearRunSave();
      set({
        screen: victory ? 'victory' : 'game_over',
        character: null, run: null, lastRunStats: stats,
        careerData: newCareer,
      });
    },

    advanceChapter: () => {
      const { run } = get();
      if (!run) return;
      set(s => ({ runChaptersCleared: s.runChaptersCleared + 1 }));
      if (run.chapter < 3) {
        const rooms = generateRooms(1);
        const newRun: RunState = {
          ...run,
          chapter: run.chapter + 1,
          floor: 1,
          roomIndex: 0,
          rooms,
          currentRoomId: null,
          pendingCardChoice: run.extraCardChoice > 0,
        };
        set({ run: newRun, screen: 'chapter_clear' });
        persist();
      } else {
        get().endRun(true);
      }
    },

    incrementKills: () => set(s => ({ runKills: s.runKills + 1 })),
    incrementCombos: () => set(s => ({ runCombos: s.runCombos + 1 })),
    incrementBossKills: () => set(s => ({ runBossKills: s.runBossKills + 1 })),
    addTurns: (n) => set(s => ({ runTurns: s.runTurns + n })),
    addDamageTaken: (n) => set(s => ({ runDamageTaken: s.runDamageTaken + n })),
    addPoisonDamage: (n) => set(s => ({ runPoisonDamage: s.runPoisonDamage + n })),
    incrementDragonKills: () => set(s => ({ runDragonKills: s.runDragonKills + 1 })),

    useRevive: () => {
      set(s => {
        if (!s.character || !s.runReviveAvailable) return s;
        const hp = Math.max(1, Math.floor(s.character.maxHp * 0.4));
        return { character: { ...s.character, hp }, runReviveAvailable: false };
      });
      persist();
    },

    gainExp: (amount) => {
      set(s => {
        if (!s.character) return s;
        let { exp, expToNext, level, maxHp, hp, maxMp, mp, str, int: int_, dex, con } = s.character;
        exp += amount;
        while (exp >= expToNext) {
          exp -= expToNext;
          level += 1;
          expToNext = EXP_PER_LEVEL(level);
          maxHp += 10; hp = Math.min(hp + 10, maxHp);
          maxMp += 5; mp = Math.min(mp + 5, maxMp);
          str += 1; int_ += 1; dex += 1; con += 1;
        }
        return { character: { ...s.character, exp, expToNext, level, maxHp, hp, maxMp, mp, str, int: int_, dex, con } };
      });
      persist();
    },

    gainGold: (amount) => {
      set(s => {
        if (!s.character) return s;
        return { character: { ...s.character, gold: s.character.gold + amount } };
      });
      persist();
    },

    spendGold: (amount) => {
      const { character } = get();
      if (!character || character.gold < amount) return false;
      set(s => ({ character: s.character ? { ...s.character, gold: s.character.gold - amount } : null }));
      persist();
      return true;
    },

    healHp: (amount) => {
      set(s => {
        if (!s.character) return s;
        const hp = Math.min(s.character.hp + amount, s.character.maxHp);
        return { character: { ...s.character, hp } };
      });
      persist();
    },

    syncHp: (hp) => {
      set(s => {
        if (!s.character) return s;
        const clamped = Math.max(1, Math.min(hp, s.character.maxHp));
        return { character: { ...s.character, hp: clamped } };
      });
      persist();
    },

    takeDamage: (amount) => {
      const { character, endRun } = get();
      if (!character) return;
      const hp = character.hp - amount;
      if (hp <= 0) {
        set(s => ({ character: s.character ? { ...s.character, hp: 0 } : null }));
        endRun(false);
        return;
      }
      set(s => ({ character: s.character ? { ...s.character, hp } : null }));
      persist();
    },

    restoremp: (amount) => set(s => {
      if (!s.character) return s;
      const mp = Math.min(s.character.mp + amount, s.character.maxMp);
      return { character: { ...s.character, mp } };
    }),

    addCardToDeck: (card) => {
      set(s => {
        if (!s.character) return s;
        return { character: { ...s.character, deck: [...s.character.deck, card] } };
      });
      persist();
    },

    removeCardFromDeck: (cardId) => set(s => {
      if (!s.character) return s;
      const idx = s.character.deck.findIndex(c => c.id === cardId);
      if (idx === -1) return s;
      const deck = [...s.character.deck];
      deck.splice(idx, 1);
      return { character: { ...s.character, deck } };
    }),

    addItemToInventory: (item) => {
      set(s => {
        if (!s.character) return s;
        return { character: { ...s.character, inventory: [...s.character.inventory, item] } };
      });
      persist();
    },

    removeInventoryItems: (indices: number[]) => {
      set(s => {
        if (!s.character) return s;
        const sorted = [...indices].sort((a, b) => b - a);
        const inventory = [...s.character.inventory];
        sorted.forEach(i => inventory.splice(i, 1));
        return { character: { ...s.character, inventory } };
      });
      persist();
    },

    addRelic: (relic) => {
      set(s => {
        if (!s.character) return s;
        let { maxHp, hp, maxMp, mp, str, int: int_, dex, con } = s.character;
        for (const e of relic.effects) {
          if (e.type === 'buff') {
            if (e.stat === 'hp')  { maxHp += e.value; hp = Math.min(hp + Math.max(0, e.value), maxHp); }
            if (e.stat === 'mp')  { maxMp += e.value; mp = Math.min(mp + Math.max(0, e.value), maxMp); }
            if (e.stat === 'str') str += e.value;
            if (e.stat === 'int') int_ += e.value;
            if (e.stat === 'dex') dex += e.value;
            if (e.stat === 'con') con += e.value;
          }
        }
        return { character: { ...s.character, relics: [...s.character.relics, relic], maxHp, hp, maxMp, mp, str, int: int_, dex, con } };
      });
      persist();
    },

    useItem: (itemId) => {
      const { character } = get();
      if (!character) return;
      const idx = character.inventory.findIndex(i => i.id === itemId);
      if (idx === -1) return;
      const item = character.inventory[idx];
      const inventory = [...character.inventory];
      inventory.splice(idx, 1);

      let { hp, maxHp, mp, maxMp } = character;
      for (const effect of item.effects) {
        if (effect.type === 'heal') hp = Math.min(hp + effect.value, maxHp);
        if (effect.type === 'mana') mp = Math.min(mp + effect.value, maxMp);
      }
      set(s => ({ character: s.character ? { ...s.character, hp, mp, inventory } : null }));
      persist();
    },

    enterRoom: (roomId) => set(s => {
      if (!s.run) return s;
      return { run: { ...s.run, currentRoomId: roomId } };
    }),

    clearRoom: () => {
      set(s => {
        if (!s.run) return s;
        const rooms = s.run.rooms.map(r =>
          r.id === s.run!.currentRoomId ? { ...r, cleared: true } : r
        );
        return { run: { ...s.run, rooms, roomIndex: s.run.roomIndex + 1 } };
      });
      persist();
    },

    advanceFloor: () => {
      const { run, advanceChapter } = get();
      if (!run) return;
      const nextFloor = run.floor + 1;
      if (nextFloor > 3) {
        advanceChapter();
        return;
      }
      const rooms = generateRooms(nextFloor);
      set({ run: { ...run, floor: nextFloor, roomIndex: 0, rooms, currentRoomId: null } });
      persist();
    },
  };
});

export { DRAGON_MONSTER_IDS };
