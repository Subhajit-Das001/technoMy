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
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [visitStartTime, setVisitStartTime] = useState(null);
  const [timeSpentArray, setTimeSpentArray] = useState([]);
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveTimeSpent = () => {
    if (visitStartTime) {
      const currentTime = new Date();
      const timeSpentMs = currentTime - visitStartTime;
      
      // Only process if more than 1 second spent
      if (timeSpentMs > 1000) {
        // Save individual time entries
        const questionKey = `technopedia_timeSpent_question_${id}`;
        const existingTimes = JSON.parse(localStorage.getItem(questionKey) || '[]');
        const updatedTimes = [...existingTimes, timeSpentMs];
        localStorage.setItem(questionKey, JSON.stringify(updatedTimes));
        
        // Update total time as a single number
        const previousTotal = parseInt(localStorage.getItem(`technopedia_totalTimeSpent_question_${id}`) || '0');
        const newTotal = previousTotal + timeSpentMs;
        localStorage.setItem(`technopedia_totalTimeSpent_question_${id}`, newTotal.toString());
        
        console.log(`Technopedia Question ${id} visit recorded:`, {
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
    const previousTimeSpent = parseInt(localStorage.getItem(`technopedia_totalTimeSpent_question_${id}`) || '0');
    
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
        // Use the correct Technopedia endpoint
        const response = await axios.get(`${baseURL}/api/technopedia/techno/questions/${id}`);
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question. Please try again or contact support.");
        // Redirect back to technopedia page after 3 seconds if question not found
        if (error.response?.status === 404) {
          setTimeout(() => {
            navigate('/technopedia');
          }, 3000);
        }
      }
    };

    fetchQuestion();
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
    saveTimeSpent(); // Save time before navigating
    navigate('/technopedia');
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const userPhone = localStorage.getItem('userPhone');
      console.log('Frontend - userPhone from localStorage:', userPhone);
      
      if (!userPhone) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate('/technopedia-login'), 2000);
        return;
      }

      // Save final time spent before submission
      saveTimeSpent();

      const questionKey = `technopedia_timeSpent_question_${id}`;
      const timeSpentArray = JSON.parse(localStorage.getItem(questionKey) || '[]');
      const totalTimeSpent = timeSpentArray.reduce((sum, time) => sum + time, 0);

      const requestData = {
        questionId: parseInt(id),
        answer,
        phone: userPhone,
        timeSpentArray,
        totalTimeSpent
      };
      
      console.log('Frontend - sending request data:', requestData);

      const response = await axios.post(`${baseURL}/api/technopedia/submit`, requestData);

      if (response.data.success) {
        // Show success message briefly
        setIsSubmitted(true);
        
        // Update answered questions in localStorage
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
        if (!answeredQuestions.includes(id)) {
          answeredQuestions.push(id);
          localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        }
        
        // Dispatch custom event to notify technopedia page
        window.dispatchEvent(new CustomEvent('answerSubmitted', {
          detail: { questionId: parseInt(id) }
        }));
        
        // Reset form after 2 seconds to allow for another submission
        setTimeout(() => {
          setIsSubmitted(false);
          setAnswer("");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="technopedia-question-container">
      <div className="technopedia-question-header">
        <button className="technopedia-back-button" onClick={handleBack}>
          <span>←</span> Back
        </button>
      </div>

      <div className="technopedia-question-content">
        <h2 className="technopedia-question-title">
          Question {letter} - {question.title}
        </h2>
        <div className="technopedia-points">Points Available: {question.points}</div>
        
        <div style={{whiteSpace: "pre-line"}} className="technopedia-question-text">
          {question.content.replace(/\\n/g, "\n")}
        </div>

        <div className="technopedia-answer-section">
          <label htmlFor="answer">Enter your answer (Integer only)</label>
          <input
            type="number"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isSubmitting}
          />
          <button 
            className={`technopedia-submit-button ${isSubmitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={!answer || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isSubmitted ? '✓ Submitted Successfully!' : 'Submit Answer'}
          </button>
        </div>

        {error && <div className="technopedia-error-message">{error}</div>}
      </div>
    </div>
  );
}

export default TechnopediaQuestion; 