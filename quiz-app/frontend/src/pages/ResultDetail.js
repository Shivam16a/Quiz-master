import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ResultDetail = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const response = await api.get(`/results/${id}`);
      setResult(response.data);
    } catch (err) {
      setError('Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading result...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!result) return <div className="error">Result not found</div>;

  const quiz = result.quiz;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="result-summary">
        <h2>{quiz.title}</h2>
        <div className="score-circle">
          {result.percentage}%
        </div>
        <h3 style={{ color: result.percentage >= 70 ? '#28a745' : result.percentage >= 40 ? '#ffc107' : '#dc3545' }}>
          {result.percentage >= 70 ? 'Excellent!' : result.percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}
        </h3>

        <div className="result-stats">
          <div className="stat">
            <div className="stat-value">{result.score}</div>
            <div className="stat-label">Points Earned</div>
          </div>
          <div className="stat">
            <div className="stat-value">{result.totalPoints}</div>
            <div className="stat-label">Total Points</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
            </div>
            <div className="stat-label">Time Taken</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Question Review</h3>
        {quiz.questions.map((question, index) => {
          const userAnswer = result.answers.find(a => a.questionId === question._id);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <div key={question._id} className="question-item" style={{
              borderLeftColor: isCorrect ? '#28a745' : '#dc3545'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>Q{index + 1}:</strong> {question.questionText}
              </div>
              <div className="options" style={{ gap: '8px' }}>
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`option ${
                      optIndex === question.correctAnswer ? 'correct' : 
                      optIndex === userAnswer?.selectedAnswer && !isCorrect ? 'incorrect' : ''
                    }`}
                    style={{ cursor: 'default' }}
                  >
                    <span>{String.fromCharCode(65 + optIndex)}.</span> {option}
                    {optIndex === question.correctAnswer && ' ✓'}
                    {optIndex === userAnswer?.selectedAnswer && optIndex !== question.correctAnswer && ' ✗'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/quizzes" className="btn btn-primary" style={{ marginRight: '15px' }}>
          Take Another Quiz
        </Link>
        <Link to="/my-results" className="btn btn-secondary">
          View All Results
        </Link>
      </div>
    </div>
  );
};

export default ResultDetail;
