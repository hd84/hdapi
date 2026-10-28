const USER_TYPE = Object.freeze({
  NORMAL: 1,
  ADMIN: 2,
  GUEST: 3,
});

const CHANNEL_TYPE = Object.freeze({
  GUEST: 0,
  APPLE: 1,
  GOOGLE: 2,
});

const SESSION_USE = Object.freeze({
  NONE: 0,
  DEFAULT: 1,
  AUTO_REFRESH: 2,
});

const REWARD_TYPE = Object.freeze({
  GEM_PAID: 1,
  GEM_FREE: 2,
  GOLD: 3,
  HEART: 4,
  CARD: 5
});

const SHOP_GOODS_TYPE = Object.freeze({
  GACHA: 1,
  GEM_PAID: 2,
  GEM_FREE: 3,
  GOLD: 4,
  HEART: 5,
  PACKAGE: 6
});

module.exports = {
  USER_TYPE,
  CHANNEL_TYPE,
  SESSION_USE,
  REWARD_TYPE,
  SHOP_GOODS_TYPE
};