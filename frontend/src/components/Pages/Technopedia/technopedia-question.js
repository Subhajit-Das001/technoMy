import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./question.css";
import { Button } from "@mui/material";

function TechnopediaQuestion() {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

  const { year, id, letter ,language} = useParams();
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
  const ui = {
      en: { back: "Back", points: "Points Available", enter: "Enter your answer (Integer only)", placeholder: "Type your answer here...", prev: "Prev", next: "Next", submit: "Submit Answer", submitting: "Submitting...", success: "✓ Submitted Successfully!", que:"Question" },
      hi: { back: "पीछे", points: "उपलब्ध अंक", enter: "अपना उत्तर दर्ज करें (केवल पूर्णांक)", placeholder: "अपना उत्तर यहाँ लिखें...", prev: "पिछला", next: "अगला", submit: "उत्तर सबमिट करें", submitting: "सबमिट हो रहा है...", success: "✓ सफलतापूर्वक सबमिट किया गया!",que:"प्रश्न " }
  };
const getQuestionNumber = (letter, language) => {
  if (language === 'en') return letter;

  const hindiNumbers = {
    A: '१',
    B: '२',
    C: '३',
    D: '४',
    E: '५',
    F: '६',
    G: '७',
    H: '८',
    I: '९',
    J: '१०'
  };

  return hindiNumbers[letter] || letter;
};

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

        // console.log(`Technopedia Question ${id} visit recorded:`, {
        //   timeSpentMs,
        //   totalTimeSpent: newTotal
        // });
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
        const response = await axios.get(`${baseURL}/api/technopedia/questions/${year}/${language}/${id}`);
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question. Please try again or contact support.");
        // Redirect back to technopedia page after 3 seconds if question not found
        if (error.response?.status === 404) {
          setTimeout(() => {
            navigate(`/technopedia/${year}/${language}`);
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
    navigate(`/technopedia/${year}/${language}`);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const userPhone = localStorage.getItem('userPhone');

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
        totalTimeSpent,
        year: year, // ADDED: Passing the year to the backend
        language: language
      };

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
          handleNextQuestion();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNextQuestion=()=>{
    if(parseInt(id)===10){
      navigate(`/technopedia/${year}/${language}`);
      return;
    }
    let newLetter=String.fromCharCode(letter.charCodeAt(0)+1);
    saveTimeSpent(); // Save time before navigating
    navigate(`/technopedia/${year}/${language}/${parseInt(id) + 1}/${newLetter}`);
  }
  const handlePrevQuestion=()=>{
    if(parseInt(id)===1){
      return;
    }
    let newLetter=String.fromCharCode(letter.charCodeAt(0)-1);
    saveTimeSpent(); // Save time before navigating
    navigate(`/technopedia/${year}/${language}/${parseInt(id) - 1}/${newLetter}`);
  }
  const checkFirstIndex=()=>{
    if(parseInt(id)===1){
      return true;
    }
    return false;
  }
  const checkLastIndex=()=>{
    if(parseInt(id)>=10){
      return true;
    }
    return false;
  }
  

  return (
    <div className="technopedia-question-container">
      <div className="technopedia-question-header">
        <button className="technopedia-back-button" onClick={handleBack}>
          <span>←</span> {ui[language].back}
        </button>
      </div>

      <div className="technopedia-question-content">
        <h2 className="technopedia-question-title">
          {ui[language].que} {getQuestionNumber(letter, language)}  - {question.title}
        </h2>
        <div className="technopedia-points">{ui[language].points} : {question.points}</div>

        <div style={{ whiteSpace: "pre-line" }} className="technopedia-question-text">
          {question.content.replace(/\\n/g, "\n")}
        </div>

        <div className="technopedia-answer-section">
          <label htmlFor="answer">{ui[language].enter}</label>
          <input
            type="number"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={ui[language].placeholder}
            disabled={isSubmitting}
          />

          <div className="technopedia-next-prev">
            <button
            disabled={isSubmitting || checkFirstIndex() }
            onClick={()=>{handlePrevQuestion()}}
            className="technopedia-btn prev">
              <ion-icon name="arrow-back-outline"></ion-icon>
              <span>{ui[language].prev}</span>
            </button>
            <button 
            disabled={isSubmitting ||checkLastIndex() }
            onClick={()=>{handleNextQuestion()}}
            className="technopedia-btn next">
              <span>{ui[language].next}</span>
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </div>
          <button
            className={`${isSubmitted ? 'submitted' : ''}  technopedia-submit-button `}
            onClick={handleSubmit}
            disabled={!answer || isSubmitting}
          >
            {isSubmitting ? `${ui[language].submitting}` : isSubmitted ? `${ui[language].success}` : `${ui[language].submit}`}
          </button>
        </div>

        {error && <div className="technopedia-error-message">{error}</div>}
      </div>
    </div>
  );
}

export default TechnopediaQuestion; 
