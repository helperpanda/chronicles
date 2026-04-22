import type { GameClass, HiddenClass } from '../_schema';

export const chapter2HiddenHints: Record<string, string> = {
  storm_caller:   '자연술사로 한 런에 콤보 4회 이상 발동',
  holy_avenger:   '기사단장으로 한 런에 10마리 이상 처치',
};

export const chapter2HiddenConditions: HiddenClass[] = [
  {
    id: 'storm_caller',
    name: '폭풍 소환사',
    condition: { type: 'combos', threshold: 4, scope: 'run' },
    hint: chapter2HiddenHints.storm_caller,
  },
  {
    id: 'holy_avenger',
    name: '성전사',
    condition: { type: 'kills', threshold: 10, scope: 'run' },
    hint: chapter2HiddenHints.holy_avenger,
  },
];

export const chapter2HiddenClasses: GameClass[] = [
  {
    id: 'storm_caller',
    name: '폭풍 소환사',
    subtitle: 'Storm Caller',
    description:
      '자연의 분노와 번개의 힘을 하나로 엮는 전설적인 술사. 콤보 연계로 전장 전체를 폭풍으로 뒤덮는다.',
    chapter: 2,
    hidden: true,
    baseStats: { hp: 75, mp: 95, str: 8, int: 24, dex: 14, con: 8 },
    startingDeck: [
      'dru_c2_nature_wrath',
      'dru_c2_thorn_strike',
      'dru_c2_spore_cloud',
      'dru_c2_entangle',
    ],
    passives: ['nature_bond', 'spell_echo', 'void_resonance'],
  },
  {
    id: 'holy_avenger',
    name: '성전사',
    subtitle: 'Holy Avenger',
    description:
      '신의 이름으로 마족을 심판하는 검과 성배의 전사. 적을 쓰러뜨릴수록 신성한 분노가 축적된다.',
    chapter: 2,
    hidden: true,
    baseStats: { hp: 110, mp: 55, str: 18, int: 14, dex: 10, con: 16 },
    startingDeck: [
      'msl_c2_heavy_blow',
      'msl_c2_crusade',
      'msl_c2_shield_wall',
      'msl_c2_command',
    ],
    passives: ['iron_discipline', 'divine_wrath', 'holy_aura'],
  },
];
