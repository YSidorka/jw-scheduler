const { Schema } = require('mongoose');
const { TYPE_LOG } = require('@jw/const');

const schema = new Schema(
  {
    _id: { type: String },
    type: { type: String, required: true, default: TYPE_LOG },
    date: { type: Number },
    map: { type: Schema.Types.Mixed, required: true, default: {} }
  },
  {
    collection: 'logs',
    minimize: false,
    strict: false,
    strictQuery: false
  }
);

module.exports = schema;
