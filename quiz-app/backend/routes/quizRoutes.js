const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  getQuizWithAnswers,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

router.get('/my-quizzes', protect, getMyQuizzes);

router.route('/:id')
  .get(getQuiz)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

router.get('/:id/answers', protect, getQuizWithAnswers);

module.exports = router;
