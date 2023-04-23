const logger = require('jw-logger');

const { sleep } = require('../common/utils');

const { processingTime } = JSON.parse(process.env.$ENV || '{}');

logger.postMessage(`STARTED: ${process.env.title} : ${processingTime || 10000}`);

sleep(processingTime || 10000).then(() => {
  logger.postMessage('FINISHED');
});
