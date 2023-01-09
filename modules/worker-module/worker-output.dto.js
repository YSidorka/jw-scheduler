const { SECOND } = require('../../common/constants');

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

    this.log = obj.log;
  }
}

module.exports = WorkerOutputDto;
