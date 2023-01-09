const { filter: _filter, isEmpty: _isEmpty } = require('lodash');

const WorkerOutputDto = require('./worker-output.dto');
const { getWorkerList, getWorkerById, addWorker, updateWorker } = require('./worker.service');

async function getAllWorkersCtrl(req, res, next) {
  try {
    const data = getWorkerList();
    let result = data.map((item) => new WorkerOutputDto(item));
    if (!_isEmpty(req.query)) result = _filter(result, req.query);

    return res.send(result);
  } catch (err) {
    return next({ message: `GET /: ${err.message}` });
  }
}

async function getWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    return res.send(new WorkerOutputDto(worker));
  } catch (err) {
    return next({ message: `GET /${req.params.id}: ${err.message}` });
  }
}

async function initWorkerCtrl(req, res, next) {
  try {
    const options = req.body;
    const worker = addWorker(options);
    if (!worker) return next({ code: 400, message: 'Cannot init worker' });

    return res.send(new WorkerOutputDto(worker));
  } catch (err) {
    return next({ message: `POST /init: ${err.message}` });
  }
}

async function startWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    const result = await worker.start();
    if (result instanceof Error) return next({ code: 400, message: result.message });

    return res.send(new WorkerOutputDto(worker));
  } catch (err) {
    return next({ message: `POST /start/${req.params.id}: ${err.message}` });
  }
}

async function terminateWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    const result = await worker.terminate();
    if (result instanceof Error) return next({ code: 400, message: result.message });

    return res.send(new WorkerOutputDto(worker));
  } catch (err) {
    return next({ message: `POST /terminate/${req.params.id}: ${err.message}` });
  }
}

async function updateWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    const options = req.body;
    await updateWorker(worker, options);

    return res.send(new WorkerOutputDto(worker));
  } catch (err) {
    return next({ message: `GET /${req.params.id}: ${err.message}` });
  }
}

module.exports = {
  getAllWorkersCtrl,
  getWorkerByIdCtrl,
  initWorkerCtrl,
  startWorkerByIdCtrl,
  terminateWorkerByIdCtrl,
  updateWorkerByIdCtrl
};
