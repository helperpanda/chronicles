import type { GameClass } from '../_schema';

export const chapter2Classes: GameClass[] = [
  {
    id: 'druid',
    name: '자연술사',
    subtitle: 'Nature Shaman',
    description:
      '저주받은 숲과 교감하며 생명의 힘을 다루는 술사. 독과 자연 마법으로 적을 약화시키고, 강인한 재생력으로 버틴다.',
    chapter: 2,
    hidden: false,
    baseStats: { hp: 90, mp: 75, str: 10, int: 18, dex: 12, con: 12 },
    startingDeck: [
      'dru_c2_thorn_strike',
      'dru_c2_thorn_strike',
      'dru_c2_regrowth',
      'dru_c2_entangle',
    ],
    passives: ['nature_bond', 'poison_mastery'],
  },
  {
    id: 'marshal',
    name: '기사단장',
    subtitle: 'Holy Marshal',
    description:
      '철갑 갑옷과 성스러운 신앙을 무기 삼아 전선을 지휘하는 엘리트 기사. 강력한 방어와 무거운 일격으로 전장을 장악한다.',
    chapter: 2,
    hidden: false,
    baseStats: { hp: 115, mp: 40, str: 16, int: 10, dex: 10, con: 18 },
    startingDeck: [
      'msl_c2_heavy_blow',
      'msl_c2_heavy_blow',
      'msl_c2_shield_wall',
      'msl_c2_command',
    ],
    passives: ['iron_discipline', 'holy_aura'],
  },
];
