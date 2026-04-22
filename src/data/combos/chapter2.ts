import type { ComboRecipe } from '../_schema';

export const chapter2Combos: ComboRecipe[] = [
  {
    id: 'combo_c2_poison_burst',
    name: '독성 폭발',
    requiredTags: [['poison'], ['nature', 'druid']],
    resultEffect: [
      { type: 'magic_damage', value: 60, target: 'enemy', element: 'nature' },
      { type: 'debuff', value: 10, duration: 3, target: 'enemy', stat: 'poison' },
    ],
    manaCost: 4,
    flavor: '자연의 독이 한꺼번에 폭발하며 치명적인 에너지를 방출한다.',
    unlockChapter: 2,
  },
  {
    id: 'combo_c2_iron_sanctuary',
    name: '강철 성역',
    requiredTags: [['shield', 'marshal'], ['holy']],
    resultEffect: [
      { type: 'shield', value: 65, target: 'self' },
      { type: 'heal', value: 35, target: 'self' },
      { type: 'magic_damage', value: 25, target: 'enemy', element: 'holy' },
    ],
    manaCost: 4,
    flavor: '성스러운 빛이 강철 방벽을 감싸며 강인한 성역을 형성한다.',
    unlockChapter: 2,
  },
  {
    id: 'combo_c2_natures_judgment',
    name: '자연의 심판',
    requiredTags: [['nature'], ['holy', 'crusade']],
    resultEffect: [
      { type: 'magic_damage', value: 75, target: 'enemy', element: 'nature' },
      { type: 'magic_damage', value: 35, target: 'enemy', element: 'holy' },
      { type: 'debuff', value: -5, duration: 3, target: 'enemy', stat: 'dex' },
    ],
    manaCost: 5,
    flavor: '자연과 신성의 힘이 합쳐져 강렬한 심판의 빛이 내리꽂힌다.',
    unlockChapter: 2,
  },
  {
    id: 'combo_c2_beast_wrath',
    name: '야수의 분노',
    requiredTags: [['beast', 'druid'], ['heavy', 'physical']],
    resultEffect: [
      { type: 'damage', value: 55, target: 'enemy' },
      { type: 'buff', value: 4, duration: 2, target: 'self', stat: 'str' },
    ],
    manaCost: 3,
    flavor: '야수의 본능과 기사의 힘이 합쳐져 폭풍 같은 일격을 날린다.',
    unlockChapter: 2,
  },
  {
    id: 'combo_c2_rooted_fortress',
    name: '뿌리 요새',
    requiredTags: [['root', 'nature'], ['formation', 'shield']],
    resultEffect: [
      { type: 'shield', value: 45, target: 'self' },
      { type: 'debuff', value: -6, duration: 3, target: 'enemy', stat: 'dex' },
      { type: 'debuff', value: -4, duration: 3, target: 'enemy', stat: 'str' },
    ],
    manaCost: 3,
    flavor: '뿌리가 발밑을 고정하고 방패가 적을 막아낸다.',
    unlockChapter: 2,
  },
];
