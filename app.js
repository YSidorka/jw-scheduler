// configs
const EnvConfig = require('./modules/configs/env.config');
const ServerConfig = require('./modules/configs/server.config');

// modules
const CRONModule = require('./modules/cron-module/cron.module');
const WorkerModule = require('./modules/worker-module/worker.module');

// app router/middleware
const AppMiddleware = require('./mdw/app.mdw');

const AppModule = [EnvConfig, ServerConfig, AppMiddleware, CRONModule, WorkerModule];

AppModule.forEach((module) => module && module.init());
