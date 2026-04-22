import { create } from 'zustand';
import type { CharacterState, SkillCard, Item, GameClass } from '../data/_schema';
import { chapter1Classes, chapter1SkillCards, chapter1HiddenClasses, chapter2Classes, chapter2SkillCards, chapter2HiddenClasses } from '../data';

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
  | 'victory';

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
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface GameStore {
  screen: Screen;
  character: CharacterState | null;
  run: RunState | null;
  availableClasses: GameClass[];
  lastRunStats: RunStats | null;

  // Persistent unlock state (mirrored from localStorage)
  unlockedHiddenClasses: string[];
  completedClasses: string[];

  // Run counters (reset on startRun)
  runKills: number;
  runCombos: number;
  runTurns: number;
  runDamageTaken: number;

  // Story beat system
  pendingBeat: string | null;
  shownBeats: string[];
  triggerBeat: (key: string, text: string) => void;
  dismissBeat: () => void;

  // Navigation
  setScreen: (screen: Screen) => void;

  // Run management
  startRun: (classId: string, name: string) => void;
  endRun: (victory: boolean) => void;
  advanceChapter: () => void;
  incrementKills: () => void;
  incrementCombos: () => void;
  addTurns: (n: number) => void;
  addDamageTaken: (n: number) => void;

  // Character mutations
  gainExp: (amount: number) => void;
  gainGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  healHp: (amount: number) => void;
  takeDamage: (amount: number) => void;
  restoremp: (amount: number) => void;
  addCardToDeck: (card: SkillCard) => void;
  removeCardFromDeck: (cardId: string) => void;
  addItemToInventory: (item: Item) => void;
  addRelic: (relic: Item) => void;
  useItem: (itemId: string) => void;

  // Room progression
  enterRoom: (roomId: string) => void;
  clearRoom: () => void;
  advanceFloor: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EXP_PER_LEVEL = (level: number) => Math.floor(50 * Math.pow(level, 1.8));

const ALL_CLASSES = [...chapter1Classes, ...chapter2Classes, ...chapter1HiddenClasses, ...chapter2HiddenClasses];
const ALL_SKILL_CARDS = [...chapter1SkillCards, ...chapter2SkillCards];

function buildStartingDeck(classId: string): SkillCard[] {
  const cls = ALL_CLASSES.find(c => c.id === classId)!;
  return cls.startingDeck.map(id => ALL_SKILL_CARDS.find(c => c.id === id)!);
}

function buildCharacter(cls: GameClass, name: string): CharacterState {
  const { hp, mp, str, int: int_, dex, con } = cls.baseStats;
  return {
    classId: cls.id,
    name,
    level: 1,
    exp: 0,
    expToNext: EXP_PER_LEVEL(1),
    hp,
    maxHp: hp,
    mp,
    maxMp: mp,
    str,
    int: int_,
    dex,
    con,
    gold: 100,
    deck: buildStartingDeck(cls.id),
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

// ─── Store ────────────────────────────────────────────────────────────────────

const _savedRun = loadRunSave();

export const useGameStore = create<GameStore>((set, get) => {
  const persist = () => {
    const { character, run } = get();
    if (character && run) saveRun(character, run);
  };

  return {
    screen: _savedRun ? 'map' : 'title',
    character: _savedRun?.character ?? null,
    run: _savedRun?.run ?? null,
    availableClasses: ALL_CLASSES,
    lastRunStats: null,
    unlockedHiddenClasses: loadLS('unlocked_hidden_classes', []),
    completedClasses: loadLS('completed_classes', []),
    runKills: 0,
    runCombos: 0,
    runTurns: 0,
    runDamageTaken: 0,
    pendingBeat: null,
    shownBeats: [],

    setScreen: (screen) => set({ screen }),

    triggerBeat: (key, text) => {
      const { shownBeats } = get();
      if (shownBeats.includes(key)) return;
      set({ pendingBeat: text, shownBeats: [...shownBeats, key] });
    },
    dismissBeat: () => set({ pendingBeat: null }),

    startRun: (classId, name) => {
      clearRunSave();
      const cls = ALL_CLASSES.find(c => c.id === classId)!;
      const character = buildCharacter(cls, name);
      const run: RunState = { chapter: 1, floor: 1, roomIndex: 0, rooms: generateRooms(1), currentRoomId: null };
      set({
        character, run, screen: 'map',
        runKills: 0, runCombos: 0, runTurns: 0, runDamageTaken: 0,
        pendingBeat: null, shownBeats: [],
      });
      saveRun(character, run);
    },

    endRun: (victory) => {
      const { character, run, runKills, runCombos, runTurns, runDamageTaken,
              unlockedHiddenClasses, completedClasses } = get();
      const stats: RunStats | null = character ? {
        characterName: character.name,
        classId: character.classId,
        level: character.level,
        kills: runKills,
        combos: runCombos,
        turns: runTurns,
        floorsCleared: run ? run.floor - 1 : 0,
        gold: character.gold,
        deckSize: character.deck.length,
        victory,
        chapterCompleted: run?.chapter ?? 1,
      } : null;

      // Check hidden class unlocks
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

        // Chapter 2 hidden unlocks
        if (c === 'druid' && runCombos >= 4 && !newUnlocked.includes('storm_caller'))
          newUnlocked.push('storm_caller');
        if (c === 'marshal' && runKills >= 10 && !newUnlocked.includes('holy_avenger'))
          newUnlocked.push('holy_avenger');

        // Multiclass unlocks (only on victory)
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

      if (newUnlocked.length !== unlockedHiddenClasses.length) {
        saveLS('unlocked_hidden_classes', newUnlocked);
        set({ unlockedHiddenClasses: newUnlocked });
      }

      clearRunSave();
      set({ screen: victory ? 'victory' : 'game_over', character: null, run: null, lastRunStats: stats });
    },

    advanceChapter: () => {
      const { run } = get();
      if (!run) return;
      if (run.chapter < 2) {
        const rooms = generateRooms(1);
        const newRun: RunState = { ...run, chapter: run.chapter + 1, floor: 1, roomIndex: 0, rooms, currentRoomId: null };
        set({ run: newRun, screen: 'chapter_clear' });
        persist();
      } else {
        get().endRun(true);
      }
    },

    incrementKills: () => set(s => ({ runKills: s.runKills + 1 })),
    incrementCombos: () => set(s => ({ runCombos: s.runCombos + 1 })),
    addTurns: (n) => set(s => ({ runTurns: s.runTurns + n })),
    addDamageTaken: (n) => set(s => ({ runDamageTaken: s.runDamageTaken + n })),

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
