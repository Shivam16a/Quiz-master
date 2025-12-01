import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import TakeQuiz from './pages/TakeQuiz';
import CreateQuiz from './pages/CreateQuiz';
import MyResults from './pages/MyResults';
import ResultDetail from './pages/ResultDetail';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quizzes" element={<QuizList />} />
              <Route path="/quizzes/:id" element={<QuizDetail />} />
              <Route path="/quiz/:id/take" element={
                <PrivateRoute><TakeQuiz /></PrivateRoute>
              } />
              <Route path="/create-quiz" element={
                <PrivateRoute><CreateQuiz /></PrivateRoute>
              } />
              <Route path="/my-results" element={
                <PrivateRoute><MyResults /></PrivateRoute>
              } />
              <Route path="/results/:id" element={
                <PrivateRoute><ResultDetail /></PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
