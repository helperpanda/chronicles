import type { GameEvent } from '../_schema';

export const chapter3Events: GameEvent[] = [
  {
    id: 'event_c3_dragon_egg',
    title: '용의 알',
    description:
      '바위 틈 사이 깊숙이 커다란 알이 놓여 있었다. 붉은 금빛 무늬의 껍데기가 희미하게 따뜻한 빛을 발하고 있었다. 분명 용의 알이었다. 어딘가에서 어미가 지켜보고 있을지도 몰랐다.',
    chapter: 3,
    choices: [
      {
        id: 'warm_egg',
        text: '알 옆에서 체온을 나눠준다.',
        outcomes: [
          {
            description: '알에서 갓 부화한 작은 용이 고개를 들어 너를 바라보더니 인장처럼 빛을 새겨줬다. STR +3, INT +3 영구 증가.',
            effects: [
              { type: 'buff', value: 3, target: 'self', stat: 'str' },
              { type: 'buff', value: 3, target: 'self', stat: 'int' },
            ],
            probability: 0.6,
          },
          {
            description: '알이 갑자기 폭발하며 화염이 쏟아졌다. 체력 35 감소.',
            effects: [{ type: 'damage', value: 35, target: 'self' }],
            probability: 0.4,
          },
        ],
      },
      {
        id: 'take_egg',
        text: '알을 조심스럽게 챙긴다. (재료로 쓸 수 있겠다.)',
        outcomes: [
          {
            description: '용의 알 조각을 얻었다. 귀한 재료가 될 것이다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 0.5,
          },
          {
            description: '갑자기 어미 용의 울부짖음이 들렸다. 급히 도망쳤지만 화염 공격을 피하지 못했다. 체력 50 감소.',
            effects: [{ type: 'damage', value: 50, target: 'self' }],
            probability: 0.5,
          },
        ],
      },
      {
        id: 'leave_egg',
        text: '건드리지 않고 조용히 지나친다.',
        outcomes: [
          {
            description: '지혜로운 선택이었다. 아무 일도 일어나지 않았다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c3_lava_spring',
    title: '용암 온천',
    description:
      '바위 틈에서 뜨거운 김이 솟아오르고 있었다. 가까이 다가가 보니 붉은 빛을 띤 기묘한 온천이었다. 전설에서 용의 피가 스민 곳에서 이런 온천이 생긴다고 했다. 뜨거웠지만 묘하게 끌렸다.',
    chapter: 3,
    choices: [
      {
        id: 'bathe_spring',
        text: '온천에 몸을 담근다.',
        outcomes: [
          {
            description: '뜨거운 열기가 온몸에 퍼지며 강인해졌다. 체력 완전 회복, CON +2 영구 증가.',
            effects: [
              { type: 'heal', value: 9999, target: 'self' },
              { type: 'buff', value: 2, target: 'self', stat: 'con' },
            ],
            probability: 0.55,
          },
          {
            description: '온도가 너무 높았다. 화상을 입어 체력이 40 감소하고 3턴간 화염 데미지를 받는다.',
            effects: [
              { type: 'damage', value: 40, target: 'self' },
              { type: 'debuff', value: -3, duration: 3, target: 'self', stat: 'con' },
            ],
            probability: 0.45,
          },
        ],
      },
      {
        id: 'collect_water',
        text: '온천수를 물병에 담는다.',
        outcomes: [
          {
            description: '온천수를 담아뒀다. 나중에 무기에 바르면 화염 속성을 부여할 수 있을 것 같다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'skip_spring',
        text: '위험해 보여 그냥 지나친다.',
        outcomes: [
          {
            description: '안전하게 지나쳤다. 아쉽지만 현명한 선택일지도.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c3_wandering_alchemist',
    title: '방랑 연금술사',
    description:
      '이 위험한 산맥에서 연금술 재료를 채집하는 노인을 만났다. 등에 가득한 플라스크들이 쨍그랑 소리를 냈다. "재료를 팔거나, 지식을 나눌 수도 있지. 어떻게 하겠나?"',
    chapter: 3,
    choices: [
      {
        id: 'buy_items',
        text: '비약을 구입한다. (골드 80 소모)',
        requirement: 'gold:80',
        outcomes: [
          {
            description: '연금술사에게서 대형 회복 비약을 구입했다. 체력이 60 회복됐다.',
            effects: [{ type: 'heal', value: 60, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'trade_knowledge',
        text: '연금술 지식을 받는다. (골드 60 소모)',
        requirement: 'gold:60',
        outcomes: [
          {
            description: '연금술 비법을 전수받았다. INT +3 영구 증가.',
            effects: [{ type: 'buff', value: 3, target: 'self', stat: 'int' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'threaten_alchemist',
        text: '협박해서 모든 것을 빼앗는다.',
        outcomes: [
          {
            description: '"이런 무례한 놈!" 노인이 폭발 물약을 던졌다. 체력 45 감소. 하지만 물약 몇 병은 챙겼다.',
            effects: [
              { type: 'damage', value: 45, target: 'self' },
              { type: 'special', value: 50, target: 'self' },
            ],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c3_ancient_dragon_bone',
    title: '고대 용의 뼈',
    description:
      '산비탈에 거대한 뼈대가 드러누워 있었다. 이미 수천 년은 된 것 같았다. 뼈에서 아직도 희미한 마법의 기운이 감돌았다. 고대 용이 남긴 유산이 이 안에 잠들어 있을지도 몰랐다.',
    chapter: 3,
    choices: [
      {
        id: 'absorb_energy',
        text: '뼈에서 에너지를 흡수한다.',
        outcomes: [
          {
            description: '태초의 힘이 온몸에 스몄다. STR +2, CON +2 영구 증가.',
            effects: [
              { type: 'buff', value: 2, target: 'self', stat: 'str' },
              { type: 'buff', value: 2, target: 'self', stat: 'con' },
            ],
            probability: 0.65,
          },
          {
            description: '역류가 일어났다. 강한 충격에 체력 40 감소.',
            effects: [{ type: 'damage', value: 40, target: 'self' }],
            probability: 0.35,
          },
        ],
      },
      {
        id: 'collect_bone_shard',
        text: '뼈 조각을 채취한다.',
        outcomes: [
          {
            description: '고대 용린 조각을 얻었다. 귀중한 재료다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'pray_bone',
        text: '고대 용의 영혼에 기도한다.',
        outcomes: [
          {
            description: '숙연한 마음으로 기도하자 따뜻한 기운이 감쌌다. 체력 50 회복.',
            effects: [{ type: 'heal', value: 50, target: 'self' }],
            probability: 0.7,
          },
          {
            description: '고대 용의 잔존 의식이 깨어나 공격했다. 체력 30 감소.',
            effects: [{ type: 'damage', value: 30, target: 'self' }],
            probability: 0.3,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c3_dragon_knight_post',
    title: '버려진 기사단 초소',
    description:
      '산길 옆에 반쯤 무너진 석조 초소가 있었다. 고룡 친위대의 문장이 새겨진 방패가 벽에 기대어 있었다. 내부에는 낡은 무기와 함께 기사단의 기록이 담긴 서책이 남아 있었다.',
    chapter: 3,
    choices: [
      {
        id: 'loot_post',
        text: '초소를 샅샅이 뒤진다.',
        outcomes: [
          {
            description: '낡은 무기와 골드를 발견했다. 골드 120 획득.',
            effects: [{ type: 'special', value: 120, target: 'self' }],
            probability: 0.6,
          },
          {
            description: '덫에 걸렸다. 화염 장치가 작동해 체력 35 감소.',
            effects: [{ type: 'damage', value: 35, target: 'self' }],
            probability: 0.4,
          },
        ],
      },
      {
        id: 'read_journal',
        text: '기사단의 서책을 읽는다.',
        outcomes: [
          {
            description: '고대 전투 기술을 터득했다. DEX +2, STR +1 영구 증가.',
            effects: [
              { type: 'buff', value: 2, target: 'self', stat: 'dex' },
              { type: 'buff', value: 1, target: 'self', stat: 'str' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'pass_post',
        text: '조용히 지나친다.',
        outcomes: [
          {
            description: '아무것도 건드리지 않고 지나쳤다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },
];
