import type { ComboRecipe } from '../_schema';

export const chapter1Combos: ComboRecipe[] = [
  {
    id: 'combo_c1_steam_burst',
    name: '증기 폭발',
    requiredTags: [['fire'], ['ice']],
    resultEffect: [
      { type: 'magic_damage', value: 55, target: 'all_enemies', element: 'fire' },
      { type: 'debuff', value: -3, duration: 2, target: 'all_enemies', stat: 'dex' },
    ],
    manaCost: 4,
    flavor: '화염과 냉기가 충돌하며 폭발적인 증기를 일으킨다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_toxic_strike',
    name: '독 강타',
    requiredTags: [['strike', 'physical'], ['poison']],
    resultEffect: [
      { type: 'damage', value: 38, target: 'enemy' },
      { type: 'debuff', value: 12, duration: 4, target: 'enemy', stat: 'poison' },
    ],
    manaCost: 3,
    flavor: '무기에 치명적인 독을 입혀 깊이 박아넣는다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_shadow_execute',
    name: '그림자 처형',
    requiredTags: [['shadow', 'dark'], ['finisher']],
    resultEffect: [
      { type: 'damage', value: 80, target: 'enemy' },
      { type: 'magic_damage', value: 30, target: 'enemy', element: 'dark' },
    ],
    manaCost: 5,
    flavor: '어둠 속에서 번뜩이는 칼날이 적의 숨통을 끊는다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_holy_bulwark',
    name: '성스러운 보루',
    requiredTags: [['holy'], ['shield']],
    resultEffect: [
      { type: 'shield', value: 55, target: 'self' },
      { type: 'heal', value: 25, target: 'self' },
    ],
    manaCost: 3,
    flavor: '신성한 빛이 방어막을 강화하고 상처를 봉합한다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_thunder_cleave',
    name: '번개 휩쓸기',
    requiredTags: [['lightning', 'chain'], ['cleave', 'aoe']],
    resultEffect: [
      { type: 'magic_damage', value: 38, target: 'all_enemies', element: 'lightning' },
      { type: 'damage', value: 20, target: 'all_enemies' },
    ],
    manaCost: 5,
    flavor: '번개를 두른 무기로 전장을 휩쓸며 모든 적을 강타한다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_arcane_blade',
    name: '비전 검격',
    requiredTags: [['arcane'], ['physical', 'warrior']],
    resultEffect: [
      { type: 'magic_damage', value: 45, target: 'enemy', element: 'fire' },
      { type: 'damage', value: 30, target: 'enemy' },
    ],
    manaCost: 4,
    flavor: '마법 에너지를 무기에 담아 물리와 마법 데미지를 동시에 입힌다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_marked_execution',
    name: '각인된 처형',
    requiredTags: [['mark'], ['finisher', 'strike']],
    resultEffect: [
      { type: 'damage', value: 110, target: 'enemy' },
      { type: 'magic_damage', value: 40, target: 'enemy', element: 'dark' },
    ],
    manaCost: 6,
    flavor: '사신의 낙인이 찍힌 적에게 회피 불가능한 처형을 내린다.',
    unlockChapter: 1,
  },
  {
    id: 'combo_c1_blessing_of_war',
    name: '전쟁의 축복',
    requiredTags: [['war_cry', 'buff'], ['holy', 'blessing']],
    resultEffect: [
      { type: 'buff', value: 5, duration: 3, target: 'self', stat: 'str' },
      { type: 'buff', value: 5, duration: 3, target: 'self', stat: 'int' },
      { type: 'buff', value: 4, duration: 3, target: 'self', stat: 'dex' },
      { type: 'shield', value: 20, target: 'self' },
    ],
    manaCost: 3,
    flavor: '신의 축복이 깃든 함성이 모든 능력을 끌어올린다.',
    unlockChapter: 1,
  },
];
