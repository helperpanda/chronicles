import type { Monster } from '../_schema';

export const chapter3Monsters: Monster[] = [
  // ─── Normal × 3 ──────────────────────────────────────────

  {
    id: 'fire_lizard',
    name: '용암 도마뱀',
    description:
      '산맥의 용암 지대에 서식하는 거대 도마뱀. 입에서 작은 화염을 내뿜고 단단한 비늘로 몸을 보호한다.',
    tier: 'normal',
    chapter: 3,
    hp: 58,
    maxHp: 58,
    defense: 6,
    magicDefense: 8,
    actions: [
      {
        id: 'lizard_flame_breath',
        name: '화염 숨결',
        description: '입에서 화염을 내뿜어 화염 마법 데미지를 입힌다.',
        effects: [{ type: 'magic_damage', value: 16, target: 'self', element: 'fire' }],
        weight: 40,
      },
      {
        id: 'lizard_tail_whip',
        name: '꼬리 채찍',
        description: '강력한 꼬리로 내리쳐 물리 데미지와 함께 DEX를 2턴간 감소시킨다.',
        effects: [
          { type: 'damage', value: 14, target: 'self' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'dex' },
        ],
        weight: 35,
      },
      {
        id: 'lizard_scale_harden',
        name: '비늘 강화',
        description: '비늘을 단단하게 굳혀 방어막을 생성한다.',
        effects: [{ type: 'shield', value: 14, target: 'self' }],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'flame_crystal',         chance: 0.50 },
      { itemId: 'dragon_scale_fragment', chance: 0.40 },
      { itemId: 'common_card_shard',     chance: 0.12 },
    ],
    expReward: 35,
    goldReward: [18, 38],
  },

  {
    id: 'mountain_troll',
    name: '산악 트롤',
    description:
      '산맥 깊은 곳에 사는 거대 트롤. 둔하지만 강인한 재생력과 압도적인 힘으로 침입자를 격퇴한다.',
    tier: 'normal',
    chapter: 3,
    hp: 90,
    maxHp: 90,
    defense: 14,
    magicDefense: 5,
    actions: [
      {
        id: 'troll_heavy_slam',
        name: '대지 강타',
        description: '주먹으로 땅을 내리쳐 강한 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 24, target: 'self' }],
        weight: 45,
      },
      {
        id: 'troll_stone_throw',
        name: '바위 투척',
        description: '거대한 바위를 던져 물리 데미지와 함께 STR을 약화시킨다.',
        effects: [
          { type: 'damage', value: 18, target: 'self' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'str' },
        ],
        weight: 30,
      },
      {
        id: 'troll_regenerate',
        name: '재생',
        description: '강인한 생명력으로 체력을 회복한다.',
        effects: [{ type: 'heal', value: 20, target: 'self' }],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'troll_club',        chance: 0.45 },
      { itemId: 'rare_card_shard',   chance: 0.10 },
      { itemId: 'flame_crystal',     chance: 0.20 },
    ],
    expReward: 48,
    goldReward: [22, 50],
  },

  {
    id: 'wyvern_scout',
    name: '와이번 정찰병',
    description:
      '고대 용의 명을 받아 산맥을 순찰하는 와이번. 날렵한 비행과 독침으로 침입자를 견제한다.',
    tier: 'normal',
    chapter: 3,
    hp: 62,
    maxHp: 62,
    defense: 5,
    magicDefense: 8,
    actions: [
      {
        id: 'wyvern_wing_slash',
        name: '날개 강타',
        description: '날카로운 날개로 빠르게 베어 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 16, target: 'self' }],
        weight: 40,
      },
      {
        id: 'wyvern_poison_sting',
        name: '독침',
        description: '꼬리의 독침으로 찔러 3턴 독을 부여한다.',
        effects: [{ type: 'debuff', value: 6, duration: 3, target: 'self', stat: 'poison' }],
        weight: 35,
      },
      {
        id: 'wyvern_dive',
        name: '급강하',
        description: '높은 곳에서 급강하하여 강력한 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 22, target: 'self' }],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'wyvern_wing_membrane', chance: 0.45 },
      { itemId: 'alchemist_essence',    chance: 0.30 },
      { itemId: 'common_card_shard',    chance: 0.15 },
    ],
    expReward: 40,
    goldReward: [20, 45],
  },

  // ─── Elite × 1 ───────────────────────────────────────────

  {
    id: 'dragon_guard',
    name: '고룡 친위대',
    description:
      '고대 용을 섬기는 정예 기사단원. 화염 검술과 철벽 방어로 수천 년간 용의 영역을 수호해왔다.',
    tier: 'elite',
    chapter: 3,
    hp: 210,
    maxHp: 210,
    defense: 16,
    magicDefense: 12,
    actions: [
      {
        id: 'guard_shield_bash',
        name: '방패 강타',
        description: '방패로 강하게 내리쳐 물리 데미지와 함께 방어막을 생성한다.',
        effects: [
          { type: 'damage', value: 22, target: 'self' },
          { type: 'shield', value: 20, target: 'self' },
        ],
        weight: 30,
      },
      {
        id: 'guard_flame_sword',
        name: '화염 검격',
        description: '화염을 두른 검으로 물리+화염 복합 데미지를 입힌다.',
        effects: [
          { type: 'damage', value: 20, target: 'self' },
          { type: 'magic_damage', value: 18, target: 'self', element: 'fire' },
        ],
        weight: 35,
      },
      {
        id: 'guard_iron_command',
        name: '철기 명령',
        description: '전투 명령을 내려 자신의 STR을 2턴간 크게 강화한다.',
        effects: [{ type: 'buff', value: 6, duration: 2, target: 'self', stat: 'str' }],
        weight: 20,
      },
      {
        id: 'guard_dragon_oath',
        name: '용의 맹세',
        description: '용에 대한 맹세로 방어막을 강화하고 체력을 회복한다.',
        effects: [
          { type: 'shield', value: 30, target: 'self' },
          { type: 'heal', value: 20, target: 'self' },
        ],
        weight: 15,
      },
    ],
    drops: [
      { itemId: 'dragon_scale_fragment', chance: 0.7  },
      { itemId: 'rare_card_shard',       chance: 0.35 },
      { itemId: 'flame_crystal',         chance: 0.6  },
      { itemId: 'dragon_flame_relic',    chance: 0.15 },
    ],
    expReward: 160,
    goldReward: [90, 180],
  },

  // ─── Boss × 1 ────────────────────────────────────────────

  {
    id: 'ancient_dragon',
    name: '고대 용',
    description:
      '태초부터 용의 산맥을 지배해온 전설의 용. 세계의 비밀을 간직한 수호자이자 절대적인 힘의 상징. 그 화염 한 번에 산이 무너진다.',
    tier: 'boss',
    chapter: 3,
    hp: 580,
    maxHp: 580,
    defense: 20,
    magicDefense: 20,
    actions: [
      {
        id: 'dragon_breath',
        name: '용의 숨결',
        description: '강렬한 고대 화염을 내뿜어 막대한 화염 마법 데미지를 입힌다.',
        effects: [{ type: 'magic_damage', value: 50, target: 'self', element: 'fire' }],
        weight: 25,
      },
      {
        id: 'dragon_claw_swipe',
        name: '발톱 강타',
        description: '거대한 발톱으로 내리쳐 막대한 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 52, target: 'self' }],
        weight: 25,
      },
      {
        id: 'dragon_wing_storm',
        name: '날개 폭풍',
        description: '거대한 날개로 폭풍을 일으켜 물리 데미지와 함께 DEX를 3턴간 크게 감소시킨다.',
        effects: [
          { type: 'damage', value: 32, target: 'self' },
          { type: 'debuff', value: -5, duration: 3, target: 'self', stat: 'dex' },
        ],
        weight: 20,
      },
      {
        id: 'dragon_ancient_fire',
        name: '고대의 불꽃',
        description: '태초의 불꽃을 해방해 화염 데미지와 함께 3턴 강독을 부여한다.',
        effects: [
          { type: 'magic_damage', value: 40, target: 'self', element: 'fire' },
          { type: 'debuff', value: 10, duration: 3, target: 'self', stat: 'poison' },
        ],
        weight: 20,
      },
      {
        id: 'dragon_armor_up',
        name: '갑옷 강화',
        description: '비늘을 강화해 거대한 방어막을 형성하고 체력을 회복한다.',
        effects: [
          { type: 'shield', value: 50, target: 'self' },
          { type: 'heal', value: 40, target: 'self' },
        ],
        weight: 10,
      },
    ],
    drops: [
      { itemId: 'ancient_dragon_heart',  chance: 1.0 },
      { itemId: 'ancient_dragon_scale',  chance: 1.0 },
      { itemId: 'epic_card_shard',       chance: 0.5 },
      { itemId: 'rare_card_shard',       chance: 1.0 },
      { itemId: 'dragon_flame_relic',    chance: 0.9 },
      { itemId: 'warden_amulet',         chance: 0.3 },
    ],
    expReward: 800,
    goldReward: [400, 700],
  },
];
