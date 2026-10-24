const USER_TYPE = Object.freeze({
  NORMAL: 1,
  ADMIN: 2,
  GUEST: 3,
});

const ERROR_CODE = Object.freeze({
  SUCCESS: 0,
  SESSION_INVALID: 10,
  INVALID_PARAMETER: 1001,
  NOT_FOUND: 1002,
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
  GEM_PURCHASE: 1,
  GEM_FREE: 2,
  GOLD: 3,
  HEART: 4,
  CARD: 5
});


module.exports = {
  USER_TYPE,
  ERROR_CODE,
  CHANNEL_TYPE,
  SESSION_USE,
  REWARD_TYPE,
};