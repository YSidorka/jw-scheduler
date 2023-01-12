const JobWorker = require('./worker.class');
const { startCRONTask, stopCRONTask } = require('../cron-module/cron.module');

const jobWorkerMap = new Map();

function getJobWorkerById(id) {
  return jobWorkerMap.has(id) ? jobWorkerMap.get(id) : null;
}

function addWorker(options) {
  try {
    const id = options?.title || null;

    // Is already created
    let jobWorker = getJobWorkerById(id);
    if (jobWorker) throw new Error(`Worker already created.`);

    // create worker + validation
    jobWorker = new JobWorker(options);
    if (!jobWorker.isValid()) throw new Error(`Invalid worker data`);

    jobWorkerMap.set(jobWorker.id, jobWorker);
    return jobWorker;
  } catch (err) {
    console.log(`Error addWorker ${options?.title || null}:`, err.message);
    return null;
  }
}

function getJobWorkerList() {
  const result = [];
  jobWorkerMap.forEach((item) => {
    result.push(item);
  });
  return result;
}

async function updateJobWorker(jobWorker, options) {
  // TODO add input DTO

  const worker = jobWorker; // keep attention (by link)
  if (options.active === true) {
    worker.active = true;
    if (worker.cron) startCRONTask(worker.cron);
  }
  if (options.active === false) {
    worker.active = false;
    if (worker.cron) stopCRONTask(worker.cron);
  }
  if (options.title) worker.title = options.title;
  if (options.env) worker.env = options.env;
  if (options.path) worker.workerPath = options.path;

  return worker;
}

module.exports = {
  addWorker,
  updateWorker: updateJobWorker,

  getWorkerList: getJobWorkerList,
  getWorkerById: getJobWorkerById
};
