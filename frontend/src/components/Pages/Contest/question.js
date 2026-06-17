import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Question.css";

function Question() {
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
  const [timeSpent, setTimeSpent] = useState(0);
  const [visitStartTime, setVisitStartTime] = useState(null);
  const [timeSpentArray, setTimeSpentArray] = useState([]);
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0);

  const saveTimeSpent = () => {
    if (visitStartTime) {
      const currentTime = new Date();
      const timeSpentMs = currentTime - visitStartTime;
      
      // Only process if more than 1 second spent
      if (timeSpentMs > 1000) {
        // Save individual time entries
        const questionKey = `timeSpent_question_${id}`;
        const existingTimes = JSON.parse(localStorage.getItem(questionKey) || '[]');
        const updatedTimes = [...existingTimes, timeSpentMs];
        localStorage.setItem(questionKey, JSON.stringify(updatedTimes));
        
        // Update total time as a single number
        const previousTotal = parseInt(localStorage.getItem(`totalTimeSpent_question_${id}`) || '0');
        const newTotal = previousTotal + timeSpentMs;
        localStorage.setItem(`totalTimeSpent_question_${id}`, newTotal.toString());
        
        console.log(`Question ${id} visit recorded:`, {
          timeSpentMs,
          totalTimeSpent: newTotal
        });
      }
    }
  };

  // Add this function to calculate total time spent
  const calculateTimeSpent = () => {
    if (!visitStartTime) return 0;
    const currentTime = new Date();
    const timeSpentMs = currentTime - visitStartTime;
    
    // Get the previous total time spent as a number, defaulting to 0
    const previousTimeSpent = parseInt(localStorage.getItem(`totalTimeSpent_question_${id}`) || '0');
    
    return Math.floor((timeSpentMs + previousTimeSpent) / 1000); // Convert to seconds
  };

  // Add this function to get the appropriate emoji
  const getMoodEmoji = (timeSpent) => {
    const minutes = Math.floor(timeSpent / 60);
    
    // Proper condition checks with ranges
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
        // Fixed endpoint URL
        const response = await axios.get(`${baseURL}/api/contest/questions/${id}`);
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question. Please try again or contact support.");
        if (error.response?.status === 404) {
          setTimeout(() => {
            navigate('/contest');
          }, 3000);
        }
      }
    };

    fetchQuestion();

    // Check for contest end time
    const endTime = localStorage.getItem('contestEndTime');
    if (!endTime) {
      navigate('/contest');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const remaining = Math.max(Math.floor((end - now) / 1000), 0);
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        navigate('/contest');
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
    const savedTimes = localStorage.getItem(`timeSpent_question_${id}`);
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
    saveTimeSpent(); // Save time before navigating
    navigate('/contest');
  };

  const handleSubmit = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate('/contest/login'), 2000);
        return;
      }

      // Save final time spent before submission
      saveTimeSpent();

      const questionKey = `timeSpent_question_${id}`;
      const timeSpentArray = JSON.parse(localStorage.getItem(questionKey) || '[]');
      const totalTimeSpent = timeSpentArray.reduce((sum, time) => sum + time, 0);

      const response = await axios.post(`${baseURL}/api/contest/submit`, {
        questionId: parseInt(id),
        answer,
        phone: userPhone,
        timeSpentArray,
        totalTimeSpent
      });

      if (response.data.success) {
        setIsSubmitted(true);
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
        if (!answeredQuestions.includes(id)) {
          answeredQuestions.push(id);
          localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        }
        setTimeout(() => navigate('/contest'), 1000);
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
    <div className="question-container-question">
      <div className="question-header-question">
        <button className="back-button-question" onClick={handleBack}>
          <span>←</span> Back
        </button>
        <div className="mood-container">
          <span className="mood-emoji">
            {getMoodEmoji(currentTimeSpent).emoji}
          </span>
          <span className="phase-text">
            {getMoodEmoji(currentTimeSpent).phase}
          </span>
          {/* <span className="time-spent">
            Time: {Math.floor(currentTimeSpent / 60)}m {currentTimeSpent % 60}s
          </span> */}
        </div>
        <div className="timer-question">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="question-content-question">
        <h2 className="question-title-question">
          Question {letter} - {question.title}
        </h2>
        <div className="points-question">Points Available: {question.points}</div>
        
        <div style={{whiteSpace: "pre-line"}} className="question-text-question">
          {question.content.replace(/\\n/g, "\n")}
        </div>

        <div className="answer-section-question">
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
            className={`submit-button-question ${isSubmitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={!answer || isSubmitted}
          >
            {isSubmitted ? '✓ Answer Submitted' : 'Submit Answer'}
          </button>
        </div>

        {error && <div className="error-message-question">{error}</div>}
      </div>
    </div>
  );
}

export default Question;
