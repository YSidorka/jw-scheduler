const express = require('express');

const {
  terminateWorkerByIdCtrl,
  startWorkerByIdCtrl,
  getWorkerByIdCtrl,
  getAllWorkersCtrl
} = require('./worker.controller');

const router = express.Router();

router.get('/', getAllWorkersCtrl);

router.get('/:id', getWorkerByIdCtrl);

router.post('/start/:id', startWorkerByIdCtrl);

router.post('/terminate/:id', terminateWorkerByIdCtrl);

module.exports = router;
