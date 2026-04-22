import type { Monster } from '../_schema';

export const chapter2Monsters: Monster[] = [
  // ─── Normal × 3 ──────────────────────────────────────────

  {
    id: 'forest_spider',
    name: '독거미',
    description:
      '저주받은 숲 깊숙이 서식하는 거대 독거미. 독니로 상대를 물어 서서히 체력을 갉아먹는다.',
    tier: 'normal',
    chapter: 2,
    hp: 52,
    maxHp: 52,
    defense: 4,
    magicDefense: 4,
    actions: [
      {
        id: 'spider_venom_bite',
        name: '독니 물기',
        description: '독이 가득한 이빨로 물어 물리 데미지와 3턴 독을 부여한다.',
        effects: [
          { type: 'damage', value: 10, target: 'self' },
          { type: 'debuff', value: 5, duration: 3, target: 'self', stat: 'poison' },
        ],
        weight: 50,
      },
      {
        id: 'spider_web_trap',
        name: '거미줄 덫',
        description: '끈적한 거미줄을 발사해 DEX를 2턴간 감소시킨다.',
        effects: [{ type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'dex' }],
        weight: 30,
      },
      {
        id: 'spider_quick_slash',
        name: '다리 베기',
        description: '여러 다리로 재빠르게 할퀴어 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 14, target: 'self' }],
        weight: 20,
      },
    ],
    drops: [
      { itemId: 'spider_venom_gland', chance: 0.45 },
      { itemId: 'forest_herb', chance: 0.3 },
      { itemId: 'common_card_shard', chance: 0.12 },
    ],
    expReward: 30,
    goldReward: [15, 32],
  },

  {
    id: 'corrupted_treant',
    name: '타락 나무정령',
    description:
      '어둠의 기운에 오염된 고대 나무정령. 거대한 가지로 강타하고 독성 포자를 흩뿌린다.',
    tier: 'normal',
    chapter: 2,
    hp: 72,
    maxHp: 72,
    defense: 10,
    magicDefense: 6,
    actions: [
      {
        id: 'treant_branch_slam',
        name: '가지 강타',
        description: '거대한 가지를 내리쳐 강한 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 20, target: 'self' }],
        weight: 45,
      },
      {
        id: 'treant_poison_spore',
        name: '독성 포자',
        description: '독성 포자를 뿌려 2턴간 독 데미지를 준다.',
        effects: [{ type: 'debuff', value: 6, duration: 2, target: 'self', stat: 'poison' }],
        weight: 35,
      },
      {
        id: 'treant_bark_shield',
        name: '수피 방어',
        description: '단단한 수피를 강화해 방어막을 생성한다.',
        effects: [{ type: 'shield', value: 16, target: 'self' }],
        weight: 20,
      },
    ],
    drops: [
      { itemId: 'ancient_bark', chance: 0.5 },
      { itemId: 'forest_herb', chance: 0.35 },
      { itemId: 'rare_card_shard', chance: 0.1 },
    ],
    expReward: 42,
    goldReward: [20, 45],
  },

  {
    id: 'feral_werewolf',
    name: '광폭 늑대인간',
    description:
      '숲의 저주에 이성을 잃은 늑대인간. 맹렬한 공격 속도와 분노 축적으로 전투가 길어질수록 강해진다.',
    tier: 'normal',
    chapter: 2,
    hp: 65,
    maxHp: 65,
    defense: 6,
    magicDefense: 3,
    actions: [
      {
        id: 'wolf_feral_claw',
        name: '광폭 발톱',
        description: '날카로운 발톱으로 두 번 할퀴어 물리 데미지를 입힌다.',
        effects: [
          { type: 'damage', value: 12, target: 'self' },
          { type: 'damage', value: 10, target: 'self' },
        ],
        weight: 50,
      },
      {
        id: 'wolf_howl',
        name: '광포한 울부짖음',
        description: '공포를 자아내는 울부짖음으로 DEX를 2턴간 크게 감소시킨다.',
        effects: [{ type: 'debuff', value: -5, duration: 2, target: 'self', stat: 'dex' }],
        weight: 25,
      },
      {
        id: 'wolf_berserk_rage',
        name: '광분',
        description: '분노를 폭발시켜 STR을 강화하고 강력한 일격을 날린다.',
        effects: [
          { type: 'buff', value: 5, duration: 2, target: 'self', stat: 'str' },
          { type: 'damage', value: 22, target: 'self' },
        ],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'wolf_pelt', chance: 0.4 },
      { itemId: 'beast_fang', chance: 0.35 },
      { itemId: 'common_card_shard', chance: 0.15 },
    ],
    expReward: 38,
    goldReward: [18, 42],
  },

  // ─── Elite × 1 ───────────────────────────────────────────

  {
    id: 'ancient_dryad',
    name: '고대 드리아드',
    description:
      '저주받은 숲의 수호자였으나 어둠에 잠식된 고대 숲의 정령. 강력한 자연 마법과 재생 능력으로 침입자를 몰아낸다.',
    tier: 'elite',
    chapter: 2,
    hp: 175,
    maxHp: 175,
    defense: 8,
    magicDefense: 20,
    actions: [
      {
        id: 'dryad_thorn_barrage',
        name: '가시 세례',
        description: '무수한 가시를 발사해 물리 및 자연 마법 데미지를 입힌다.',
        effects: [
          { type: 'damage', value: 18, target: 'self' },
          { type: 'magic_damage', value: 16, target: 'self', element: 'nature' },
        ],
        weight: 35,
      },
      {
        id: 'dryad_nature_pulse',
        name: '자연의 맥동',
        description: '자연의 에너지를 폭발시켜 강력한 마법 데미지와 함께 독을 부여한다.',
        effects: [
          { type: 'magic_damage', value: 32, target: 'self', element: 'nature' },
          { type: 'debuff', value: 6, duration: 2, target: 'self', stat: 'poison' },
        ],
        weight: 30,
      },
      {
        id: 'dryad_regenerate',
        name: '자연 재생',
        description: '숲의 생명력을 끌어당겨 체력을 크게 회복한다.',
        effects: [{ type: 'heal', value: 28, target: 'self' }],
        weight: 20,
      },
      {
        id: 'dryad_vine_entangle',
        name: '덩굴 속박',
        description: '강인한 덩굴로 적을 옭아매 모든 스탯을 약화시킨다.',
        effects: [
          { type: 'debuff', value: -5, duration: 3, target: 'self', stat: 'str' },
          { type: 'debuff', value: -5, duration: 3, target: 'self', stat: 'dex' },
          { type: 'debuff', value: -5, duration: 3, target: 'self', stat: 'int' },
        ],
        weight: 15,
      },
    ],
    drops: [
      { itemId: 'dryad_tear', chance: 0.6 },
      { itemId: 'rare_card_shard', chance: 0.35 },
      { itemId: 'ancient_bark', chance: 0.8 },
      { itemId: 'nature_relic', chance: 0.15 },
    ],
    expReward: 140,
    goldReward: [80, 160],
  },

  // ─── Boss × 1 ────────────────────────────────────────────

  {
    id: 'forest_warden',
    name: '숲의 파수꾼',
    description:
      '저주받은 숲의 최심부를 지키는 거대한 원시 수호자. 한때는 생명의 수호자였으나 고대의 저주에 완전히 잠식되어 침입자를 무자비하게 소멸시킨다.',
    tier: 'boss',
    chapter: 2,
    hp: 420,
    maxHp: 420,
    defense: 15,
    magicDefense: 15,
    actions: [
      {
        id: 'warden_primal_roar',
        name: '원시의 포효',
        description: '대지를 울리는 포효로 강한 마법 데미지와 함께 모든 스탯을 2턴간 약화시킨다.',
        effects: [
          { type: 'magic_damage', value: 28, target: 'self', element: 'nature' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'str' },
          { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'int' },
        ],
        weight: 25,
      },
      {
        id: 'warden_ancient_strike',
        name: '고대의 일격',
        description: '신화의 힘을 담은 강타로 막대한 물리 데미지를 입힌다.',
        effects: [{ type: 'damage', value: 48, target: 'self' }],
        weight: 25,
      },
      {
        id: 'warden_natures_wrath',
        name: '숲의 분노',
        description: '숲 전체의 분노를 모아 강렬한 자연 마법 데미지와 3턴 강독을 부여한다.',
        effects: [
          { type: 'magic_damage', value: 38, target: 'self', element: 'nature' },
          { type: 'debuff', value: 9, duration: 3, target: 'self', stat: 'poison' },
        ],
        weight: 25,
      },
      {
        id: 'warden_bark_armor',
        name: '원시 갑옷',
        description: '원시의 수피로 몸을 덮어 강력한 방어막을 얻고 체력을 회복한다.',
        effects: [
          { type: 'shield', value: 40, target: 'self' },
          { type: 'heal', value: 30, target: 'self' },
        ],
        weight: 25,
      },
    ],
    drops: [
      { itemId: 'warden_heart', chance: 1.0 },
      { itemId: 'epic_card_shard', chance: 0.4 },
      { itemId: 'ancient_bark', chance: 1.0 },
      { itemId: 'dryad_tear', chance: 0.8 },
      { itemId: 'rare_card_shard', chance: 0.9 },
    ],
    expReward: 600,
    goldReward: [320, 580],
  },
];
