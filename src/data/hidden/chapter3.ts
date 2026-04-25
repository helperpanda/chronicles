import type { GameClass, HiddenClass } from '../_schema';

export const chapter3HiddenHints: Record<string, string> = {
  flame_vanguard:    '용기사로 한 런에 보스 2회 이상 처치',
  poison_alchemist:  '커리어 누적 독 피해 3000 달성',
  legendary_hero:    '챕터 3 클리어 3회 달성',
  void_wanderer:     '커리어 누적 사망 15회 달성',
  archmage:          '커리어 누적 콤보 30회 달성',
  dragon_heir:       '용 계열 몬스터 50킬 달성',
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
    condition: { type: 'career_poison_damage', threshold: 3000, scope: 'career' },
    hint: chapter3HiddenHints.poison_alchemist,
  },
  {
    id: 'legendary_hero',
    name: '전설의 영웅',
    condition: { type: 'career_chapter3_clears', threshold: 3, scope: 'career' },
    hint: chapter3HiddenHints.legendary_hero,
  },
  {
    id: 'void_wanderer',
    name: '공허의 방랑자',
    condition: { type: 'career_deaths', threshold: 15, scope: 'career' },
    hint: chapter3HiddenHints.void_wanderer,
  },
  {
    id: 'archmage',
    name: '대마법사',
    condition: { type: 'career_combos', threshold: 30, scope: 'career' },
    hint: chapter3HiddenHints.archmage,
  },
  {
    id: 'dragon_heir',
    name: '용의 계승자',
    condition: { type: 'career_dragon_kills', threshold: 50, scope: 'career' },
    hint: chapter3HiddenHints.dragon_heir,
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
  {
    id: 'void_wanderer',
    name: '공허의 방랑자',
    subtitle: 'Void Wanderer',
    description:
      '수많은 죽음을 거쳐 공허의 경계를 걷는 자. 죽음을 두려워하지 않으며, 그로부터 힘을 얻어 어떤 상황에도 적응한다.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 90, mp: 80, str: 12, int: 18, dex: 18, con: 10 },
    startingDeck: [
      'rog_c1_evade',
      'rog_c1_shadow_step',
      'mag_c1_arcane_surge',
      'mag_c1_frost_bolt',
    ],
    passives: ['shadow_veil', 'void_resonance'],
  },
  {
    id: 'archmage',
    name: '대마법사',
    subtitle: 'Archmage',
    description:
      '수십 번의 콤보 마법을 통해 정점에 오른 마법사. 마나 효율과 콤보 연계 능력이 극한에 달했으며 어떤 원소도 완벽히 제어한다.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 65, mp: 120, str: 5, int: 30, dex: 10, con: 6 },
    startingDeck: [
      'mag_c1_chain_lightning',
      'mag_c1_arcane_surge',
      'mag_c1_meteor',
      'mag_c1_fireball',
    ],
    passives: ['spell_echo', 'void_resonance', 'divine_grace'],
  },
  {
    id: 'dragon_heir',
    name: '용의 계승자',
    subtitle: 'Dragon Heir',
    description:
      '50마리의 용을 쓰러뜨리며 그 힘과 피를 흡수한 전사. 강철 같은 몸과 용의 불꽃으로 전장을 지배하는 진정한 용의 후계자.',
    chapter: 3,
    hidden: true,
    baseStats: { hp: 125, mp: 55, str: 25, int: 12, dex: 10, con: 20 },
    startingDeck: [
      'drk_c3_flame_slash',
      'drk_c3_dragon_scale',
      'drk_c3_ancient_roar',
      'drk_c3_berserker_rush',
    ],
    passives: ['dragon_blood', 'iron_body', 'flame_aura'],
  },
];
