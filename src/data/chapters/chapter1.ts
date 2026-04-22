import type { Chapter } from '../_schema';

export const chapter1: Chapter = {
  id: 1,
  title: '잊혀진 유적의 그림자',
  subtitle: 'Shadows of the Forgotten Ruins',
  floors: 3,
  roomsPerFloor: 4,
  roomConfig: [
    { type: 'combat', weight: 45 },
    { type: 'elite',  weight: 15 },
    { type: 'event',  weight: 20 },
    { type: 'shop',   weight: 12 },
    { type: 'rest',   weight: 8  },
    // boss room은 마지막 Floor 마지막 방으로 고정
  ],
  newClasses: ['warrior', 'mage', 'rogue', 'priest'],
  newCombos: [],
  hiddenUnlocks: [],
  bossId: 'shadow_lich',
  storyBeats: [
    {
      trigger: 'chapter_start',
      text: '어둠 속에서 눈을 떴을 때, 너는 낯선 유적 앞에 서 있었다. 공기 중에 오래된 마법의 냄새가 진동했고, 어디선가 뼈가 부딪히는 소리가 들려왔다. "여기서 나가려면 앞으로 나아가야 한다." 너는 무기를 고쳐쥐었다.',
    },
    {
      trigger: 'floor_2_enter',
      text: '유적의 두 번째 층. 벽에 새겨진 고대 문자가 희미하게 빛을 발하며 경고를 보내는 것 같았다. "이미 늦었다. 그림자가 깨어났다."',
    },
    {
      trigger: 'elite_defeated',
      text: '돌 골렘이 무너지며 핵심석이 바닥을 굴렀다. 골렘이 지키던 문 너머로 차갑고 어두운 바람이 불어왔다.',
    },
    {
      trigger: 'boss_encounter',
      text: '유적의 가장 깊은 곳. 보좌에 앉은 형체가 서서히 고개를 들었다. 텅 빈 눈구멍에서 보랏빛 불꽃이 타올랐다. "살아 있는 자가... 여기까지 왔군. 오랜만이야. 내 소중한 제물이여."',
    },
    {
      trigger: 'boss_defeated',
      text: '그림자 리치가 소멸하며 유적 전체가 흔들렸다. 먼지가 가라앉고 빛이 스며들자, 이곳에 남겨진 오래된 비밀이 서서히 모습을 드러냈다. 그리고 저 멀리, 새로운 길이 열렸다.',
    },
  ],
};
