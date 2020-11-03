const mongoose = require('mongoose');
const logger = require('../../config/winston');
const ENUMS = require('../helpers/enums');
const ExternalData = require('../../server/answer/external-data.model');
/**
 * Answer Schema
 */
const AnswerSchema = new mongoose.Schema(
  {
    displayId: String,
    status: { type: String, enum: ENUMS.status },
    viewType: { type: String, enum: ENUMS.answersViewType },
    order: Number,
    value: mongoose.Schema.Types.Mixed,
    weight: Number,
    dialog: {
      required: false,
      type: {
        order: Number,
        title: [String],
        subtitle: [String],
        footer: String,
        options: [String],
      },
    },
    viewLevel: Number,
    source: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: ExternalData,
    },
    questions: { required: false, type: mongoose.Schema.Types.Mixed },
    nextQuestionId: String,
  },
  { timestamps: true }
);

/**
 * Statics
 */
AnswerSchema.statics = {
  async getWeightedAnswersById(ids) {
    try {
      const idsStr = ids.join();

      logger.info('Get answers by id from db ...', { ids: idsStr });

      const objectIdsArr = ids.map((id) => mongoose.Types.ObjectId(id));

      const results = await this.find({
        status: ENUMS.status[0],
        weight: 1,
        _id: {
          $in: objectIdsArr,
        },
      })
        .select('displayId')
        .lean()
        .exec();

      logger.info('Get answers by id from db done', { ids: idsStr });

      return results;
    } catch (err) {
      logger.error('Error when getting weighted answers from db', {
        error: err,
        ids: ids.join(),
      });

      throw err;
    }
  },
};

/**
 * @typedef Answer
 */
module.exports = mongoose.model('Answer', AnswerSchema);
