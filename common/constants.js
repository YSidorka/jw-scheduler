const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const MAIN_DIR = process.env.INIT_CWD || process.env.PWD;

const STORE_TYPES = {
  FS_STORE: 'fs',
  MONGODB_STORE: 'mongodb'
};
Object.freeze(STORE_TYPES);

const RESERVED_URLS = {
  PAGE_LOGIN: '/login',
  PAGE_LOGOUT: '/logout',
  PAGE_ADMIN: '/admin',

  MEMORY_ROUTE: '/__memory'
};
Object.freeze(RESERVED_URLS);

const DATA_TYPES = {
  TYPE_ENVIRONMENT: 'environment'
};
Object.freeze(DATA_TYPES);

module.exports = {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK,

  ...DATA_TYPES,
  ...STORE_TYPES,
  ...RESERVED_URLS,

  MAIN_DIR
};
