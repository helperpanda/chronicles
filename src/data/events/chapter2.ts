import type { GameEvent } from '../_schema';

export const chapter2Events: GameEvent[] = [
  {
    id: 'event_c2_poisonous_mushroom',
    title: '독버섯 군락',
    description:
      '빽빽한 나무 사이로 색색의 버섯들이 군락을 이루고 있었다. 일부는 식용으로 보였고, 일부는 의심스러웠다. 저주받은 숲에서 살아남은 자들은 모두 이 버섯 덕분이라는 이야기가 있었다.',
    chapter: 2,
    choices: [
      {
        id: 'eat_bright_mushroom',
        text: '밝은 색 버섯을 먹는다.',
        outcomes: [
          {
            description: '버섯에서 특이한 에너지가 온몸에 퍼졌다. STR +2, INT +2 영구 증가했다.',
            effects: [
              { type: 'buff', value: 2, target: 'self', stat: 'str' },
              { type: 'buff', value: 2, target: 'self', stat: 'int' },
            ],
            probability: 0.7,
          },
          {
            description: '배탈이 났다. 체력이 20 감소했다.',
            effects: [{ type: 'damage', value: 20, target: 'self' }],
            probability: 0.3,
          },
        ],
      },
      {
        id: 'collect_mushroom',
        text: '약재로 채집한다.',
        outcomes: [
          {
            description: '숲의 약초와 함께 버섯을 모았다. 유용한 재료가 될 것이다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'ignore_mushroom',
        text: '위험해 보여 무시한다.',
        outcomes: [
          {
            description: '안전하게 지나쳤다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c2_wounded_deer',
    title: '상처 입은 사슴',
    description:
      '앞발에 독 가시가 박힌 채 쓰러진 사슴이 있었다. 두 눈이 영롱하게 빛났다. 어딘가 신성한 분위기가 감돌았다.',
    chapter: 2,
    choices: [
      {
        id: 'heal_deer',
        text: '가시를 뽑고 상처를 치료해준다.',
        outcomes: [
          {
            description:
              '사슴이 천천히 일어나 너를 향해 고개를 숙이더니 사라졌다. 숲의 가호가 느껴졌다. 체력이 50 회복됐다.',
            effects: [{ type: 'heal', value: 50, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'leave_deer',
        text: '그냥 지나친다.',
        outcomes: [
          {
            description: '사슴의 슬픈 눈이 등 뒤를 쫓았다. 아무 일도 일어나지 않았다.',
            effects: [],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'take_thorn',
        text: '독 가시를 채취한다.',
        outcomes: [
          {
            description: '독 가시를 얻었다. 재료로 쓸 수 있겠지만 사슴이 고통스럽게 울부짖었다.',
            effects: [
              { type: 'special', value: 0, target: 'self' },
              { type: 'debuff', value: -2, duration: 3, target: 'self', stat: 'dex' },
            ],
            probability: 1.0,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c2_witch_hut',
    title: '마녀의 오두막',
    description:
      '숲 한켠에 들어앉은 오두막 굴뚝에서 보랏빛 연기가 솟아올랐다. 문이 열리며 눈 하나가 달린 마녀가 고개를 내밀었다. "어서와, 오는 자는 드물지. 거래할 생각은 없어?"',
    chapter: 2,
    choices: [
      {
        id: 'trade_card',
        text: '카드 1장을 바꿔달라고 한다. (골드 100 소모)',
        requirement: 'gold:100',
        outcomes: [
          {
            description: '"흥미로운 선택이야." 마녀가 낡은 카드를 집어들며 희귀 카드 조각을 건넸다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'buy_curse_removal',
        text: '디버프 제거를 의뢰한다. (골드 60 소모)',
        requirement: 'gold:60',
        outcomes: [
          {
            description: '마녀가 가마솥을 휘젓더니 모든 디버프가 사라졌다. 체력도 20 회복됐다.',
            effects: [
              { type: 'special', value: 0, target: 'self' },
              { type: 'heal', value: 20, target: 'self' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'steal_brew',
        text: '마녀를 밀치고 가마솥 내용물을 마신다.',
        outcomes: [
          {
            description:
              '"이런 도둑놈!" 마녀의 저주와 함께 강렬한 에너지가 퍼졌다. STR +3, 최대 HP -15.',
            effects: [
              { type: 'buff', value: 3, target: 'self', stat: 'str' },
              { type: 'buff', value: -15, target: 'self', stat: 'hp' },
            ],
            probability: 0.6,
          },
          {
            description:
              '"쓸모없는 짓이야." 마녀가 비웃었다. 저주에 걸려 3턴간 모든 스탯이 감소했다.',
            effects: [
              { type: 'debuff', value: -4, duration: 5, target: 'self', stat: 'str' },
              { type: 'debuff', value: -4, duration: 5, target: 'self', stat: 'int' },
            ],
            probability: 0.4,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c2_ancient_tree_altar',
    title: '고대 나무 제단',
    description:
      '수천 년은 됐을 거목 앞에 작은 제단이 있었다. 뿌리 사이사이에 과거 여행자들이 남긴 제물의 흔적이 보였다. 나무는 살아있는 것처럼 천천히 숨을 쉬고 있었다.',
    chapter: 2,
    choices: [
      {
        id: 'offer_gold_tree',
        text: '골드를 나무 뿌리에 묻는다. (골드 100 소모)',
        requirement: 'gold:100',
        outcomes: [
          {
            description:
              '나무가 온기를 내뿜으며 축복을 내렸다. 최대 HP +20, 모든 스탯 +1 영구 증가.',
            effects: [
              { type: 'buff', value: 20, target: 'self', stat: 'hp' },
              { type: 'buff', value: 1, target: 'self', stat: 'str' },
              { type: 'buff', value: 1, target: 'self', stat: 'int' },
              { type: 'buff', value: 1, target: 'self', stat: 'dex' },
            ],
            probability: 1.0,
          },
        ],
      },
      {
        id: 'meditate_tree',
        text: '제단 앞에서 명상한다.',
        outcomes: [
          {
            description: '고요한 평화가 몸에 스몄다. 체력이 완전히 회복됐다.',
            effects: [{ type: 'heal', value: 9999, target: 'self' }],
            probability: 0.6,
          },
          {
            description:
              '집중하다 잠들어버렸다. 깨어나니 누군가 골드를 훔쳐갔다. 골드 40 감소.',
            effects: [{ type: 'special', value: -40, target: 'self' }],
            probability: 0.4,
          },
        ],
      },
      {
        id: 'take_bark_sample',
        text: '나무껍질을 채취한다.',
        outcomes: [
          {
            description: '고대 수피를 얻었다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 0.8,
          },
          {
            description:
              '나무가 화를 냈다. 거대한 가지가 내리쳐 체력이 25 감소했다.',
            effects: [{ type: 'damage', value: 25, target: 'self' }],
            probability: 0.2,
          },
        ],
      },
    ],
  },

  {
    id: 'event_c2_cursed_spring',
    title: '저주받은 샘물',
    description:
      '검은 기운이 감도는 샘 앞에 멈췄다. 물 속에서 무언가 흐릿하게 반짝였다. 이 샘은 소원을 들어준다는 전설이 있지만, 대가가 따른다고도 했다.',
    chapter: 2,
    choices: [
      {
        id: 'drink_cursed_water',
        text: '샘물을 마신다.',
        outcomes: [
          {
            description:
              '강렬한 힘이 솟구쳤다. STR +4, INT +4, 하지만 최대 HP -30.',
            effects: [
              { type: 'buff', value: 4, target: 'self', stat: 'str' },
              { type: 'buff', value: 4, target: 'self', stat: 'int' },
              { type: 'buff', value: -30, target: 'self', stat: 'hp' },
            ],
            probability: 0.5,
          },
          {
            description:
              '검은 물이 온몸을 타고 퍼졌다. 3턴 강독에 걸리고 체력이 30 감소했다.',
            effects: [
              { type: 'debuff', value: 8, duration: 3, target: 'self', stat: 'poison' },
              { type: 'damage', value: 30, target: 'self' },
            ],
            probability: 0.5,
          },
        ],
      },
      {
        id: 'throw_coin',
        text: '동전을 던져 소원을 빈다.',
        outcomes: [
          {
            description: '소원이 이루어졌다. 골드 150을 획득했다.',
            effects: [{ type: 'special', value: 150, target: 'self' }],
            probability: 0.4,
          },
          {
            description:
              '동전이 빨려들어가더니 아무 일도 없었다.',
            effects: [],
            probability: 0.6,
          },
        ],
      },
      {
        id: 'search_bottom',
        text: '샘 바닥에 빛나는 것을 꺼내려 한다.',
        outcomes: [
          {
            description:
              '희귀 유물을 건져냈다! 고대 수피와 희귀 카드 조각을 획득했다.',
            effects: [{ type: 'special', value: 0, target: 'self' }],
            probability: 0.35,
          },
          {
            description: '손이 저주받은 물에 닿았다. 체력 20 감소, DEX -3 (2턴).',
            effects: [
              { type: 'damage', value: 20, target: 'self' },
              { type: 'debuff', value: -3, duration: 2, target: 'self', stat: 'dex' },
            ],
            probability: 0.65,
          },
        ],
      },
    ],
  },
];
