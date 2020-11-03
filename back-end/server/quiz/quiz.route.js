const express = require('express');

const router = express.Router();
const quizCtrl = require('./quiz.controller');

/** GET /api/v1/quiz/{quizId} - return a single quiz data. */
router.route('/:quizId').get(quizCtrl.getQuizById);

/** GET /api/v1/quiz/ - return a single quiz data. */
router.route('/').get(quizCtrl.getQuiz);


module.exports = router;
