import type { GameClass } from '../_schema';

export const chapter3Classes: GameClass[] = [
  {
    id: 'dragon_knight',
    name: '용기사',
    subtitle: 'Dragon Knight',
    description:
      '용의 피를 이어받은 전사. 화염과 강철을 동시에 다루며 전선에서 압도적인 존재감을 발휘한다. 단단한 방어와 폭발적인 화력이 공존한다.',
    chapter: 3,
    hidden: false,
    baseStats: { hp: 120, mp: 45, str: 20, int: 10, dex: 10, con: 20 },
    startingDeck: [
      'drk_c3_flame_slash',
      'drk_c3_flame_slash',
      'drk_c3_dragon_scale',
      'drk_c3_war_cry',
    ],
    passives: ['dragon_blood', 'flame_aura'],
  },
  {
    id: 'alchemist',
    name: '연금술사',
    subtitle: 'Alchemist',
    description:
      '불꽃과 독을 자유자재로 조합하는 전략가. 전장에서 독안개와 폭발물을 활용해 적의 체계를 무너뜨린다. 직접 싸우기보다 환경을 지배한다.',
    chapter: 3,
    hidden: false,
    baseStats: { hp: 80, mp: 90, str: 8, int: 22, dex: 16, con: 9 },
    startingDeck: [
      'alc_c3_acid_vial',
      'alc_c3_acid_vial',
      'alc_c3_stimulant',
      'alc_c3_flash_bomb',
    ],
    passives: ['transmutation', 'volatile_brew'],
  },
];
