export type MarketInfo = {
  indicator: string;
  indicatorValue: string | number;
  message: string;
  colorFlag: 1 | 2 | 3 | 4 | 5;
};

export type TopCryptoItem = {
  img_url: string;
  label: string;
  price: number;
  daily_return: number;
};

export type CryptoItem = {
  img_url: string;
  label: string;
  daily_return: number;
  price: number;
  trades: number;
  expected_var: -1 | 1;
  expected_profit: number;
};

export type CryptoIcon = {
  imgUrl: string;
  label: string;
};

export type NewsFeedItemType = {
  subject: string;
  delay: number;
  title: string;
  cryptosImgRelated: CryptoIcon[];
};
