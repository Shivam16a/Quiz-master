const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.points;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : -1,
        isCorrect
      });
    });

    const percentage = Math.round((score / totalPoints) * 100);

    const result = await Result.create({
      user: req.user._id,
      quiz: quizId,
      score,
      totalPoints,
      percentage,
      answers: processedAnswers,
      timeTaken
    });

    await result.populate('quiz', 'title');

    res.status(201).json({
      result,
      correctAnswers: quiz.questions.map(q => ({
        questionId: q._id,
        correctAnswer: q.correctAnswer
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort('-completedAt');

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz')
      .populate('user', 'name');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('user', 'name')
      .sort('-percentage -timeTaken')
      .limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
