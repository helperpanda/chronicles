import type { Monster } from '../_schema';

export const chapter1Monsters: Monster[] = [
  // ─── Normal × 3 ──────────────────────────────────────────

  {
    id: 'goblin_scout',
    name: '고블린 척후병',
    description:
      '잊혀진 유적을 배회하는 소형 고블린. 빠른 발놀림과 독 단검으로 허를 찌른다.',
    tier: 'normal',
    chapter: 1,
    hp: 45,
    maxHp: 45,
    defense: 3,
    magicDefense: 2,
    actions: [
      {
        id: 'goblin_quick_slash',
        name: '빠른 베기',
        description: '단검으로 재빠르게 베어 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 12, target: 'self' }],
        weight: 60,
      },
      {
        id: 'goblin_poison_dart',
        name: '독 다트',
        description: '독이 묻은 다트를 발사해 2턴간 독 데미지를 준다.',
        effects: [
          { type: 'damage', value: 6, target: 'self' },
          { type: 'debuff', value: 5, duration: 2, target: 'self', stat: 'poison' },
        ],
        weight: 40,
      },
    ],
    drops: [
      { itemId: 'small_potion', chance: 0.25 },
      { itemId: 'common_card_shard', chance: 0.15 },
      { itemId: 'bat_fang', chance: 0.1 },
    ],
    expReward: 25,
    goldReward: [12, 28],
  },

  {
    id: 'skeleton_warrior',
    name: '해골 전사',
    description:
      '유적 깊숙이 잠들어 있던 고대 전사의 해골. 두꺼운 녹슨 갑옷이 단단한 방어력을 제공한다.',
    tier: 'normal',
    chapter: 1,
    hp: 60,
    maxHp: 60,
    defense: 8,
    magicDefense: 3,
    actions: [
      {
        id: 'skeleton_bone_slash',
        name: '뼈 베기',
        description: '낡은 검으로 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 16, target: 'self' }],
        weight: 50,
      },
      {
        id: 'skeleton_shield_block',
        name: '방패 막기',
        description: '방패를 올려 다음 공격을 일부 흡수한다.',
        effects: [{ type: 'shield', value: 12, target: 'self' }],
        weight: 30,
      },
      {
        id: 'skeleton_rattle_charge',
        name: '뼈 돌진',
        description: '온몸의 뼈를 부딪히며 돌진해 더 강한 물리 데미지를 준다.',
        effects: [{ type: 'damage', value: 22, target: 'self' }],
        weight: 20,
      },
    ],
    drops: [
      { itemId: 'iron_fragment', chance: 0.35 },
      { itemId: 'common_card_shard', chance: 0.15 },
      { itemId: 'small_potion', chance: 0.2 },
    ],
    expReward: 35,
    goldReward: [18, 40],
  },

  {
    id: 'cursed_bat',
    name: '저주받은 박쥐',
    description:
      '어둠의 마법에 오염된 거대 박쥐. 초음파로 정신을 흐트러뜨리고 생명력을 흡수한다.',
    tier: 'normal',
    chapter: 1,
    hp: 38,
    maxHp: 38,
    defense: 2,
    magicDefense: 7,
    actions: [
      {
        id: 'bat_bite',
        name: '물기',
        description: '날카로운 이빨로 물어 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 10, target: 'self' }],
        weight: 45,
      },
      {
        id: 'bat_dark_screech',
        name: '어둠의 절규',
        description: '어둠의 기운이 담긴 울부짖음으로 마법 데미지와 함께 DEX를 감소시킨다.',
        effects: [
          { type: 'magic_damage', value: 8, target: 'self', element: 'dark' },
          { type: 'debuff', value: -2, duration: 2, target: 'self', stat: 'dex' },
        ],
        weight: 35,
      },
      {
        id: 'bat_drain_life',
        name: '생명력 흡수',
        description: '상대의 생명력을 흡수해 자신의 체력을 회복한다.',
        effects: [
          { type: 'damage', value: 8, target: 'self' },
          { type: 'heal', value: 8, target: 'self' },
        ],
        weight: 20,
      },
    ],
    drops: [
      { itemId: 'bat_fang', chance: 0.4 },
      { itemId: 'dark_essence', chance: 0.25 },
      { itemId: 'common_card_shard', chance: 0.1 },
    ],
    expReward: 28,
    goldReward: [10, 22],
  },

  // ─── Elite × 1 ───────────────────────────────────────────

  {
    id: 'stone_golem',
    name: '돌 골렘',
    description:
      '유적을 수호하도록 마법으로 창조된 거대 석상. 압도적인 방어력과 강력한 지진 공격을 사용한다.',
    tier: 'elite',
    chapter: 1,
    hp: 155,
    maxHp: 155,
    defense: 18,
    magicDefense: 10,
    actions: [
      {
        id: 'golem_stone_fist',
        name: '석권',
        description: '거대한 석권으로 강타해 큰 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 28, target: 'self' }],
        weight: 40,
      },
      {
        id: 'golem_earth_slam',
        name: '지진 강타',
        description: '바닥을 강타해 충격파로 물리 데미지와 함께 STR을 감소시킨다.',
        effects: [
          { type: 'damage', value: 20, target: 'self' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'str' },
        ],
        weight: 35,
      },
      {
        id: 'golem_fortify',
        name: '석화 강화',
        description: '몸을 더욱 굳혀 방어막을 생성하고 다음 공격에 대비한다.',
        effects: [{ type: 'shield', value: 25, target: 'self' }],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'golem_core', chance: 0.55 },
      { itemId: 'rare_card_shard', chance: 0.3 },
      { itemId: 'stone_fragment', chance: 0.7 },
      { itemId: 'rusty_pendant', chance: 0.15 },
    ],
    expReward: 120,
    goldReward: [75, 150],
  },

  // ─── Boss × 1 ────────────────────────────────────────────

  {
    id: 'shadow_lich',
    name: '그림자 리치',
    description:
      '고대의 비밀을 탐하다 죽음과 계약을 맺은 마법사의 망령. 유적의 최심부에서 영원히 잠들지 못하며 어둠의 힘을 조종한다. Chapter 1의 최종 보스.',
    tier: 'boss',
    chapter: 1,
    hp: 350,
    maxHp: 350,
    defense: 12,
    magicDefense: 22,
    actions: [
      {
        id: 'lich_soul_drain',
        name: '영혼 흡수',
        description: '상대의 영혼 에너지를 빼앗아 마법 데미지를 입히고 자신의 마나를 회복한다.',
        effects: [
          { type: 'magic_damage', value: 25, target: 'self', element: 'dark' },
          { type: 'mana', value: 15, target: 'self' },
        ],
        weight: 30,
      },
      {
        id: 'lich_dark_nova',
        name: '암흑 폭발',
        description: '강렬한 어둠의 에너지를 폭발시켜 강력한 마법 데미지를 입힌다.',
        effects: [
          { type: 'magic_damage', value: 40, target: 'self', element: 'dark' },
        ],
        weight: 25,
      },
      {
        id: 'lich_curse_wave',
        name: '저주의 파동',
        description: '저주의 파동을 방사해 모든 스탯을 2턴간 약화시킨다.',
        effects: [
          { type: 'debuff', value: -4, duration: 2, target: 'self', stat: 'str' },
          { type: 'debuff', value: -4, duration: 2, target: 'self', stat: 'int' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'dex' },
        ],
        weight: 25,
      },
      {
        id: 'lich_bone_shield',
        name: '뼈 방패',
        description: '소환한 해골 병사들을 방어막 삼아 강화 방어막을 얻는다.',
        effects: [{ type: 'shield', value: 35, target: 'self' }],
        weight: 20,
      },
    ],
    drops: [
      { itemId: 'lich_relic', chance: 1.0 },
      { itemId: 'epic_card_shard', chance: 0.35 },
      { itemId: 'ancient_tome', chance: 0.5 },
      { itemId: 'rare_card_shard', chance: 0.8 },
      { itemId: 'dark_essence', chance: 1.0 },
    ],
    expReward: 500,
    goldReward: [280, 500],
  },
];
