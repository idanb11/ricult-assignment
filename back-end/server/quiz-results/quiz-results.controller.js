const url = require('url');

const logger = require('../../config/winston');
const SubmitQuiz = require('./quiz-results.model');
const Matcher = require('../services/match-calculator/matcher');

async function saveQuizAnswers(req, res, next) {
  try {
    const quizId = req.body.quizId;
    const answers = req.body.answers;
    const email = req.body.email;
    const quizModel = req.body.quizModel;

    const urlObject = url.parse(req.originalUrl);
    urlObject.protocol = req.protocol;
    urlObject.host = req.get('host');
    const requestUrl = url.format(urlObject);

    logger.info('Getting quiz match for user', { email, quizId, answers, quizModel });

    const matcher = new Matcher(quizId, answers);
    const match = await matcher.calculate();
    const savedData = await SubmitQuiz.saveQuizAnswers({ quizId, email, answers, match, quizModel, requestUrl });
    res.json({ match: match, id: savedData._id });
  } catch (err) {
    logger.error('Error on quiz data POST', { quizId: req.params.quizId, error: err });
    next(err);
  }
}

module.exports = {
  saveQuizAnswers
};
