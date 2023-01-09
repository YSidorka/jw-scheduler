const { parentPort } = require('worker_threads');

const { sleep } = require('../common/utils');

const { processingTime } = JSON.parse(process.env.$ENV || '{}');

parentPort.postMessage(`STARTED: ${process.env.title} : ${processingTime || 10000}`);

sleep(processingTime || 10000).then(() => {
  parentPort.postMessage('FINISHED');
});
