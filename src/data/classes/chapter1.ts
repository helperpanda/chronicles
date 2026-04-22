import type { GameClass } from '../_schema';

export const chapter1Classes: GameClass[] = [
  {
    id: 'warrior',
    name: '철기사',
    subtitle: 'Iron Knight',
    description:
      '강철 갑주와 불굴의 의지로 전선을 지키는 전사. 육체적 한계를 초월한 힘과 방어로 동료를 보호한다.',
    chapter: 1,
    hidden: false,
    baseStats: { hp: 120, mp: 30, str: 18, int: 6, dex: 10, con: 16 },
    startingDeck: [
      'war_c1_slash',
      'war_c1_slash',
      'war_c1_shield_bash',
      'war_c1_battle_cry',
    ],
    passives: ['iron_body', 'weapon_mastery'],
  },
  {
    id: 'mage',
    name: '비전학자',
    subtitle: 'Arcane Scholar',
    description:
      '고대 마법 문헌을 해독하며 원소를 자유자재로 다루는 마법사. 낮은 체력을 막대한 마력으로 극복한다.',
    chapter: 1,
    hidden: false,
    baseStats: { hp: 70, mp: 80, str: 6, int: 20, dex: 10, con: 8 },
    startingDeck: [
      'mag_c1_fireball',
      'mag_c1_frost_bolt',
      'mag_c1_arcane_surge',
      'mag_c1_shock',
    ],
    passives: ['spell_echo', 'mana_font'],
  },
  {
    id: 'rogue',
    name: '그림자춤꾼',
    subtitle: 'Shadow Dancer',
    description:
      '어둠 속에서 춤추듯 움직이며 치명적인 일격을 날리는 암살자. 독과 기만으로 적을 서서히 무너뜨린다.',
    chapter: 1,
    hidden: false,
    baseStats: { hp: 85, mp: 50, str: 12, int: 10, dex: 20, con: 8 },
    startingDeck: [
      'rog_c1_quick_strike',
      'rog_c1_quick_strike',
      'rog_c1_evade',
      'rog_c1_shadow_step',
    ],
    passives: ['nimble_fingers', 'shadow_veil'],
  },
  {
    id: 'priest',
    name: '여명수호자',
    subtitle: 'Dawn Keeper',
    description:
      '빛의 힘으로 동료를 치유하고 어둠을 정화하는 성직자. 신성한 심판으로 악을 응징한다.',
    chapter: 1,
    hidden: false,
    baseStats: { hp: 90, mp: 70, str: 8, int: 16, dex: 10, con: 12 },
    startingDeck: [
      'pri_c1_holy_light',
      'pri_c1_smite',
      'pri_c1_barrier',
      'pri_c1_bless',
    ],
    passives: ['divine_grace', 'light_ward'],
  },
];
