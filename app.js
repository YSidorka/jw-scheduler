// configs
const EnvConfig = require('./modules/configs/env.config');
const ServerConfig = require('./modules/configs/server.config');

// modules
const CRONModule = require('./modules/cron-module/cron.module');
const { addWorker } = require('./modules/worker-module/worker.service');

// app router/middleware
const AppMiddleware = require('./mdw/app.mdw');

const AppModule = [
  EnvConfig,
  ServerConfig,
  AppMiddleware,
  CRONModule
];

AppModule.forEach((module) => module && module.init());

addWorker({
  title: `test:worker`,
  path: 'test-worker.js',
  env: {
    processingTime: 3000
  },
  // cronexp: '0 * * * * *',
  timeout: 5
});
