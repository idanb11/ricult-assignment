const express = require('express');

const router = express.Router();
const submissionCtrl = require('./quiz-results.controller');

/** POST /api/v1/quiz/submit/ - post quiz form data. */
router.route('/').post(submissionCtrl.saveQuizAnswers);


module.exports = router;
