const mongoose = require('mongoose');
const { TYPE_LOG } = require('sky-constants');

const { Schema } = mongoose;
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

module.exports = mongoose.model('Log', schema);
