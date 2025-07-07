import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./question.css";

function TechnopediaQuestion() {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

  const { id, letter } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    title: "",
    content: "",
    points: 0
  });
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visitStartTime, setVisitStartTime] = useState(null);
  const [timeSpentArray, setTimeSpentArray] = useState([]);
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0);

  const saveTimeSpent = () => {
    if (visitStartTime) {
      const currentTime = new Date();
      const timeSpentMs = currentTime - visitStartTime;
      if (timeSpentMs > 1000) {
        const questionKey = `technopedia_timeSpent_question_${id}`;
        const existingTimes = JSON.parse(localStorage.getItem(questionKey) || '[]');
        const updatedTimes = [...existingTimes, timeSpentMs];
        localStorage.setItem(questionKey, JSON.stringify(updatedTimes));
        const previousTotal = parseInt(localStorage.getItem(`technopedia_totalTimeSpent_question_${id}`) || '0');
        const newTotal = previousTotal + timeSpentMs;
        localStorage.setItem(`technopedia_totalTimeSpent_question_${id}`, newTotal.toString());
      }
    }
  };

  const calculateTimeSpent = () => {
    if (!visitStartTime) return 0;
    const currentTime = new Date();
    const timeSpentMs = currentTime - visitStartTime;
    const previousTimeSpent = parseInt(localStorage.getItem(`technopedia_totalTimeSpent_question_${id}`) || '0');
    return Math.floor((timeSpentMs + previousTimeSpent) / 1000);
  };

  const getMoodEmoji = (timeSpent) => {
    const minutes = Math.floor(timeSpent / 60);
    if (minutes <= 6) {
      return { emoji: "😀🔥", phase: "Fire in Eye" };
    } else if (minutes <= 10) {
      return { emoji: "🤔", phase: "Thinking Hard" };
    } else if (minutes <= 15) {
      return { emoji: "🥴", phase: "Stressed & Struggling" };
    } else if (minutes <= 20) {
      return { emoji: "🤯", phase: "Mind Blown" };
    }
    return { emoji: "💪", phase: "Comeback Mode" };
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/technopedia/questions/${id}`);
        setQuestion(response.data);
      } catch (error) {
        setError("Failed to load question. Please try again or contact support.");
        if (error.response?.status === 404) {
          setTimeout(() => {
            navigate('/technopedia');
          }, 3000);
        }
      }
    };
    fetchQuestion();
    const endTime = localStorage.getItem('technopediaEndTime');
    if (!endTime) {
      navigate('/technopedia');
      return;
    }
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const remaining = Math.max(Math.floor((end - now) / 1000), 0);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        navigate('/technopedia');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [id, navigate]);

  useEffect(() => {
    setVisitStartTime(new Date());
    return () => {
      saveTimeSpent();
    };
  }, [id]);

  useEffect(() => {
    const savedTimes = localStorage.getItem(`technopedia_timeSpent_question_${id}`);
    if (savedTimes) {
      setTimeSpentArray(JSON.parse(savedTimes));
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTimeSpent();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [visitStartTime, id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeSpent(calculateTimeSpent());
    }, 1000);
    return () => clearInterval(timer);
  }, [visitStartTime]);

  const handleBack = () => {
    saveTimeSpent();
    navigate('/technopedia');
  };

  const handleSubmit = async () => {
    try {
      const technopediaRoll = localStorage.getItem('technopediaRoll');
      if (!technopediaRoll) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate('/technopedia/login'), 2000);
        return;
      }
      saveTimeSpent();
      const questionKey = `technopedia_timeSpent_question_${id}`;
      const timeSpentArray = JSON.parse(localStorage.getItem(questionKey) || '[]');
      const totalTimeSpent = timeSpentArray.reduce((sum, time) => sum + time, 0);
      const response = await axios.post(`${baseURL}/api/technopedia/submit`, {
        questionId: parseInt(id),
        answer,
        rollNumber: technopediaRoll,
        timeSpentArray,
        totalTimeSpent
      });
      if (response.data.success) {
        setIsSubmitted(true);
        const answeredQuestions = JSON.parse(localStorage.getItem('technopedia_answeredQuestions') || '[]');
        if (!answeredQuestions.includes(id)) {
          answeredQuestions.push(id);
          localStorage.setItem('technopedia_answeredQuestions', JSON.stringify(answeredQuestions));
        }
        setTimeout(() => navigate('/technopedia'), 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit answer");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="technopedia-question-container">
      <div className="technopedia-question-header">
        <button className="technopedia-back-button" onClick={handleBack}>
          <span>←</span> Back
        </button>
        <div className="technopedia-mood-container">
          <span className="technopedia-mood-emoji">
            {getMoodEmoji(currentTimeSpent).emoji}
          </span>
          <span className="technopedia-phase-text">
            {getMoodEmoji(currentTimeSpent).phase}
          </span>
        </div>
        <div className="technopedia-timer">
          {formatTime(timeLeft)}
        </div>
      </div>
      <div className="technopedia-question-content">
        <h2 className="technopedia-question-title">
          Question {letter} - {question.title}
        </h2>
        <div className="technopedia-points">Points Available: {question.points}</div>
        <div style={{whiteSpace: "pre-line"}} className="technopedia-question-text">
          {question.content && question.content.replace(/\n/g, "\n")}
        </div>
        <div className="technopedia-answer-section">
          <label htmlFor="answer">Enter your answer (Integer only)</label>
          <input
            type="number"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isSubmitted}
          />
          <button 
            className={`technopedia-submit-button ${isSubmitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={!answer || isSubmitted}
          >
            {isSubmitted ? '✓ Answer Submitted' : 'Submit Answer'}
          </button>
        </div>
        {error && <div className="technopedia-error-message">{error}</div>}
      </div>
    </div>
  );
}

export default TechnopediaQuestion; 