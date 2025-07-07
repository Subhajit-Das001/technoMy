import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import techno from "../../Assets/techno-owl.png";
import './technoped-question.css';
import './profile.css';
import './updates.css';
import './technoped.css';
import ResultPage from './technoped-result';
import ConfirmationModal from './ConfirmationModal';
import q6 from './Q6.png'
const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3001/";
const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/login" : "http://localhost:3000/login";

const TechnopedQuestion = ({ rollNumber }) => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0); // Index of current question
    const [time, setTime] = useState(5400); // Initial time in seconds
    const [answersState, setAnswersState] = useState([]); // State to hold answers
    const [submitted, setSubmitted] = useState([]); // State to track submitted status of answers
    const [showResult, setShowResult] = useState(false); // State to show result page
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [startTime, setStartTime] = useState(null); // State to track exam start time
    const timerRef = useRef(null); // Ref to store the timer ID

    // Save state to localStorage
    const saveStateToLocalStorage = () => {
        localStorage.setItem('current', JSON.stringify(current));
        localStorage.setItem('time', JSON.stringify(time));
        localStorage.setItem('answersState', JSON.stringify(answersState));
        localStorage.setItem('submitted', JSON.stringify(submitted));
        localStorage.setItem('startTime', JSON.stringify(startTime));
    };

    // Restore state from localStorage
    const restoreStateFromLocalStorage = () => {
        const savedCurrent = localStorage.getItem('current');
        const savedTime = localStorage.getItem('time');
        const savedAnswersState = localStorage.getItem('answersState');
        const savedSubmitted = localStorage.getItem('submitted');
        const savedStartTime = localStorage.getItem('startTime');

        if (savedCurrent !== null) setCurrent(JSON.parse(savedCurrent));
        if (savedTime !== null) setTime(JSON.parse(savedTime));
        if (savedAnswersState !== null) setAnswersState(JSON.parse(savedAnswersState));
        if (savedSubmitted !== null) setSubmitted(JSON.parse(savedSubmitted));
        if (savedStartTime !== null) setStartTime(JSON.parse(savedStartTime));
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${baseURL}api/questions`);
                const initialAnswers = response.data.map(() => ({ value: '', submitted: false }));
                setQuestions(response.data);
                setAnswersState(initialAnswers);
                setSubmitted(new Array(response.data.length).fill(false));
                setStartTime(Date.now());
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
        restoreStateFromLocalStorage();
    }, []);

    useEffect(() => {
        saveStateToLocalStorage();
    }, [current, time, answersState, submitted, startTime]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 1) {
                    alert('Time Up! Your answers have been auto submitted');
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const handleInputChange = (index, value) => {
        const trimmedValue = value.trim();
        const intValue = parseInt(trimmedValue, 10); // Parse integer with base 10

        if (!isNaN(intValue) && trimmedValue !== '') {
            const newAnswers = [...answersState];
            newAnswers[index] = { value: trimmedValue, submitted: false };
            setAnswersState(newAnswers);
        } else {
            const newAnswers = [...answersState];
            newAnswers[index] = { value: '', submitted: false };
            setAnswersState(newAnswers);
        }
    };

    const handleNextQuestion = () => {
        if (current < questions.length - 1) {
            setCurrent(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (current > 0) {
            setCurrent(prev => prev - 1);
        }
    };

    const handleFinalAns = index => {
        const newAnswers = [...answersState];
        newAnswers[index].submitted = true;
        setAnswersState(newAnswers);
        const newSubmitted = [...submitted];
        newSubmitted[index] = true;
        setSubmitted(newSubmitted);
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current); // Stop the timer when submitting

        const submittedAnswers = answersState.map((answer, index) => ({
            questionId: index + 1,
            answer: answer.value || ''
        }));

        const data = {
            rollNumber: rollNumber,
            answers: submittedAnswers
        };

        try {
            const response = await axios.post(`${baseURL}api/submit-answers`, data);
            console.log('Submission response:', response.data);
            setShowResult(true); // Showing the result page on successful submission
            localStorage.clear(); // Clear localStorage after submission
        } catch (error) {
            console.error('Error submitting answers:', error);
            console.error('Error details:', error.response?.data);
        }
    };

    const handleEndExam = () => {
        setShowModal(true);
    };

    const confirmEndExam = () => {
        setShowModal(false);
        handleSubmit();
    };

    const cancelEndExam = () => {
        setShowModal(false);
    };

    const handleQuestionClick = index => {
        setCurrent(index);
    };

    const handleClearAnswer = (index) => {
        const newAnswers = [...answersState];
        newAnswers[index] = { value: '', submitted: false };
        setAnswersState(newAnswers);
        const newSubmitted = [...submitted];
        newSubmitted[index] = false; // Mark the answer as not submitted
        setSubmitted(newSubmitted);
    };

    const renderQuestions = () => {
        return questions.map((question, index) => (
            <div
                key={question.id}
                className='question-tag'
                style={{
                    backgroundColor: current === index ? 'rgb(9, 159, 209)' : 'rgb(205, 205, 205)',
                    color: current === index ? 'white' : 'black'
                }}
                onClick={() => handleQuestionClick(index)}
            >
                Question {question.id}
            </div>
        ));
    };

    const currentQuestion = questions[current];

    if (questions.length === 0) {
        return <div>Loading...</div>; // Handling loading state
    }

    if (showResult) {
        // Calculating exam duration
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTime) / 1000;

        return (
            <ResultPage
                rollNumber={rollNumber}
                answers={answersState.map(answer => answer.value)}
                examDuration={durationInSeconds} // Pass duration to ResultPage
            />
        );
    }

    return (
        <div className='tped-question-main main'>
            <div className="roll">
                <p>{rollNumber}</p>
                <img src={techno} alt="" />
            </div>
            <div className='tped-question-outer-wrapper'>
                <div className='tped-question-heading'>
                    Time Remaining: <span style={{color:'red'}}>{Math.floor(time / 60)} mins i.e {Math.floor(time / 3600)} hrs and {Math.floor(time / 60) - Math.floor(time / 3600) * 60} min <br /></span>
                    Take your own time and solve the puzzle
                </div>
                <div className='tped-question-wrapper'>
                    <div className='question-header'>Question {currentQuestion.id}</div>
                    <div className='question-statement'>
                        {/* Render the question statement */}
                        {currentQuestion.question}
                        {/* Render the image after the question statement */}
                        {currentQuestion.id === 6 && (
                            <div className="circle-diagram">
                                <img src={q6} alt="Circle Diagram" />
                            </div>
                        )}
                    </div>
                    <div className='option-wrapper'>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                handleFinalAns(current);
                            }}
                        >
                            <div className='option-inner-wrapper'>
                                <input
                                    type='text'
                                    placeholder='Enter integers only'
                                    value={answersState[current].value}
                                    onChange={e => handleInputChange(current, e.target.value)}
                                    disabled={submitted[current]} // Disable input after submission
                                />
                            </div>
                            <div className='form-btn'>
                                <input className='submit-btn' type='submit' value="Submit this question" disabled={submitted[current] || answersState[current].value === ''} />
                                <button style={{ backgroundColor: 'rgb(237, 182, 0)', color: 'white' }}
                                    type='button'
                                    className='clear-btn'
                                    onClick={() => handleClearAnswer(current)}
                                    disabled={answersState[current].value === ''}
                                >
                                    Clear Answer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='question-list-wrapper'>
                {renderQuestions()}
                <div>
                    <button className='technoped-question-back-btn' onClick={handlePrevQuestion} disabled={current === 0}>Previous</button>
                    <button className='technoped-question-back-btn' onClick={handleNextQuestion} disabled={current === questions.length - 1}>Next</button>
                    <button className='end-btn' onClick={handleEndExam}>END</button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={showModal}
                onConfirm={confirmEndExam}
                onCancel={cancelEndExam}
            />
        </div>
    );
};

export default TechnopedQuestion;
