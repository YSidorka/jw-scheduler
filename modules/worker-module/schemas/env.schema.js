const { Schema } = require('mongoose');
const { TYPE_ENVIRONMENT } = require('@jw/const');

// const { fieldEncryption } = require('mongoose-field-encryption');
// const { getStore } = require('../../configs/env.config');

const schema = new Schema(
  {
    _id: { type: String },
    type: { type: String, required: true, default: TYPE_ENVIRONMENT },
    data: { type: Schema.Types.Mixed, required: true }
  },
  {
    collection: 'documents',
    minimize: false,
    strict: true,
    strictQuery: true
  }
);

// if (getStore().options?.secret) {
//   schema.plugin(fieldEncryption, {
//     fields: ['data'],
//     secret: getStore().options?.secret
//   });
// }

module.exports = schema;
