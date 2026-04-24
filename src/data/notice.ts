export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const NOTICES: Notice[] = [
  {
    id: 'beta_v1',
    title: '베타 서비스 안내',
    content: '베타 서비스 중입니다. 버그는 road2213@gmail.com으로 제보해주세요.',
    date: '2026-04-23',
  },
];
