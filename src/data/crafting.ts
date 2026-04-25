import type { Item } from './_schema';

export interface CraftingRecipe {
  id: string;
  ingredients: string[];
  resultId: string;
}

export const CRAFTED_ITEMS: Item[] = [
  {
    id: 'crafted_deadly_poison',
    name: '맹독 포션',
    type: 'potion',
    description: '전투 중 적에게 3턴간 독 20 피해를 준다.',
    effects: [{ type: 'debuff', value: 20, duration: 3, target: 'enemy', stat: 'poison' }],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_fire_bomb',
    name: '화염 폭탄',
    type: 'potion',
    description: '전투 중 적에게 화염 마법 데미지 45를 준다.',
    effects: [{ type: 'magic_damage', value: 45, target: 'enemy', element: 'fire' }],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_protection_scroll',
    name: '보호 두루마리',
    type: 'potion',
    description: '전투 중 방어막 30을 생성한다.',
    effects: [{ type: 'shield', value: 30, target: 'self' }],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_recovery_elixir',
    name: '회복 엘릭서',
    type: 'potion',
    description: '전투 중 HP 60을 즉시 회복한다.',
    effects: [{ type: 'heal', value: 60, target: 'self' }],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_lightning_crystal',
    name: '번개 수정',
    type: 'potion',
    description: '전투 중 적에게 번개 마법 데미지 35를 준다.',
    effects: [{ type: 'magic_damage', value: 35, target: 'enemy', element: 'lightning' }],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_freeze_bullet',
    name: '빙결 탄환',
    type: 'potion',
    description: '전투 중 적에게 빙결 데미지 20 + 2턴간 DEX -10을 부여한다.',
    effects: [
      { type: 'magic_damage', value: 20, target: 'enemy', element: 'ice' },
      { type: 'debuff', value: -10, duration: 2, target: 'enemy', stat: 'dex' },
    ],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_regen_dew',
    name: '재생의 이슬',
    type: 'potion',
    description: '전투 중 HP 20 회복 후 2턴간 매 턴 HP 15를 재생한다.',
    effects: [
      { type: 'heal', value: 20, target: 'self' },
      { type: 'buff', value: 15, duration: 2, target: 'self', stat: 'regen' },
    ],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_chaos_potion',
    name: '혼돈의 비약',
    type: 'potion',
    description: '전투 중 STR·INT를 3턴간 각각 +15 강화한다.',
    effects: [
      { type: 'buff', value: 15, duration: 3, target: 'self', stat: 'str' },
      { type: 'buff', value: 15, duration: 3, target: 'self', stat: 'int' },
    ],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_steel_oil',
    name: '강철 오일',
    type: 'potion',
    description: '전투 중 방어막 15 + 3턴간 DEF +8을 부여한다.',
    effects: [
      { type: 'shield', value: 15, target: 'self' },
      { type: 'buff', value: 8, duration: 3, target: 'self', stat: 'defense' },
    ],
    chapter: 1,
    price: 0,
  },
  {
    id: 'crafted_purification_incense',
    name: '정화의 향',
    type: 'potion',
    description: '전투 중 모든 디버프를 제거하고 HP 25를 회복한다.',
    effects: [
      { type: 'special', value: 0, target: 'self', stat: 'cleanse' },
      { type: 'heal', value: 25, target: 'self' },
    ],
    chapter: 1,
    price: 0,
  },
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  { id: 'recipe_deadly_poison',         ingredients: ['bat_fang', 'dark_essence'],                              resultId: 'crafted_deadly_poison' },
  { id: 'recipe_fire_bomb',             ingredients: ['iron_fragment', 'dark_essence'],                         resultId: 'crafted_fire_bomb' },
  { id: 'recipe_protection_scroll',     ingredients: ['stone_fragment', 'common_card_shard'],                   resultId: 'crafted_protection_scroll' },
  { id: 'recipe_recovery_elixir',       ingredients: ['golem_core', 'rare_card_shard'],                         resultId: 'crafted_recovery_elixir' },
  { id: 'recipe_lightning_crystal',     ingredients: ['rare_card_shard', 'bat_fang'],                           resultId: 'crafted_lightning_crystal' },
  { id: 'recipe_freeze_bullet',         ingredients: ['stone_fragment', 'iron_fragment'],                       resultId: 'crafted_freeze_bullet' },
  { id: 'recipe_regen_dew',             ingredients: ['bat_fang', 'stone_fragment', 'common_card_shard'],       resultId: 'crafted_regen_dew' },
  { id: 'recipe_chaos_potion',          ingredients: ['dark_essence', 'rare_card_shard', 'iron_fragment'],      resultId: 'crafted_chaos_potion' },
  { id: 'recipe_steel_oil',             ingredients: ['golem_core', 'iron_fragment'],                           resultId: 'crafted_steel_oil' },
  { id: 'recipe_purification_incense',  ingredients: ['ancient_tome', 'common_card_shard'],                     resultId: 'crafted_purification_incense' },
];

export const CRAFT_MATERIAL_IDS = new Set([
  'common_card_shard', 'rare_card_shard', 'epic_card_shard',
  'iron_fragment', 'bat_fang', 'dark_essence', 'stone_fragment',
  'golem_core', 'ancient_tome',
  'spider_venom_gland', 'forest_herb', 'cursed_bark', 'twilight_mushroom',
  'will_o_wisp_essence', 'ancient_root', 'moonstone_shard',
  'flame_crystal', 'dragon_scale_fragment', 'mountain_ore',
  'troll_blood', 'wyvern_fang', 'dragon_guard_badge',
  'ancient_dragon_heart', 'ancient_dragon_scale',
]);

export function matchRecipe(selectedIds: string[]): CraftingRecipe | null {
  const sorted = [...selectedIds].sort();
  for (const recipe of CRAFTING_RECIPES) {
    if (recipe.ingredients.length !== sorted.length) continue;
    const recipeSorted = [...recipe.ingredients].sort();
    if (recipeSorted.every((id, i) => id === sorted[i])) return recipe;
  }
  return null;
}
