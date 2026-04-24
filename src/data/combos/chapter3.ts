import type { ComboRecipe } from '../_schema';

export const chapter3Combos: ComboRecipe[] = [
  {
    id: 'combo_c3_flame_barrage',
    name: '화염 포격',
    requiredTags: [['fire', 'dragon_knight'], ['burst', 'explosion']],
    resultEffect: [
      { type: 'magic_damage', value: 80, target: 'enemy', element: 'fire' },
      { type: 'debuff', value: -4, duration: 3, target: 'enemy', stat: 'str' },
    ],
    manaCost: 5,
    flavor: '용기사의 화염과 연금술사의 폭발이 합쳐져 천지를 불사른다.',
    unlockChapter: 3,
  },
  {
    id: 'combo_c3_alchemic_blast',
    name: '연금 폭발',
    requiredTags: [['poison', 'alchemist'], ['fire', 'burst']],
    resultEffect: [
      { type: 'magic_damage', value: 55, target: 'enemy', element: 'fire' },
      { type: 'debuff', value: 12, duration: 3, target: 'enemy', stat: 'poison' },
    ],
    manaCost: 4,
    flavor: '독과 화염의 불안정한 조합이 폭발하며 적을 집어삼킨다.',
    unlockChapter: 3,
  },
  {
    id: 'combo_c3_dragons_oath',
    name: '용의 맹세',
    requiredTags: [['dragon', 'dragon_knight'], ['shield', 'physical']],
    resultEffect: [
      { type: 'damage', value: 60, target: 'enemy' },
      { type: 'shield', value: 50, target: 'self' },
      { type: 'buff', value: 3, duration: 3, target: 'self', stat: 'str' },
    ],
    manaCost: 4,
    flavor: '용기사의 맹세를 새기며 강철 방어 뒤에서 압도적인 일격을 날린다.',
    unlockChapter: 3,
  },
  {
    id: 'combo_c3_chaos_elixir',
    name: '혼돈의 비약',
    requiredTags: [['potion', 'alchemist'], ['buff', 'transmute']],
    resultEffect: [
      { type: 'buff', value: 5, duration: 3, target: 'self', stat: 'str' },
      { type: 'buff', value: 5, duration: 3, target: 'self', stat: 'int' },
      { type: 'buff', value: 4, duration: 3, target: 'self', stat: 'dex' },
      { type: 'heal', value: 30, target: 'self' },
    ],
    manaCost: 4,
    flavor: '혼돈의 원소가 뒤섞인 비약이 모든 능력을 한꺼번에 끌어올린다.',
    unlockChapter: 3,
  },
  {
    id: 'combo_c3_inferno_storm',
    name: '불길의 폭풍',
    requiredTags: [['fire', 'roar'], ['nature', 'poison']],
    resultEffect: [
      { type: 'magic_damage', value: 50, target: 'enemy', element: 'fire' },
      { type: 'magic_damage', value: 30, target: 'enemy', element: 'nature' },
      { type: 'debuff', value: 8, duration: 3, target: 'enemy', stat: 'poison' },
    ],
    manaCost: 5,
    flavor: '화염과 자연의 힘이 뒤엉켜 걷잡을 수 없는 폭풍을 만들어낸다.',
    unlockChapter: 3,
  },
];
