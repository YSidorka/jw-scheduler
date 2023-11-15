const { TYPE_WORKER } = require('@jw/const');
const { initConnection, assignSchema, getDocumentList } = require('@jw/data.mongo');
const { addWorker } = require('./worker.service');
const { getStore } = require('../configs/env.config');
const WorkerSchema = require('./schemas/worker.schema');
const EnvSchema = require('./schemas/env.schema');

module.exports = {
  init: async () => {
    const connect = initConnection(getStore().options);
    assignSchema('Worker', WorkerSchema, connect);
    assignSchema('Environment', EnvSchema, connect);

    // collect workers
    const workers = await getDocumentList({ type: TYPE_WORKER, active: true });
    workers.forEach((item) => {
      addWorker({ ...item.data, id: item.id });
    });
    console.log('Worker module initialized');
  }
};
