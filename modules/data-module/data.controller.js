const {
  getDocumentList,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocumentById
} = require('./data.service');
const DataOutputDto = require('./data-output.dto');

async function getAllDocumentsCtrl(req, res, next) {
  try {
    const options = req.query; // TODO rebuild (potential vulnerability)
    let result = await getDocumentList(options);
    result = result.map((item) => new DataOutputDto(item));
    return res.send(result);
  } catch (err) {
    return next({ message: `GET /: ${err.message}` });
  }
}

async function getDocumentByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await getDocumentById(id);
    if (!doc) return next({ code: 404, message: 'Document not found' });

    return res.send(new DataOutputDto(doc));
  } catch (err) {
    return next({ message: `GET /${req.params.id}: ${err.message}` });
  }
}

async function createDocumentCtrl(req, res, next) {
  try {
    const { id } = req.body;
    const doc = await getDocumentById(id);
    if (doc) return next({ code: 400, message: 'Document already created' });

    const result = await createDocument(req.body);
    return res.send(new DataOutputDto(result));
  } catch (err) {
    return next({ message: `POST /${req.params.id}: ${err.message}` });
  }
}

async function updateDocumentByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await getDocumentById(id);
    if (!doc) return next({ code: 404, message: 'Document not found' });

    const options = req.body;
    const result = await updateDocument(doc, options);

    return res.send(new DataOutputDto(result));
  } catch (err) {
    return next({ message: `PATCH /${req.params.id}: ${err.message}` });
  }
}

async function deleteDocumentByIdCtrl(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteDocumentById(id);

    return res.send(result);
  } catch (err) {
    return next({ message: `DELETE /${req.params.id}: ${err.message}` });
  }
}

module.exports = {
  getAllDocumentsCtrl,
  getDocumentByIdCtrl,
  createDocumentCtrl,
  updateDocumentByIdCtrl,
  deleteDocumentByIdCtrl
};
