const Quiz = require('./quiz.model');
const logger = require('../../config/winston');

const getQuizById = (req, res, next) => {
  const quizId = req.params.quizId;

  Quiz.getQuizById(quizId)
    .then(quizData => res.json(quizData))
    .catch((err) => {
      logger.error('Error getting quiz by id', {
        quizId: quizId,
        error: err
      });
      next(err);
    });
};

const getQuiz = (req, res, next) => {
  const quizType = req.query.type;
  const quizVersion = req.query.v;

  Quiz.getQuizByTypeAndVersion(quizType, quizVersion)
    .then(quizData => res.json(quizData))
    .catch((err) => {
      logger.error('Error getting quiz by params', {
        quizType: quizType,
        quizVersion: quizVersion,
        error: err
      });
      next(err);
    });
};

module.exports = {
  getQuizById,
  getQuiz
};
