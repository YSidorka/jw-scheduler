const { filter: _filter, isEmpty: _isEmpty } = require('lodash');

const WorkerOutputDto = require('./worker-output.dto');
const { getWorkerList, getWorkerById, addWorker, updateWorker } = require('./worker.service');

async function getAllWorkersCtrl(req, res, next) {
  try {
    const data = getWorkerList();
    let result = [];

    for (let i = 0; i < data.length; i += 1) {
      const dto = new WorkerOutputDto(data[i]);
      await dto.getLogs();
      result.push(dto);
    }
    if (!_isEmpty(req.query)) result = _filter(result, req.query);

    // render section
    const page = { data: {} };
    page.data.workers = result;

    const view = 'dashboard';
    return res.render(view, { ...page.data });
  } catch (err) {
    return next({ message: `GET /: ${err.message}` });
  }
}

async function getWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    const result = new WorkerOutputDto(worker);
    await result.getLogs();
    return res.send(result);
  } catch (err) {
    return next({ message: `GET /${req.params.id}: ${err.message}` });
  }
}

async function initWorkerCtrl(req, res, next) {
  try {
    const options = req.body;
    const worker = addWorker(options);
    if (!worker) return next({ code: 400, message: 'Cannot init worker' });

    const result = new WorkerOutputDto(worker);
    await result.getLogs();
    return res.send(result);
  } catch (err) {
    return next({ message: `POST /init: ${err.message}` });
  }
}

async function startWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    let result = await worker.start();
    if (result instanceof Error) return next({ code: 400, message: result.message });

    result = new WorkerOutputDto(worker);
    await result.getLogs();
    return res.send(result);
  } catch (err) {
    return next({ message: `POST /start/${req.params.id}: ${err.message}` });
  }
}

async function terminateWorkerByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const worker = getWorkerById(id);
    if (!worker) return next({ code: 404, message: 'Worker not found' });

    let result = await worker.terminate();
    if (result instanceof Error) return next({ code: 400, message: result.message });

    result = new WorkerOutputDto(worker);
    await result.getLogs();
    return res.send(result);
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

    const result = new WorkerOutputDto(worker);
    await result.getLogs();
    return res.send(result);
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
