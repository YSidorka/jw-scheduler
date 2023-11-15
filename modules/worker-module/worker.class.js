const { Worker } = require('worker_threads');
const { join } = require('path');

const { MAIN_DIR, SECOND, TYPE_ENVIRONMENT } = require('@jw/const');
const { getDocumentById } = require('@jw/data.mongo');

const { createCRONTask } = require('../cron-module/cron.module');
const { addLog } = require('../log-module/log.module');

class JobWorker {
  static STATUS_NEW = 'NEW';

  static STATUS_PROCESS = 'IN PROCESS';

  static STATUS_TERM = 'TERMINATED';

  static STATUS_FINISH = 'FINISHED';

  constructor(obj) {
    const { id, title, path, env, timeout, cronexp: cronExp } = obj || {};

    this.id = id || title || null;
    this.title = title || '';
    this.active = false;

    // worker state
    this.status = JobWorker.STATUS_NEW;
    this.started = null;
    this.finished = null;

    // process.env - variables
    this.env = env || {};

    // worker main process path
    this.workerPath = path || null;
    this.worker = null;

    this.timeout = 0;
    if (!Number.isNaN(+timeout) && +timeout > 0) this.timeout = +timeout;

    // start CRON job
    if (cronExp) {
      const cronTask = createCRONTask({ cronExp, scheduled: true }, this.start.bind(this));
      if (cronTask) {
        this.active = true;
        this.cron = cronTask;
      }
    }

    this.log = [];
  }

  isValid() {
    if (!this.id) return false;
    if (!this.title) return false;
    if (!this.env) return false;
    if (!this.workerPath) return false;
    if (!this.timeout < 0) return false;

    // ...additional validators
    return true;
  }

  async start() {
    try {
      if (this.status === JobWorker.STATUS_PROCESS) throw new Error('Already started');

      const $ENV = await initEnvData(this.env);
      const env = {
        title: this.title,
        $ENV: JSON.stringify($ENV || {})
      };

      this.worker = startWorkerProcess.call(this, env);
      this.status = JobWorker.STATUS_PROCESS;
      this.started = Date.now();
      this.finished = null;
      startTimeoutTermination.call(this);

      return true;
    } catch (err) {
      console.log(`Error start ${this.id}:`, err.message);
      return err;
    }
  }

  async terminate() {
    try {
      if (this.status !== JobWorker.STATUS_PROCESS) throw new Error('Not in process');

      await this.worker.terminate();
      this.worker.unref();
      this.worker = null;

      return true;
    } catch (err) {
      console.log(`Error terminate ${this.id}:`, err.message);
      return err;
    }
  }
}

module.exports = JobWorker;

function startWorkerProcess(env) {
  const worker = new Worker(join(MAIN_DIR, 'workers', this.workerPath), { env });

  worker.on('message', async (msgObj) => {
    await addLog.call(null, this.id, msgObj);
  });

  worker.on('error', async (err) => {
    await addLog.call(null, this.id, `Critical error: ${err.message}`);
    await addLog.call(null, this.id, `Critical error: ${err.stack}`);
  });

  worker.on('exit', async (code) => {
    this.status = code === 0 ? JobWorker.STATUS_FINISH : JobWorker.STATUS_TERM;
    this.finished = Date.now();
    stopTimeoutTermination.call(this);
    await addLog.call(
      null,
      this.id,
      `Worker exited with code ${code}. Duration: ${Math.round(
        (this.finished - this.started) / SECOND
      )}`
    );
  });

  return worker;
}

function startTimeoutTermination() {
  if (!this.timeout) return;

  this.$timeout = setTimeout(() => {
    this.worker && this.terminate();
  }, this.timeout * SECOND);
}

function stopTimeoutTermination() {
  if (!this.$timeout) return;
  clearTimeout(this.$timeout);
  delete this.$timeout;
}

async function initEnvData(env) {
  try {
    const result = {};

    const keys = Object.keys(env);
    while (keys.length) {
      const key = keys.pop();
      if (env[key]) {
        result[key] = env[key];

        const doc = await getDocumentById(`${env[key]}`);
        if (doc?.data && doc?.type === TYPE_ENVIRONMENT) result[key] = doc?.data;
      }
    }

    return result;
  } catch (err) {
    console.log('Error: initEnvData', err.message);
    return null;
  }
}
