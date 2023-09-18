const express = require('express');
const {
  getAllDocumentsCtrl,
  getDocumentByIdCtrl,
  createDocumentCtrl,
  updateDocumentByIdCtrl
} = require('./data.controller');

const router = express.Router();

router.get('/', getAllDocumentsCtrl);

router.get('/:id', getDocumentByIdCtrl);

router.post('/', createDocumentCtrl);

router.patch('/:id', updateDocumentByIdCtrl);

module.exports = router;
