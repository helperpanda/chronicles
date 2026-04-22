import type { GameEvent } from '../_schema';

export const chapter1Events: GameEvent[] = [
  {
    id: 'event_c1_wandering_merchant',
    title: '방랑 상인',
    description:
      '어둠 속 촛불 하나에 의지해 낡은 짐수레를 끌던 노인이 말을 걸었다. "이런 곳까지 오다니 용감하군요. 제 물건을 보시겠어요?"',
    chapter: 1,
    choices: [
      {
        id: 'buy_potion',
        text: '소형 회복 물약을 구매한다. (골드 50 소모)',
        requirement: 'gold:50',
        outcomes: [
          {
            description: '"좋은 선택이에요." 노인이 물약 하나를 건네며 사라졌다.',
            effects: [
              { type: 'special', value: 0, target: 'self' }, // add small_potion to inventory
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'ask_info',
        text: '유적에 대한 정보를 묻는다.',
        outcomes: [
          {
            description:
              '"이 유적의 끝에는 오래된 리치가 잠들어 있소. 빛을 두려워하니 기억해 두쇼." 카드 조각 하나를 선물로 받았다.',
            effects: [
              { type: 'special', value: 0, target: 'self' }, // add common_card_shard
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'ignore',
        text: '무시하고 지나친다.',
        outcomes: [
          {
            description: '노인은 혼자 중얼거리며 어둠 속으로 사라졌다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c1_ancient_altar',
    title: '고대 제단',
    description:
      '피로 물든 제단 앞에 멈췄다. 제단 중앙에 오래된 문양이 희미하게 빛났다. 무언가를 바치면 보상을 받을 수 있을 것 같다.',
    chapter: 1,
    choices: [
      {
        id: 'offer_gold',
        text: '골드를 바친다. (골드 80 소모)',
        requirement: 'gold:80',
        outcomes: [
          {
            description: '제단이 황금빛으로 빛나며 힘을 불어넣었다. STR과 INT가 영구 +1 상승했다.',
            effects: [
              { type: 'buff', value: 1, target: 'self', stat: 'str' },
              { type: 'buff', value: 1, target: 'self', stat: 'int' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'offer_hp',
        text: '피를 바친다. (최대 HP의 20% 소모)',
        outcomes: [
          {
            description: '제단이 피를 흡수하더니 고급 카드 조각을 뱉어냈다.',
            effects: [
              { type: 'special', value: -20, target: 'self' }, // % max hp
            ],
            probability: 0.8,
          },
          {
            description: '제단이 피를 흡수했지만 아무 일도 일어나지 않았다. 손해였다.',
            effects: [
              { type: 'special', value: -20, target: 'self' },
            ],
            probability: 0.2,
          },
        ],
      },
      {
        id: 'leave',
        text: '건드리지 않고 떠난다.',
        outcomes: [
          {
            description: '빛이 서서히 사그라들었다. 안전하지만 기회를 놓쳤다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c1_trapped_adventurer',
    title: '갇힌 모험가',
    description:
      '돌무더기에 깔린 모험가가 신음하고 있었다. "제발... 도와줘요." 손에는 낡은 지도 한 장이 쥐어져 있었다.',
    chapter: 1,
    choices: [
      {
        id: 'rescue',
        text: '힘을 써서 구출한다. (체력 15 소모)',
        outcomes: [
          {
            description:
              '"고마워요!" 모험가는 가진 것을 모두 줬다. 소형 회복 물약과 골드 60을 획득했다.',
            effects: [
              { type: 'damage', value: 15, target: 'self' },
              { type: 'special', value: 60, target: 'self' }, // gold
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'take_map',
        text: '지도를 빼앗고 떠난다.',
        outcomes: [
          {
            description:
              '지도를 얻었다. 이 층의 방 배치가 드러났다. 하지만 등 뒤에서 저주의 말이 들려왔다.',
            effects: [
              { type: 'debuff', value: -2, duration: 5, target: 'self', stat: 'dex' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'pass',
        text: '못 본 척 지나간다.',
        outcomes: [
          {
            description: '신음 소리가 멀어졌다. 마음이 무거웠지만 계속 나아갔다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c1_mysterious_library',
    title: '신비한 서재',
    description:
      '먼지 쌓인 책장 사이에서 세 권의 책이 눈에 띄었다. 책에서는 각기 다른 마법의 기운이 흘러나왔다.',
    chapter: 1,
    choices: [
      {
        id: 'read_red_book',
        text: '붉은 책을 읽는다. (공격 마법서)',
        outcomes: [
          {
            description: '화염과 번개의 비전이 머릿속에 새겨졌다. 공격 스킬 카드 1장을 획득했다.',
            effects: [
              { type: 'special', value: 0, target: 'self' }, // add random attack card
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'read_blue_book',
        text: '푸른 책을 읽는다. (방어 마법서)',
        outcomes: [
          {
            description: '냉철한 방어의 지혜가 스며들었다. 방어/버프 스킬 카드 1장을 획득했다.',
            effects: [
              { type: 'special', value: 0, target: 'self' }, // add random defense card
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'read_black_book',
        text: '검은 책을 읽는다. (금지된 마법서)',
        outcomes: [
          {
            description:
              '강렬한 어둠의 지식이 몰려왔다. 희귀 카드 조각 2개를 획득했지만 최대 HP가 영구 10 감소했다.',
            effects: [
              { type: 'buff', value: -10, target: 'self', stat: 'hp' },
              { type: 'special', value: 2, target: 'self' }, // add 2 rare_card_shard
            ],
            probability: 0.7,
          },
          {
            description:
              '어둠의 저주가 네 정신을 공격했다. 저주에 걸려 최대 HP가 20 감소했다.',
            effects: [
              { type: 'buff', value: -20, target: 'self', stat: 'hp' },
            ],
            probability: 0.3,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c1_restoration_spring',
    title: '회복의 샘',
    description:
      '유적 깊은 곳에서 은은하게 빛나는 샘을 발견했다. 물은 차갑고 맑았으며 어딘가 신성한 기운이 감돌았다.',
    chapter: 1,
    choices: [
      {
        id: 'drink_fully',
        text: '샘물을 마음껏 마신다.',
        outcomes: [
          {
            description: '체력이 완전히 회복됐다. 몸이 가볍고 상쾌해졌다.',
            effects: [
              { type: 'heal', value: 9999, target: 'self' }, // full heal
            ],
            probability: 0.85,
          },
          {
            description:
              '처음엔 시원했지만 이상한 뒷맛이 남았다. 독에 중독됐다.',
            effects: [
              { type: 'debuff', value: 8, duration: 5, target: 'self', stat: 'poison' },
            ],
            probability: 0.15,
          },
        ],
      },
      {
        id: 'drink_carefully',
        text: '조심스럽게 한 모금만 마신다.',
        outcomes: [
          {
            description: '체력을 40 회복했다. 무리하지 않은 선택이었다.',
            effects: [
              { type: 'heal', value: 40, target: 'self' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'fill_vial',
        text: '물약병에 담아간다.',
        outcomes: [
          {
            description: '샘물을 담은 물약을 얻었다. 나중에 사용할 수 있다.',
            effects: [
              { type: 'special', value: 0, target: 'self' }, // add spring_water item
            ],
            probability: 1.0,
          },
        ],
      },
    ],
  },
];
