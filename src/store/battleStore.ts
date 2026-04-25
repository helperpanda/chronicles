import { create } from 'zustand';
import type { SkillCard, Monster, Effect, ComboRecipe } from '../data/_schema';
import { getMonsterNameEn, getCardNameEn, getMonsterActionNameEn } from '../i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatusEffect {
  stat: string;
  value: number;
  duration: number;
}

export interface CombatantState {
  hp: number;
  maxHp: number;
  shield: number;
  mp?: number;
  maxMp?: number;
  str: number;
  int: number;
  dex: number;
  statuses: StatusEffect[];
}

export type BattlePhase = 'player_turn' | 'enemy_turn' | 'combo_select' | 'result';

export interface BattleLog {
  id: number;
  text: string;
  textEn: string;
  type: 'damage' | 'heal' | 'buff' | 'combo' | 'info';
}

interface BattleStore {
  phase: BattlePhase;
  turn: number;

  // Deck state
  drawPile: SkillCard[];
  hand: SkillCard[];
  discardPile: SkillCard[];

  // Combatants
  player: CombatantState | null;
  enemy: Monster | null;
  enemyCurrentHp: number;
  enemyShield: number;
  enemyStatuses: StatusEffect[];

  // Combo tracking
  playedThisTurn: SkillCard[];
  availableCombo: string | null;
  availableCombos: ComboRecipe[];

  // Damage tracking
  playerDamageTaken: number;
  poisonDamageDealt: number;

  // Mana
  currentMana: number;
  maxMana: number;

  // Log
  log: BattleLog[];
  logCounter: number;

  // Actions
  initBattle: (player: CombatantState, enemy: Monster, deck: SkillCard[], combos: ComboRecipe[], bonusMana?: number, initialDraw?: number) => void;
  drawCards: (count: number) => void;
  playCard: (card: SkillCard) => Effect[];
  discardCard: (cardId: string) => void;
  endPlayerTurn: () => void;
  applyEnemyAction: () => Effect[];
  applyEffect: (effect: Effect, source: 'player' | 'enemy') => void;
  healPlayer: (amount: number) => void;
  addLog: (ko: string, en: string, type: BattleLog['type']) => void;
  setPhase: (phase: BattlePhase) => void;
  resetBattle: () => void;
  checkCombos: () => void;
  executeCombo: (comboId: string) => void;
  getAvailableCombo: () => ComboRecipe | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function tickStatuses(statuses: StatusEffect[]): StatusEffect[] {
  return statuses
    .map(s => ({ ...s, duration: s.duration - 1 }))
    .filter(s => s.duration > 0);
}

function getStat(statuses: StatusEffect[], base: number, stat: string): number {
  return statuses
    .filter(s => s.stat === stat)
    .reduce((acc, s) => acc + s.value, base);
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBattleStore = create<BattleStore>((set, get) => ({
  phase: 'player_turn',
  turn: 1,
  drawPile: [],
  hand: [],
  discardPile: [],
  player: null,
  enemy: null,
  enemyCurrentHp: 0,
  enemyShield: 0,
  enemyStatuses: [],
  playedThisTurn: [],
  availableCombo: null,
  availableCombos: [],
  playerDamageTaken: 0,
  poisonDamageDealt: 0,
  currentMana: 3,
  maxMana: 3,
  log: [],
  logCounter: 0,

  initBattle: (player, enemy, deck, combos, bonusMana = 0, initialDraw = 3) => {
    set({
      phase: 'player_turn',
      turn: 1,
      drawPile: shuffle(deck),
      hand: [],
      discardPile: [],
      player: { ...player },
      enemy,
      enemyCurrentHp: enemy.maxHp,
      enemyShield: 0,
      enemyStatuses: [],
      playedThisTurn: [],
      availableCombo: null,
      availableCombos: combos,
      playerDamageTaken: 0,
      poisonDamageDealt: 0,
      currentMana: Math.min(3 + bonusMana, 6),
      maxMana: 3,
      log: [],
      logCounter: 0,
    });
    get().drawCards(initialDraw);
    get().addLog(`⚔️ ${enemy.name}과(와) 전투 시작!`, `⚔️ Battle starts with ${getMonsterNameEn(enemy.id, enemy.name)}!`, 'info');
  },

  drawCards: (count) => set(s => {
    let draw = [...s.drawPile];
    let discard = [...s.discardPile];
    let hand = [...s.hand];

    for (let i = 0; i < count; i++) {
      if (draw.length === 0) {
        if (discard.length === 0) break;
        draw = shuffle(discard);
        discard = [];
      }
      hand.push(draw.pop()!);
    }
    return { drawPile: draw, discardPile: discard, hand };
  }),

  playCard: (card) => {
    const s = get();
    if (!s.player || s.currentMana < card.manaCost) return [];
    if (s.phase !== 'player_turn') return [];

    set(prev => ({
      hand: prev.hand.filter(c => c !== card),
      discardPile: [...prev.discardPile, card],
      currentMana: prev.currentMana - card.manaCost,
      playedThisTurn: [...prev.playedThisTurn, card],
    }));

    get().addLog(`🃏 ${card.name} 사용`, `🃏 ${getCardNameEn(card.id, card.name)} played`, 'info');
    card.effects.forEach(e => get().applyEffect(e, 'player'));
    get().checkCombos();
    return card.effects;
  },

  discardCard: (cardId) => set(s => ({
    hand: s.hand.filter(c => c.id !== cardId),
    discardPile: [...s.discardPile, s.hand.find(c => c.id === cardId)!],
  })),

  endPlayerTurn: () => {
    const s = get();

    // Enemy already killed by card this turn — skip enemy action
    if (s.enemyCurrentHp <= 0) {
      set({ phase: 'result', playedThisTurn: [], availableCombo: null });
      get().addLog(`✨ ${s.enemy?.name} 처치!`, `✨ ${s.enemy ? getMonsterNameEn(s.enemy.id, s.enemy.name) : ''} defeated!`, 'info');
      return;
    }

    set({ phase: 'enemy_turn', playedThisTurn: [], availableCombo: null });

    // Tick player statuses + apply regen
    set(prev => {
      if (!prev.player) return prev;
      const regen = prev.player.statuses.find(s => s.stat === 'regen');
      let hp = prev.player.hp;
      if (regen) {
        hp = Math.min(hp + regen.value, prev.player.maxHp);
        get().addLog(`💚 재생 ${regen.value} HP 회복`, `💚 Regen heals ${regen.value} HP`, 'heal');
      }
      return {
        player: { ...prev.player, hp, statuses: tickStatuses(prev.player.statuses) },
      };
    });

    get().applyEnemyAction();

    // Tick enemy statuses + apply poison
    set(prev => {
      const poison = prev.enemyStatuses.find(s => s.stat === 'poison');
      let newHp = prev.enemyCurrentHp;
      let extraPoison = 0;
      if (poison) {
        extraPoison = poison.value;
        newHp = Math.max(0, newHp - extraPoison);
        get().addLog(`☠️ 독으로 ${extraPoison} 데미지!`, `☠️ Poison deals ${extraPoison} damage!`, 'damage');
      }
      return {
        enemyCurrentHp: newHp,
        enemyStatuses: tickStatuses(prev.enemyStatuses),
        poisonDamageDealt: prev.poisonDamageDealt + extraPoison,
      };
    });

    const newS = get();
    // Player death takes priority — avoids false victory when both die simultaneously
    if ((newS.player?.hp ?? 1) <= 0) {
      set({ phase: 'result' });
      get().addLog(`💀 쓰러졌습니다...`, `💀 You have fallen...`, 'info');
      return;
    }

    if (newS.enemyCurrentHp <= 0) {
      set({ phase: 'result' });
      const dEnemy = s.enemy;
      get().addLog(`✨ ${dEnemy?.name} 처치!`, `✨ ${dEnemy ? getMonsterNameEn(dEnemy.id, dEnemy.name) : ''} defeated!`, 'info');
      return;
    }

    // Start next player turn
    set(prev => ({
      phase: 'player_turn',
      turn: prev.turn + 1,
      currentMana: prev.maxMana,
      hand: [],
    }));
    get().drawCards(3);
    const nextTurn = get().turn;
    get().addLog(`── 턴 ${nextTurn} ──`, `── Turn ${nextTurn} ──`, 'info');
  },

  applyEnemyAction: () => {
    const { enemy } = get();
    if (!enemy) return [];

    const action = weightedRandom(enemy.actions);
    get().addLog(
      `👹 ${enemy.name}: ${action.name}`,
      `👹 ${getMonsterNameEn(enemy.id, enemy.name)}: ${getMonsterActionNameEn(enemy.id, action.id, action.name)}`,
      'info',
    );
    action.effects.forEach(e => get().applyEffect(e, 'enemy'));
    return action.effects;
  },

  applyEffect: (effect, source) => set(s => {
    if (!s.player) return s;

    // Damage to player
    if ((effect.type === 'damage' || effect.type === 'magic_damage') && source === 'enemy') {
      const rawDmg = effect.value;
      const defense = source === 'enemy'
        ? getStat(s.player.statuses, 0, 'defense')
        : 0;
      const absorbed = Math.min(s.player.shield, rawDmg);
      const remainder = rawDmg - absorbed - defense;
      const actualDmg = Math.max(0, remainder);
      get().addLog(`💥 ${rawDmg} 데미지 받음 (방어막 ${absorbed} 흡수)`, `💥 Took ${rawDmg} dmg (${absorbed} blocked)`, 'damage');
      return {
        player: {
          ...s.player,
          hp: Math.max(0, s.player.hp - actualDmg),
          shield: Math.max(0, s.player.shield - absorbed),
        },
        playerDamageTaken: s.playerDamageTaken + actualDmg,
      };
    }

    // Damage to enemy
    if ((effect.type === 'damage' || effect.type === 'magic_damage') && source === 'player') {
      const str = getStat(s.player.statuses, s.player.str, 'str');
      const int_ = getStat(s.player.statuses, s.player.int, 'int');
      const base = effect.type === 'damage' ? str : int_;
      const rawDmg = Math.floor(effect.value + base * 0.3);
      const absorbed = Math.min(s.enemyShield, rawDmg);
      const defense = getStat(s.enemyStatuses, 0, 'defense');
      const actualDmg = Math.max(1, rawDmg - absorbed - defense);
      get().addLog(`⚔️ ${rawDmg} 데미지 (방어막 ${absorbed})`, `⚔️ ${rawDmg} dmg (${absorbed} blocked)`, 'damage');
      return {
        enemyCurrentHp: Math.max(0, s.enemyCurrentHp - actualDmg),
        enemyShield: Math.max(0, s.enemyShield - absorbed),
      };
    }

    // Heal
    if (effect.type === 'heal' && source === 'player') {
      const newHp = Math.min(s.player.hp + effect.value, s.player.maxHp);
      get().addLog(`💚 체력 ${effect.value} 회복`, `💚 Healed ${effect.value} HP`, 'heal');
      return { player: { ...s.player, hp: newHp } };
    }

    // Shield (player)
    if (effect.type === 'shield' && source === 'player') {
      get().addLog(`🛡 방어막 ${effect.value}`, `🛡 Shield +${effect.value}`, 'buff');
      return { player: { ...s.player, shield: s.player.shield + effect.value } };
    }

    // Shield (enemy self)
    if (effect.type === 'shield' && source === 'enemy') {
      return { enemyShield: s.enemyShield + effect.value };
    }

    // Buff
    if (effect.type === 'buff' && source === 'player') {
      const status: StatusEffect = {
        stat: effect.stat!,
        value: effect.value,
        duration: effect.duration ?? 2,
      };
      get().addLog(`⬆️ ${effect.stat} +${effect.value} (${status.duration}턴)`, `⬆️ ${effect.stat} +${effect.value} (${status.duration} turns)`, 'buff');
      return { player: { ...s.player, statuses: [...s.player.statuses, status] } };
    }

    // Debuff on enemy
    if (effect.type === 'debuff' && source === 'player') {
      const status: StatusEffect = {
        stat: effect.stat!,
        value: effect.value,
        duration: effect.duration ?? 2,
      };
      get().addLog(`⬇️ 적 ${effect.stat} ${effect.value} (${status.duration}턴)`, `⬇️ Enemy ${effect.stat} ${effect.value} (${status.duration} turns)`, 'buff');
      return { enemyStatuses: [...s.enemyStatuses, status] };
    }

    // Cleanse player debuffs
    if (effect.type === 'special' && effect.stat === 'cleanse' && source === 'player') {
      get().addLog(`✨ 모든 디버프 제거`, `✨ All debuffs cleansed`, 'buff');
      return { player: { ...s.player, statuses: [] } };
    }

    // Draw
    if (effect.type === 'draw' && source === 'player') {
      get().drawCards(effect.value);
    }

    // Mana
    if (effect.type === 'mana' && source === 'player') {
      return { currentMana: Math.max(0, Math.min(s.maxMana, s.currentMana + effect.value)) };
    }

    return s;
  }),

  checkCombos: () => {
    const { playedThisTurn, currentMana, availableCombos } = get();
    for (const recipe of availableCombos) {
      if (currentMana < recipe.manaCost) continue;
      const matched = recipe.requiredTags.every(tagGroup =>
        playedThisTurn.some(card =>
          card.comboTag?.some(t => tagGroup.includes(t))
        )
      );
      if (matched) {
        set({ availableCombo: recipe.id });
        return;
      }
    }
    set({ availableCombo: null });
  },

  executeCombo: (comboId) => {
    const { currentMana, availableCombos } = get();
    const recipe = availableCombos.find(c => c.id === comboId);
    if (!recipe || currentMana < recipe.manaCost) return;
    set(s => ({ currentMana: s.currentMana - recipe.manaCost, availableCombo: null }));
    get().addLog(`✨ 콤보 발동: ${recipe.name}!`, `✨ Combo: ${recipe.name}!`, 'combo');
    recipe.resultEffect.forEach(e => get().applyEffect(e, 'player'));
    get().checkCombos();
  },

  healPlayer: (amount) => set(s => {
    if (!s.player) return s;
    return { player: { ...s.player, hp: Math.min(s.player.hp + amount, s.player.maxHp) } };
  }),

  getAvailableCombo: () => {
    const { availableCombo, availableCombos } = get();
    if (!availableCombo) return null;
    return availableCombos.find(c => c.id === availableCombo) ?? null;
  },

  addLog: (ko, en, type) => set(s => ({
    log: [...s.log.slice(-50), { id: s.logCounter, text: ko, textEn: en, type }],
    logCounter: s.logCounter + 1,
  })),

  setPhase: (phase) => set({ phase }),

  resetBattle: () => set({
    phase: 'player_turn',
    turn: 1,
    drawPile: [], hand: [], discardPile: [],
    player: null, enemy: null,
    enemyCurrentHp: 0, enemyShield: 0, enemyStatuses: [],
    playedThisTurn: [], availableCombo: null, availableCombos: [], playerDamageTaken: 0, poisonDamageDealt: 0,
    currentMana: 3, maxMana: 3,
    log: [], logCounter: 0,
  }),
}));
