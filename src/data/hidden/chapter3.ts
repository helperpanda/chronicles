import type { GameClass, HiddenClass } from '../_schema';

export const chapter3HiddenHints: Record<string, string> = {
  flame_vanguard:    '용기사로 한 런에 보스 2회 이상 처치',
  poison_alchemist:  '연금술사로 한 런에 콤보 4회 이상 발동',
  legendary_hero:    '챕터 1·2·3을 모두 클리어한 자에게만 해금',
};

export const chapter3HiddenConditions: HiddenClass[] = [
  {
    id: 'flame_vanguard',
    name: '불꽃 기사단원',
    condition: { type: 'boss_kills', threshold: 2, scope: 'run' },
    hint: chapter3HiddenHints.flame_vanguard,
  },
  {
    id: 'poison_alchemist',
    name: '독 연금사',
    condition: { type: 'combos', threshold: 4, scope: 'run' },
    hint: chapter3HiddenHints.poison_alchemist,
  },
  {
    id: 'legendary_hero',
    name: '전설의 영웅',
    condition: { type: 'three_chapters', scope: 'career' },
    hint: chapter3HiddenHints.legendary_hero,
  },
];

export const chapter3HiddenClasses: GameClass[] = [
  {
    id: 'flame_vanguard',
    name: '불꽃 기사단원',
    subtitle: 'Flame Vanguard',
    description:
      '고대 용과 싸운 끝에 그 힘을 흡수한 용기사의 정점. 화염의 파괴력과 강철 방어를 동시에 극한까지 끌어올린다.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 115, mp: 55, str: 22, int: 12, dex: 10, con: 18 },
    startingDeck: [
      'fvg_c3_infernal_slash',
      'drk_c3_flame_slash',
      'drk_c3_dragon_scale',
      'drk_c3_war_cry',
    ],
    passives: ['dragon_blood', 'flame_aura', 'infernal_rage'],
  },
  {
    id: 'poison_alchemist',
    name: '독 연금사',
    subtitle: 'Poison Alchemist',
    description:
      '독과 연금술의 경계를 넘어선 금기의 술사. 치명적인 독성 물질과 폭발을 조합해 전장을 혼돈에 빠뜨린다.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 75, mp: 95, str: 7, int: 25, dex: 18, con: 8 },
    startingDeck: [
      'pa_c3_death_brew',
      'alc_c3_acid_vial',
      'alc_c3_poison_mist',
      'alc_c3_stimulant',
    ],
    passives: ['transmutation', 'volatile_brew', 'poison_mastery'],
  },
  {
    id: 'legendary_hero',
    name: '전설의 영웅',
    subtitle: 'Legendary Hero',
    description:
      '세 개의 챕터를 모두 정복한 자. 유적의 어둠, 숲의 저주, 용의 산맥을 모두 극복해 전설이 된 존재. 균형 잡힌 능력치와 모든 원소를 다룰 수 있다.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 105, mp: 70, str: 15, int: 15, dex: 15, con: 15 },
    startingDeck: [
      'war_c1_slash',
      'dru_c2_thorn_strike',
      'drk_c3_flame_slash',
      'alc_c3_stimulant',
    ],
    passives: ['dragon_blood', 'nature_bond', 'spell_echo'],
  },
];
