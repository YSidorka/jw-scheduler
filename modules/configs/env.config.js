const { MONGODB_STORE } = require('@jw/const');
const { initMongoDb } = require('@jw/env.config');

let port = 80;
let dataStoreEnv = {};

function initEnvSettings() {
  try {
    port = process.env.PORT || port;
    dataStoreEnv = getDataStoreModule();
  } catch (err) {
    console.log(`Environment initialization: FAILED!!!`, err);
    process.exit(0);
  }
  printEnv();
}

function getDataStoreModule() {
  try {
    const obj = JSON.parse(process.env.DATA_STORAGE);
    const options = initMongoDb(obj);
    return {
      type: MONGODB_STORE,
      options
    };
  } catch (err) {
    console.log(`Error getDataStoreModule:`, err.message);
    return {};
  }
}

function printEnv() {
  console.log(`------- ENV -------`);
  console.log(`NODE_ENV:`, process.env.NODE_ENV);
  console.log(`Port:`, port);
  if (dataStoreEnv) console.log(`DATA STORAGE:`, dataStoreEnv);
  console.log(`---------------------`);
}

module.exports = {
  init: () => {
    initEnvSettings();
  },
  get httpPort() {
    return port;
  },
  getStore: getDataStoreModule
};
