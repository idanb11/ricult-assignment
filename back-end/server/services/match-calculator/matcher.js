const Hash = require('object-hash');

const logger = require('../../../config/winston');
const AnswerModel = require('../../answer/answer.model');
const QuizMatchModel = require('./quiz-match.model');


class Matcher {

  constructor(quizId, results) {
    this.quizId = quizId;
    this.results = results;
  }

  async calculate() {
    try {
      logger.info('calculating match ...', { quizId: this.quizId, results: this.results });

      const answers = await this._getWeightedAnswersById();
      const hashedKey = await this._hashResultSet(answers);
      const matchValue = await this._getMatchByHashedKey(hashedKey);

      logger.info('calculating match success', {
        quizId: this.quizId,
        answers: answers,
        key: hashedKey,
        value: matchValue
      });
      return matchValue;
    } catch (err) {
      logger.error('error when calculating match', { error: err });
      throw err;
    }
  }

  async _getWeightedAnswersById() {
    try {
      const idsArray = this.results.map(x => Object.values(x)[0]);
      return await AnswerModel.getWeightedAnswersById(idsArray);
    } catch (err) {
      logger.error('error when getting weighted answers', { results: this.results, error: err });
      throw err;
    }
  }

  async _hashResultSet(results) {
    try {
      const orderedSet = results.map(x => x.displayId).sort();
      // default hash algorithm SHA1
      const hashedKey = Hash({ quizId: this.quizId, orderedSet });
      logger.info('calculated hash for quiz result', { hashedKey: hashedKey });
      return hashedKey;
    } catch (err) {
      logger.error('error when hashing result set', { results: results, error: err });
      throw err;
    }
  }

  async _getMatchByHashedKey(key) {
    try {
      const value = QuizMatchModel.getMatchByHashedKey(key, this.quizId);
      logger.info('get matched value success', { key: key, value: value });
      return value;
    } catch (err) {
      logger.error('error getting match by hashed value', { key: key, error: err });
      throw err;
    }
  }
}


module.exports = Matcher;
