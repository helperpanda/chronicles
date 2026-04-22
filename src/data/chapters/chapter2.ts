import type { Chapter } from '../_schema';

export const chapter2: Chapter = {
  id: 2,
  title: '저주받은 숲의 심장',
  subtitle: 'Heart of the Cursed Forest',
  floors: 3,
  roomsPerFloor: 4,
  roomConfig: [
    { type: 'combat', weight: 40 },
    { type: 'elite',  weight: 18 },
    { type: 'event',  weight: 22 },
    { type: 'shop',   weight: 12 },
    { type: 'rest',   weight: 8  },
  ],
  newClasses: ['druid', 'marshal'],
  newCombos: [
    'combo_c2_poison_burst',
    'combo_c2_iron_sanctuary',
    'combo_c2_natures_judgment',
    'combo_c2_beast_wrath',
    'combo_c2_rooted_fortress',
  ],
  hiddenUnlocks: [],
  bossId: 'forest_warden',
  storyBeats: [
    {
      trigger: 'chapter_start',
      text: '유적의 문을 빠져나오자 끝없는 숲이 펼쳐졌다. 나뭇가지들이 하늘을 가렸고, 어둠 속에서 기묘한 소리들이 들려왔다. 공기에는 달콤하지만 불길한 독기가 서려 있었다. "이 숲은... 살아있어." 너는 발걸음을 조심스럽게 내디뎠다.',
    },
    {
      trigger: 'floor_2_enter',
      text: '숲의 심층부. 나무들의 수피에 검은 문양이 새겨져 있었다. 발밑의 땅이 떨리듯 진동했다. 어디선가 숲의 정령이 속삭이는 소리가 들렸다. "돌아가라... 여기는 너희의 세계가 아니야."',
    },
    {
      trigger: 'elite_defeated',
      text: '드리아드가 쓰러지며 눈물 같은 액체가 대지에 스몄다. 그 자리에 작은 꽃 한 송이가 피어났다. 저주받은 숲에도 아직 순수함이 남아 있었다. 하지만 더 강한 것이 기다리고 있었다.',
    },
    {
      trigger: 'boss_encounter',
      text: '숲의 가장 깊은 곳. 고대의 거목이 눈을 떴다. 나무의 표면이 갈라지며 거대한 형체가 모습을 드러냈다. "침입자여... 이 숲의 심장에 발을 들인 이상, 돌아가는 길은 없다." 땅이 흔들리며 뿌리들이 사방에서 솟아올랐다.',
    },
    {
      trigger: 'boss_defeated',
      text: '파수꾼이 쓰러지며 숲 전체에 빛이 스몄다. 오랫동안 드리워졌던 저주가 서서히 걷혀갔다. 나무들이 다시 숨을 쉬기 시작했고, 먼 곳에서 새 소리가 들려왔다. 그 너머로, 오래된 도시의 실루엣이 모습을 드러냈다.',
    },
  ],
};
