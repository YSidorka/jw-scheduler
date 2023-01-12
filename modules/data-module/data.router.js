const express = require('express');
const {
  getAllDocumentsCtrl,
  getDocumentByIdCtrl,
  createDocumentCtrl,
  updateDocumentByIdCtrl,
  deleteDocumentByIdCtrl
} = require('./data.controller');

const router = express.Router();

router.get('/', getAllDocumentsCtrl);

router.get('/:id', getDocumentByIdCtrl);

router.post('/', createDocumentCtrl);

router.patch('/:id', updateDocumentByIdCtrl);

router.delete('/:id', deleteDocumentByIdCtrl);

module.exports = router;
