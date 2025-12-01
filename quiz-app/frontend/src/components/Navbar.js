import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🧠 QuizMaster
      </Link>
      <div className="navbar-links">
        <Link to="/quizzes">Quizzes</Link>
        {isAuthenticated ? (
          <>
            <Link to="/create-quiz">Create Quiz</Link>
            <Link to="/my-results">My Results</Link>
            <span style={{ color: 'white' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
