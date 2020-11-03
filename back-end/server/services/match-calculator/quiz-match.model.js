const mongoose = require('mongoose');
const logger = require('../../../config/winston');

const redis = require('../../../cache/redis');

/**
 * Quiz Match Schema
 */
const QuizMatchSchema = new mongoose.Schema(
  {
    key: { type: String },
    value: { type: String },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
  },
  {
    timestamps: true,
  }
);

/**
 * Statics
 */
QuizMatchSchema.statics = {
  async getMatchByHashedKey(key, quizId) {
    try {
      const reply = await redis.client.get(key);
      if (reply) {
        const document = JSON.parse(reply);
        logger.info('Got cached value for match success', {
          key: key,
          value: document.value,
          quizId: quizId,
        });
        return document.value;
      }
      let document = await this.findOne({ key: key })
        .select('value -_id ')
        .exec();

      if (!document) {
        logger.error('Cannot find quiz match value by key', { key: key });
        return null;
      }

      const value = document.toObject().value;

      // set data in cache
      await redis.client.set(
        key,
        JSON.stringify({ quizId: quizId, value: value })
      );

      return value;
    } catch (err) {
      logger.error('error getting match value by key', {
        key: key,
        error: err,
      });
      throw err;
    }
  },
};

/**
 * @typedef QuizMatch
 */
module.exports = mongoose.model('QuizMatch', QuizMatchSchema, 'quiz-match');
