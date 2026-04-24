import type { Chapter } from '../_schema';

export const chapter3: Chapter = {
  id: 3,
  title: '용의 산맥',
  subtitle: "Dragon's Mountain Range",
  floors: 3,
  roomsPerFloor: 4,
  roomConfig: [
    { type: 'combat', weight: 38 },
    { type: 'elite',  weight: 20 },
    { type: 'event',  weight: 22 },
    { type: 'shop',   weight: 12 },
    { type: 'rest',   weight: 8  },
  ],
  newClasses: ['dragon_knight', 'alchemist'],
  newCombos: [
    'combo_c3_flame_barrage',
    'combo_c3_alchemic_blast',
    'combo_c3_dragons_oath',
    'combo_c3_chaos_elixir',
    'combo_c3_inferno_storm',
  ],
  hiddenUnlocks: [],
  bossId: 'ancient_dragon',
  storyBeats: [
    {
      trigger: 'chapter_start',
      text: '저주받은 숲을 벗어나자 거대한 산맥이 모습을 드러냈다. 산 정상에서 화염이 솟아올랐고, 공기에는 유황 냄새와 고대의 마법이 가득했다. 발 아래의 땅은 뜨거웠고, 멀리서 웅장한 날갯짓 소리가 울려 퍼졌다. 용들의 땅. 여기서부터는 모든 것이 달라진다.',
    },
    {
      trigger: 'floor_2_enter',
      text: '산맥 중반부. 동굴 벽면에 용의 문장이 새겨져 있었다. 아직도 타오르는 불길을 보니 이 산 자체가 살아 숨쉰다는 것이 분명했다. 발 아래로 용암이 흐르는 소리가 들렸다. "뒤로 돌아가라." 바위 틈에서 무언가가 속삭였다.',
    },
    {
      trigger: 'elite_defeated',
      text: '고룡 친위대가 쓰러지며 갑옷에서 화염이 새어나왔다. "...고대의 주인이 깨어나고 있다." 마지막 숨을 내쉬며 그들이 남긴 말이 귀에 울렸다. 정상이 가까워지고 있었다.',
    },
    {
      trigger: 'boss_encounter',
      text: '산의 정상. 고대의 화염이 하늘을 물들이며 거대한 형체가 모습을 드러냈다. 태초부터 이 세계를 지켜온 자. 눈에서 은빛 빛이 발산되었다. "작은 존재여... 네가 찾는 것이 무엇이냐?" 그 목소리는 천둥 같았다. 땅이 흔들리고 화염이 사방에서 솟아올랐다.',
    },
    {
      trigger: 'boss_defeated',
      text: '고대 용이 서서히 쓰러지며 눈빛이 희미해졌다. "...강하구나. 이 세계의 비밀을 알 자격이 있다." 용의 몸이 빛으로 변하며 세계의 근원이 담긴 지식이 마음속에 새겨졌다. 모험은 끝났지만, 진정한 여정은 이제 시작이었다.',
    },
  ],
};
