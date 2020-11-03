const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap
const quizRoutes = require('./server/quiz/quiz.route');
const quizSubmissionRoutes = require('./server/quiz-results/quiz-results.route');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount quiz routes at /quiz
router.use('/quiz', quizRoutes);

// mount quiz submission routes at /quiz/submit
router.use('/quiz/submit', quizSubmissionRoutes);

module.exports = router;
