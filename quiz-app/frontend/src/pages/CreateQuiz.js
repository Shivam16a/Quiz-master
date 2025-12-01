import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'General Knowledge',
    difficulty: 'Medium',
    timeLimit: 10
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10
  });

  const categories = ['General Knowledge', 'Science', 'History', 'Technology', 'Sports', 'Entertainment', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      return alert('Please enter a question');
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      return alert('Please fill all options');
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10
    });
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      return setError('Please add at least one question');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/quizzes', {
        ...quizData,
        questions
      });
      navigate('/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <h1>Create New Quiz</h1>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>Quiz Details</h3>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleQuizChange}
              rows="3"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={quizData.category} onChange={handleQuizChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={quizData.difficulty} onChange={handleQuizChange}>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizChange}
                min="1"
                max="120"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Add Question</h3>
          
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              name="questionText"
              value={currentQuestion.questionText}
              onChange={handleQuestionChange}
              placeholder="Enter your question"
            />
          </div>

          <div className="form-group">
            <label>Options (Select correct answer)</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                  style={{ width: 'auto' }}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Points</label>
            <input
              type="number"
              name="points"
              value={currentQuestion.points}
              onChange={handleQuestionChange}
              min="1"
              max="100"
              style={{ width: '100px' }}
            />
          </div>

          <button type="button" onClick={addQuestion} className="btn btn-secondary">
            + Add Question
          </button>
        </div>

        {questions.length > 0 && (
          <div className="card">
            <h3>Questions ({questions.length})</h3>
            <div className="question-list">
              {questions.map((q, index) => (
                <div key={index} className="question-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <strong>Q{index + 1}:</strong> {q.questionText}
                      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                        {q.options.map((opt, i) => (
                          <div key={i} style={{ color: i === q.correctAnswer ? 'green' : 'inherit' }}>
                            {String.fromCharCode(65 + i)}. {opt} {i === q.correctAnswer && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', marginLeft: '10px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
