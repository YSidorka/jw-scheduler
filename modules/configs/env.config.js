const { MONGODB_STORE } = require('../../common/constants');

let port = 80;
let dataStoreEnv = {};

function initEnvSettings() {
  try {
    port = process.env.PORT || port;
    setDataStoreModule();
  } catch (err) {
    console.log(`Environment initialization: FAILED!!!`, err);
    process.exit(0);
  }
  printEnv();
}

function setDataStoreModule() {
  try {
    const { dbUrl, dbName, secret } = JSON.parse(process.env.DATA_STORAGE);

    dataStoreEnv = {
      type: MONGODB_STORE,
      options: {
        dbUrl,
        dbName,
        secret
      }
    };
  } catch (err) {
    console.log(`Error setDataStoreModule:`, err.message);
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
  getStore: () => dataStoreEnv
};
