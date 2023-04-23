const { SECOND } = require('sky-constants');
const { STATUS_NEW, STATUS_PROCESS, STATUS_TERM, STATUS_FINISH } = require('./worker.class');
const { getLogs } = require('../log-module/log.module');

class WorkerOutputDto {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.active = !!obj.active;
    this.worker = obj.workerPath;

    this.status = obj.status || null;

    this.started = null;
    this.finished = obj.finished ? new Date(obj.finished).toISOString() : null;

    if (obj.started) {
      this.started = new Date(obj.started).toISOString();
      const finished = obj.finished ? obj.finished : Date.now();
      this.durationSeconds = Math.round((finished - obj.started) / SECOND);
    }

    this.env = obj.env;
    this.timeout = obj.timeout || 'no limit';

    if (obj.cron) {
      const { cronExp, timezone } = obj.cron;
      this.cron = { cronExp, timezone };
    }

    this.log = [];
    // CSS settings
    if (this.status === STATUS_NEW) this._status = 'secondary';
    if (this.status === STATUS_PROCESS) this._status = 'primary';
    if (this.status === STATUS_TERM) this._status = 'danger';
    if (this.status === STATUS_FINISH) this._status = 'success';
  }

  async getLogs() {
    this.log = await getLogs(this.id);
  }
}

module.exports = WorkerOutputDto;
