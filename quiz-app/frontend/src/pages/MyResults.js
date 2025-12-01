import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results/my-results');
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading results...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Quiz Results</h1>

      {results.length === 0 ? (
        <div className="card">
          <p>You haven't taken any quizzes yet.</p>
          <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: '15px' }}>
            Browse Quizzes
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {results.map((result) => (
            <div key={result._id} className="quiz-card">
              <div className="quiz-card-header" style={{
                background: result.percentage >= 70 
                  ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                  : result.percentage >= 40
                  ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
                  : 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
              }}>
                <h3>{result.quiz?.title || 'Quiz'}</h3>
                <div style={{ fontSize: '2rem', marginTop: '10px' }}>{result.percentage}%</div>
              </div>
              <div className="quiz-card-body">
                <div className="quiz-meta">
                  <span className="badge badge-category">{result.quiz?.category}</span>
                  <span className="badge">{result.score}/{result.totalPoints} points</span>
                </div>
                <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem' }}>
                  Completed: {formatDate(result.completedAt)}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Time: {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
                </p>
                <Link to={`/results/${result._id}`} className="btn btn-primary" style={{ marginTop: '15px' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResults;
