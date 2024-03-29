const { Schema } = require('mongoose');
const { TYPE_WORKER } = require('@jw/const');

const schema = new Schema(
  {
    _id: { type: String },
    type: { type: String, required: true, default: TYPE_WORKER },
    active: { type: Boolean, required: true, default: false },
    data: { type: Schema.Types.Mixed, required: true }
  },
  {
    collection: 'workers',
    minimize: false,
    strict: true,
    strictQuery: true
  }
);

module.exports = schema;
