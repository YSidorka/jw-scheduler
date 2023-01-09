/*
OPTIONS: {
  scheduled: A boolean to set if the created task is scheduled. Default true;
  timezone: The timezone that is used for job scheduling. See moment-timezone for valid values.
}
*/

const CRON = require('node-cron');

function createCRONTask({ cronExp, scheduled = false, timezone }, fn) {
  try {
    if (!CRON.validate(cronExp)) throw new Error('Invalid CRON expression');
    if (typeof fn !== 'function') throw new Error('No function to use');

    const options = {};
    if (!scheduled) options.scheduled = false;
    if (!timezone) options.timezone = timezone;

    const result = {
      cronExp,
      timezone,
      taskObject: CRON.schedule(cronExp, fn, options)
    };
    return result;
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return null;
  }
}

function startCRONTask(task) {
  try {
    task.taskObject.start();
    return true;
  } catch (err) {
    console.log(`Error: startCRONTask ${err.message}`);
    return false;
  }
}

function stopCRONTask(task) {
  try {
    task.taskObject.stop();
    return true;
  } catch (err) {
    console.log(`Error: stopCRONTask ${err.message}`);
    return false;
  }
}

module.exports = {
  init: () => {
    console.log('CRON module initialized');
  },
  createCRONTask,
  startCRONTask,
  stopCRONTask
};
