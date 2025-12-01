import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <h1>Welcome to QuizMaster</h1>
      <p>Test your knowledge with our interactive quizzes!</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/quizzes" className="btn btn-primary" style={{ marginRight: '15px' }}>
          Browse Quizzes
        </Link>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-secondary">
            Get Started
          </Link>
        )}
      </div>

      <div className="features">
        <div className="feature">
          <div className="feature-icon">📚</div>
          <h3>Multiple Categories</h3>
          <p>Choose from various quiz categories</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⏱️</div>
          <h3>Timed Quizzes</h3>
          <p>Challenge yourself with time limits</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🏆</div>
          <h3>Track Progress</h3>
          <p>View your scores and improve</p>
        </div>
        <div className="feature">
          <div className="feature-icon">✍️</div>
          <h3>Create Quizzes</h3>
          <p>Make and share your own quizzes</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
