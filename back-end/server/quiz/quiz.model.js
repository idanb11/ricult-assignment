const mongoose = require('mongoose');
const ENUMS = require('../helpers/enums');
const Question = require('../question/question.model');

const select = '-status -order -updatedAt -typeId';
const populate = {
  path: 'questions',
  select: 'answers viewType multiselect value displayId steps',
  match: { status: { $eq: ENUMS.status[0] } },
  options: { sort: { order: 1 } },
  populate: {
    path: 'answers',
    select: 'viewType value dialog viewLevel questions displayId nextQuestionId',
    match: { status: { $eq: ENUMS.status[0] } },
    options: { sort: { order: 1 } },
    populate: {
      path: 'source',
      select: 'titles data'
    }
  }
};

/**
 * Quiz Schema
 */
const QuizSchema = new mongoose.Schema({
  name: String,
  quizDisplayId: String,
  type: String,
  version: Number,
  status: { type: String, enum: ENUMS.status },
  order: Number,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: Question }],
  themeColor: String
}, { timestamps: true });

/**
 * Statics
 */
QuizSchema.statics = {

  /**
   * Get Quiz data by quiz ID.
   * @param {string} quizId - The quiz Id to get.
   * @return {Promise<Quiz>} - The Quiz.
   */

  getQuizById(quizId) {
    return this.findById(quizId)
      .select(select)
      .populate(populate)
      .exec();
  },

  /**
   * Get Quiz data by type and version
   * @param {string} type - quiz type.
   * @param {number} version - quiz version number.
   * @return {Promise<Quiz>} - The Quiz.
   */

  getQuizByTypeAndVersion(type, version) {
    return this.findOne({ type: type, version: version, status: { $eq: ENUMS.status[0] } })
      .select(select)
      .populate(populate)
      .exec();
  }

};


/**
 * @typedef Quiz
 */
module.exports = mongoose.model('Quiz', QuizSchema, 'quiz');
