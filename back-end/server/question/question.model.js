const mongoose = require('mongoose');
const logger = require('../../config/winston');
const ENUMS = require('../helpers/enums');
const Answer = require('../answer/answer.model');

/**
 * Question Schema
 */
const QuestionSchema = new mongoose.Schema({
  displayId: String,
  status: { type: String, enum: ENUMS.status },
  order: Number,
  value: mongoose.Schema.Types.Mixed,
  viewType: { type: String, enum: ENUMS.questionsViewType },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: Answer }],
  previousQuestionId: String,
  multiselect: { type: Boolean, required: false },
  steps: { type: mongoose.Schema.Types.Mixed, required: false }
}, { timestamps: true });

/**
 * Statics
 */
QuestionSchema.statics = {

  /**
   * Create a new look if it doesn't exist or update if exist.
   * @param {QuestionSchema} data - The object with the Look data.
   * @returns {Promise<Question>} - The new Look that was created or updated.
   */


};


/**
 * @typedef Question
 */
module.exports = mongoose.model('Question', QuestionSchema);
