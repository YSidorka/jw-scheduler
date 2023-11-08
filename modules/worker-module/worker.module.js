const { TYPE_WORKER } = require('@jw/const');
const { getDocumentList } = require('../data-module/data.service');
const { addWorker } = require('./worker.service');

module.exports = {
  init: async () => {
    // collect workers
    const workers = await getDocumentList({ type: TYPE_WORKER, active: true });
    workers.forEach((item) => {
      addWorker({ ...item.data, id: item.id });
    });
    console.log('Worker module initialized');
  }
};
