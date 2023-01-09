let port = 80;

function initEnvSettings() {
  try {
    port = process.env.PORT || port;
  } catch (err) {
    console.log(`Environment initialization: FAILED!!!`, err);
    process.exit(0);
  }
  printEnv();
}

function printEnv() {
  console.log(`------- ENV -------`);
  console.log(`NODE_ENV:`, process.env.NODE_ENV);
  console.log(`Port:`, port);
  console.log(`---------------------`);
}

module.exports = {
  init: () => {
    initEnvSettings();
  },
  get httpPort() {
    return port;
  }
};
