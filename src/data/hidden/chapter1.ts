import type { GameClass, HiddenClass, MulticlassRecipe } from '../_schema';

// ─── Hidden Class Unlock Conditions (for UI display) ─────────────────────────

export const hiddenClassHints: Record<string, string> = {
  blood_knight:      '철기사로 한 런에 10마리 이상 처치',
  void_mage:         '비전학자로 한 런에 콤보 5회 이상 발동',
  phantom:           '그림자춤꾼으로 한 런에 피해 50 이하로 버팀',
  inquisitor:        '여명수호자로 한 런에 8마리 이상 처치',
  rune_knight:       '철기사와 비전학자로 각각 승리',
  shadow_inquisitor: '그림자춤꾼과 여명수호자로 각각 승리',
};

// ─── Hidden Class Conditions ──────────────────────────────────────────────────

export const chapter1HiddenConditions: HiddenClass[] = [
  {
    id: 'blood_knight',
    name: '피의 기사',
    condition: { type: 'kills', threshold: 10, scope: 'run' },
    hint: hiddenClassHints.blood_knight,
  },
  {
    id: 'void_mage',
    name: '공허학자',
    condition: { type: 'combos', threshold: 5, scope: 'run' },
    hint: hiddenClassHints.void_mage,
  },
  {
    id: 'phantom',
    name: '환영무사',
    condition: { type: 'low_damage', threshold: 50, scope: 'run' },
    hint: hiddenClassHints.phantom,
  },
  {
    id: 'inquisitor',
    name: '이단심문관',
    condition: { type: 'kills', threshold: 8, scope: 'run' },
    hint: hiddenClassHints.inquisitor,
  },
  {
    id: 'rune_knight',
    name: '룬기사',
    condition: { type: 'multiclass', scope: 'career' },
    hint: hiddenClassHints.rune_knight,
  },
  {
    id: 'shadow_inquisitor',
    name: '암흑심문관',
    condition: { type: 'multiclass', scope: 'career' },
    hint: hiddenClassHints.shadow_inquisitor,
  },
];

// ─── Multiclass Recipes ───────────────────────────────────────────────────────

export const chapter1MulticlassRecipes: MulticlassRecipe[] = [
  {
    classes: ['warrior', 'mage'],
    result: 'rune_knight',
    unlockCondition: '철기사와 비전학자로 각각 런을 완주',
    bonusSkills: ['war_c1_execute', 'mag_c1_arcane_surge'],
  },
  {
    classes: ['rogue', 'priest'],
    result: 'shadow_inquisitor',
    unlockCondition: '그림자춤꾼과 여명수호자로 각각 런을 완주',
    bonusSkills: ['rog_c1_death_mark', 'pri_c1_judgment'],
  },
];

// ─── Hidden GameClass Definitions ────────────────────────────────────────────

export const chapter1HiddenClasses: GameClass[] = [
  {
    id: 'blood_knight',
    name: '피의 기사',
    subtitle: 'Blood Knight',
    description:
      '전장의 핏빛에 광분하는 전사. 적을 쓰러뜨릴수록 분노가 쌓이고, 죽음의 문턱에서 더욱 강해진다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 105, mp: 20, str: 22, int: 7, dex: 12, con: 14 },
    startingDeck: ['war_c1_slash', 'war_c1_slash', 'war_c1_execute', 'war_c1_rend'],
    passives: ['blood_rage', 'iron_body'],
  },
  {
    id: 'void_mage',
    name: '공허학자',
    subtitle: 'Void Scholar',
    description:
      '마법의 금기를 탐구하며 공허의 힘을 다루는 마법사. 극도로 취약하지만 콤보 마법으로 전장을 지배한다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 55, mp: 110, str: 4, int: 26, dex: 8, con: 6 },
    startingDeck: ['mag_c1_meteor', 'mag_c1_chain_lightning', 'mag_c1_arcane_surge', 'mag_c1_fireball'],
    passives: ['spell_echo', 'void_resonance'],
  },
  {
    id: 'phantom',
    name: '환영무사',
    subtitle: 'Phantom',
    description:
      '적의 공격을 환영처럼 회피하며 어둠 속을 누비는 자. 단 한 번의 일격으로 승부를 결짓는다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 80, mp: 55, str: 10, int: 14, dex: 26, con: 8 },
    startingDeck: ['rog_c1_evade', 'rog_c1_evade', 'rog_c1_shadow_step', 'rog_c1_backstab'],
    passives: ['shadow_veil', 'ghost_step'],
  },
  {
    id: 'inquisitor',
    name: '이단심문관',
    subtitle: 'Inquisitor',
    description:
      '신의 이름으로 어둠을 심판하는 전투 성직자. 치유보다 징벌을, 방어보다 공격을 선택한다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 95, mp: 55, str: 14, int: 16, dex: 10, con: 12 },
    startingDeck: ['pri_c1_smite', 'pri_c1_smite', 'pri_c1_judgment', 'pri_c1_barrier'],
    passives: ['divine_wrath', 'light_ward'],
  },
  {
    id: 'rune_knight',
    name: '룬기사',
    subtitle: 'Rune Knight',
    description:
      '강철 갑옷에 마법 룬을 새긴 전사. 검과 마법을 동시에 다루며 물리·마법 양면으로 적을 압도한다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 100, mp: 60, str: 16, int: 16, dex: 10, con: 12 },
    startingDeck: ['war_c1_slash', 'war_c1_execute', 'mag_c1_arcane_surge', 'mag_c1_shock'],
    passives: ['rune_armor', 'spell_echo'],
  },
  {
    id: 'shadow_inquisitor',
    name: '암흑심문관',
    subtitle: 'Shadow Inquisitor',
    description:
      '어둠의 힘과 신성함을 동시에 휘두르는 금기의 직업. 독과 빛의 조합으로 적을 서서히 소멸시킨다.',
    chapter: 1,
    hidden: true,
    baseStats: { hp: 88, mp: 65, str: 11, int: 15, dex: 16, con: 10 },
    startingDeck: ['rog_c1_poison_blade', 'rog_c1_death_mark', 'pri_c1_judgment', 'pri_c1_smite'],
    passives: ['shadow_veil', 'divine_grace'],
  },
];
