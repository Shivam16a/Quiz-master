const express = require('express');
const router = express.Router();
const {
  submitQuiz,
  getMyResults,
  getResult,
  getLeaderboard
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitQuiz);
router.get('/my-results', protect, getMyResults);
router.get('/leaderboard/:quizId', getLeaderboard);
router.get('/:id', protect, getResult);

module.exports = router;
