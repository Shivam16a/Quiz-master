import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && startTime) {
      handleSubmit();
    }
  }, [timeLeft, quiz, startTime]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data);
      setTimeLeft(response.data.timeLimit * 60);
      setStartTime(Date.now());
      setAnswers(response.data.questions.map(q => ({
        questionId: q._id,
        selectedAnswer: -1
      })));
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion].selectedAnswer = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await api.post('/results/submit', {
        quizId: id,
        answers,
        timeTaken
      });
      navigate(`/results/${response.data.result._id}`);
    } catch (err) {
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft < 60) return 'timer danger';
    if (timeLeft < 180) return 'timer warning';
    return 'timer';
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quiz) return <div className="error">Quiz not found</div>;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className={getTimerClass()}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="question-card">
        <div className="question-number">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
        <div className="question-text">{question.questionText}</div>
        
        <div className="options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option ${answers[currentQuestion].selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: answers[currentQuestion].selectedAnswer === index ? 'white' : '#e0e0e0',
                color: answers[currentQuestion].selectedAnswer === index ? '#667eea' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </div>
          ))}
        </div>

        <div className="quiz-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginTop: '20px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: currentQuestion === index ? '2px solid #667eea' : '1px solid #ddd',
              background: answers[index].selectedAnswer !== -1 ? '#667eea' : 'white',
              color: answers[index].selectedAnswer !== -1 ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: currentQuestion === index ? 'bold' : 'normal'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TakeQuiz;
