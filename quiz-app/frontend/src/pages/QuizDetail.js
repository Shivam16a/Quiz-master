import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const [quizRes, leaderboardRes] = await Promise.all([
        api.get(`/quizzes/${id}`),
        api.get(`/results/leaderboard/${id}`)
      ]);
      setQuiz(quizRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      setError('Failed to fetch quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/quiz/${id}/take`);
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quiz) return <div className="error">Quiz not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h1>{quiz.title}</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>{quiz.description}</p>
        
        <div className="quiz-meta" style={{ marginTop: '20px' }}>
          <span className="badge badge-category">{quiz.category}</span>
          <span className={`badge badge-difficulty ${quiz.difficulty.toLowerCase()}`}>
            {quiz.difficulty}
          </span>
          <span className="badge" style={{ background: '#f5f5f5' }}>
            📝 {quiz.questions?.length || 0} Questions
          </span>
          <span className="badge" style={{ background: '#f5f5f5' }}>
            ⏱️ {quiz.timeLimit} minutes
          </span>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button onClick={handleStartQuiz} className="btn btn-primary">
            {isAuthenticated ? 'Start Quiz' : 'Login to Start Quiz'}
          </button>
          <Link to="/quizzes" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Back to Quizzes
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>🏆 Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p style={{ marginTop: '15px', color: '#666' }}>No attempts yet. Be the first!</p>
        ) : (
          <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((result, index) => (
                <tr key={result._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td style={{ padding: '10px' }}>{result.user?.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{result.percentage}%</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
