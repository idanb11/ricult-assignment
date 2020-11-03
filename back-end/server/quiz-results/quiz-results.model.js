const mongoose = require('mongoose');
const logger = require('../../config/winston');
const Quiz = require('../quiz/quiz.model');
const sqsService = require('../services/aws-sqs-producer');

/**
 * SubmitQuiz Schema
 */
const SubmitQuizSchema = new mongoose.Schema({
  quizId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: Quiz },
  email: { required: true, type: String },
  answers: { required: true, type: mongoose.Schema.Types.Mixed },
  match: { required: false, type: String },
  quizModel: { required: false, type: String }
}, { timestamps: true });

/**
 * Statics
 */
SubmitQuizSchema.statics = {

  /**
   * save Quiz Results data to db.
   * @body {object} data - The quiz answers and data to save.
   * @return {Promise<string>} url - return a url to the product the user will be directed to.
   */
  async saveQuizAnswers(data) {

    try {
      logger.info('saving user quiz results to db ...', {
        quizId: data.quizId,
        email: data.email,
        answers: data.answers,
        match: data.match,
        quizModel: data.quizModel,
        requestUrl: data.requestUrl
      });

      const quizResults = await this.create(data);

      logger.info('saving user quiz results to db done', {
        quizId: data.quizId,
        email: data.email,
        answers: data.answers,
        match: data.match,
        quizModel: data.quizModel,
        requestUrl: data.requestUrl
      });

      const sqsResults = await sqsService.sendMessage({
        'user-quiz-results-id': quizResults._id,
        'request-url': data.requestUrl
      });
      logger.info('Sending sqs message was successful', { sqsResults, match: data.match });

      return quizResults;
    } catch (e) {
      logger.error('Error saving quiz results to db', {
        error: e,
        quizId: data.quizId,
        email: data.email,
        answers: data.answers,
        match: data.match,
        quizModel: data.quizModel,
        requestUrl: data.requestUrl
      });
    }
  }
};


/**
 * @typedef SubmitQuiz
 */
module.exports = mongoose.model('SubmitQuiz', SubmitQuizSchema, 'user-quiz-results');
