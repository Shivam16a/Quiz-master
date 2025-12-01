import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const categories = ['General Knowledge', 'Science', 'History', 'Technology', 'Sports', 'Entertainment', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuizzes();
  }, [category, difficulty]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      let url = '/quizzes';
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setQuizzes(response.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Available Quizzes</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        >
          <option value="">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-card-header">
                <h3>{quiz.title}</h3>
              </div>
              <div className="quiz-card-body">
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span className="badge badge-category">{quiz.category}</span>
                  <span className={`badge badge-difficulty ${quiz.difficulty.toLowerCase()}`}>
                    {quiz.difficulty}
                  </span>
                  <span className="badge" style={{ background: '#f5f5f5' }}>
                    {quiz.questions?.length || 0} Questions
                  </span>
                  <span className="badge" style={{ background: '#f5f5f5' }}>
                    ⏱️ {quiz.timeLimit} min
                  </span>
                </div>
                <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary" style={{ marginTop: '15px' }}>
                  View Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
