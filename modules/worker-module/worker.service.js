const JobWorker = require('./worker.class');

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

module.exports = {
  addWorker,
  getWorkerList: getJobWorkerList,
  getWorkerById: getJobWorkerById
};
