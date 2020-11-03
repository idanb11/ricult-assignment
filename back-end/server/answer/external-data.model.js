const mongoose = require('mongoose');

/**
 * ExternalData Schema
 */
const ExternalDataSchema = new mongoose.Schema({
  titles: [String],
  viewLevel: Number,
  data: { required: false, type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

/**
 * @typedef ExternalData
 */
module.exports = mongoose.model('ExternalData', ExternalDataSchema, 'external-data');
