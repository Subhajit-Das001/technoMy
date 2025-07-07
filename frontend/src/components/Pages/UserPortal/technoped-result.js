//                                                                                                                                                                                                              import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import techno from "../../Assets/techno-owl.png";
// import './technoped-result.css';
// const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3001/";
//   const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/login" : "http://localhost:3000/login";
// const ResultPage = ({ rollNumber, examDuration }) => {
//     const [score, setScore] = useState(null);
//     const [rank, setRank] = useState(null);
//     const [leaderboard, setLeaderboard] = useState([]);

//     const formatDuration = (durationInSeconds) => {
//         const hours = Math.floor(durationInSeconds / 3600);
//         const minutes = Math.floor((durationInSeconds % 3600) / 60);
//         const seconds = Math.floor(durationInSeconds % 60);
//         return `${hours} hrs ${minutes} mins ${seconds} seconds`;
//     };

//     useEffect(() => {
//         const fetchScoreAndRank = async () => {
//             try {
//                 const scoreResponse = await axios.get(`${baseURL}api/score/${rollNumber}`);
//                 const rankResponse = await axios.get(`${baseURL}api/rank/${rollNumber}`);
//                 setScore(scoreResponse.data.score);
//                 setRank(rankResponse.data.rank);
//             } catch (error) {
//                 console.error('Error fetching score or rank:', error);
//             }
//         };

//         const fetchLeaderboard = async () => {
//             try {
//                 const leaderboardResponse = await axios.get(`${baseURL}api/leaderboard`);
//                 setLeaderboard(leaderboardResponse.data);
//             } catch (error) {
//                 console.error('Error fetching leaderboard:', error);
//             }
//         };

//         fetchScoreAndRank();
//         fetchLeaderboard();
//     }, [rollNumber]);

//     if (score === null || rank === null) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="tped-question-main main">
//             <div className="roll">
//                 <p>{rollNumber}</p>
//                 <img src={techno} alt="" />
//             </div>

//             <div className='content'>
//                 <div className='Congratulations'>Congratulations!</div>
//                 <div className='statement'>
//                     <p>You have successfully completed technopedia</p>
//                     <p>Your Score is <span style={{ fontWeight: 'bold', color: 'black' }}>{score}/32 points</span></p>
//                     <p>You have taken time: <span style={{ color: 'red' }}>{formatDuration(examDuration)}</span></p>
//                     <p>Your Leaderboard Rank: <span style={{ fontWeight: 'bold', color: 'black' }}>{rank}</span></p>
//                     <p style={{color:'red'}}><span style={{fontWeight:'bold', color:'red'}}>Note:</span>Your rank is bound to change as more students attempt the quiz.</p>
//                 </div>

          
//             </div>
//         </div>
//     );
// };

// export default ResultPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './technopedia.css'
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Avatar,
    CircularProgress,
    Paper,
    Typography 
} from '@mui/material';

const Technopedia=()=> {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
    const navigate = useNavigate();

    // State management
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [questions, setQuestions] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize questions status from localStorage
    const [questionStatus, setQuestionStatus] = useState({});

    // Check user authentication and quiz status
    useEffect(() => {
        const checkAuthentication = () => {
            const storedUserData = localStorage.getItem('technopediaUserData');
            if (!storedUserData) {
                navigate('/technopedia-login', { replace: true });
                return;
            }

            const parsed = JSON.parse(storedUserData);
            setUserData(parsed);

            // Check if quiz was already started
            const startTime = localStorage.getItem('technopediaStartTime');
            const endTime = localStorage.getItem('technopediaEndTime');
            
            if (startTime && endTime) {
                const now = new Date();
                const end = new Date(endTime);
                
                if (now < end) {
                    setQuizStarted(true);
                    const remaining = Math.max(Math.floor((end - now) / 1000), 0);
                    setTimeLeft(remaining);
                }
            }
        };

        checkAuthentication();
    }, [navigate]);

    // Load question status from localStorage
    useEffect(() => {
        const loadQuestionStatus = () => {
            const status = {};
            for (let i = 1; i <= 10; i++) {
                const answer = localStorage.getItem(`question_${i}_answer`);
                const isCorrect = localStorage.getItem(`question_${i}_correct`);
                
                if (answer !== null) {
                    if (isCorrect === 'true') {
                        status[i] = 'correct';
                    } else if (isCorrect === 'false') {
                        status[i] = 'wrong';
                    } else {
                        status[i] = 'attempted';
                    }
                } else {
                    status[i] = 'unattempted';
                }
            }
            setQuestionStatus(status);
        };

        loadQuestionStatus();
        
        // Listen for storage changes
        const handleStorageChange = () => {
            loadQuestionStatus();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Initialize questions
    useEffect(() => {
        const initQuestions = () => {
            const questionList = [];
            for (let i = 1; i <= 10; i++) {
                questionList.push({
                    id: i,
                    number: i,
                    title: `Question ${i}`,
                    status: questionStatus[i] || 'unattempted'
                });
            }
            setQuestions(questionList);
        };

        initQuestions();
    }, [questionStatus]);

    // Timer for quiz
    useEffect(() => {
        if (quizStarted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleEndQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizStarted, timeLeft]);

    // Handlers
    const handleStartQuiz = () => {
        setOpenDialog(true);
    };

    const handleConfirmStart = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Set quiz times
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 3600000); // 1 hour

            // Save to localStorage
            localStorage.setItem('technopediaStartTime', startTime.toISOString());
            localStorage.setItem('technopediaEndTime', endTime.toISOString());
            localStorage.setItem('technopediaActive', 'true');

            // Update state
            setQuizStarted(true);
            setTimeLeft(3600);
            setOpenDialog(false);

        } catch (error) {
            console.error('Quiz start error:', error);
            setError('Failed to start quiz');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndQuiz = () => {
        // Calculate final analytics
        const analytics = calculateAnalytics();
        
        // Store final analytics
        localStorage.setItem('technopediaAnalytics', JSON.stringify(analytics));
        localStorage.setItem('technopediaCompleted', 'true');
        
        // Navigate to analytics page
        navigate('/quiz/analytics');
    };

    const calculateAnalytics = () => {
        let correct = 0, wrong = 0, unattempted = 0;
        let totalTimeSpent = 0;
        const questionAnalytics = [];

        for (let i = 1; i <= 10; i++) {
            const status = questionStatus[i] || 'unattempted';
            const timeSpent = parseInt(localStorage.getItem(`totalTimeSpent_question_${i}`) || '0');
            const visitCount = JSON.parse(localStorage.getItem(`timeSpent_question_${i}`) || '[]').length;

            if (status === 'correct') correct++;
            else if (status === 'wrong') wrong++;
            else unattempted++;

            totalTimeSpent += timeSpent;

            questionAnalytics.push({
                questionNumber: i,
                status,
                timeSpent: Math.floor(timeSpent / 1000), // Convert to seconds
                visitCount
            });
        }

        return {
            summary: { correct, wrong, unattempted },
            totalTimeSpent: Math.floor(totalTimeSpent / 1000),
            questionAnalytics,
            completedAt: new Date().toISOString()
        };
    };

    const handleQuestionClick = (questionNumber) => {
        if (!quizStarted) return;
        navigate(`/quiz/question/${questionNumber}`);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'correct': return '#4caf50';
            case 'wrong': return '#f44336';
            case 'attempted': return '#ff9800';
            default: return '#e0e0e0';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'correct': return '✓';
            case 'wrong': return '✗';
            case 'attempted': return '◐';
            default: return '○';
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="technopedia-container">
            <div className="header-section">
                <Typography variant="h3" className="main-title">
                    Technopedia Quiz 2025
                </Typography>
                <Typography variant="h6" className="subtitle">
                    Test Your Technical Knowledge
                </Typography>
            </div>

            {!quizStarted ? (
                <div className="technopedia-pre-quiz-section">
                    <Paper elevation={3} className="technopedia-user-info-card">
                        <Avatar className="technopedia-user-avatar">
                            {userData.name[0].toUpperCase()}
                        </Avatar>
                        <div className="technopedia-user-details">
                            <Typography variant="h6">{userData.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {userData.rollNumber} | {userData.school}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {userData.studentType.toUpperCase()} Student
                            </Typography>
                        </div>
                    </Paper>

                    <div className="technopedia-quiz-info-section">
                        <Paper elevation={2} className="technopedia-quiz-info-card">
                            <Typography variant="h6" className="technopedia-info-title">Quiz Information</Typography>
                            <div className="technopedia-info-list">
                                <div className="technopedia-info-item">
                                    <span className="technopedia-info-icon">⏱️</span>
                                    <span>Duration: 1 Hour</span>
                                </div>
                                <div className="technopedia-info-item">
                                    <span className="technopedia-info-icon">📝</span>
                                    <span>Questions: 10</span>
                                </div>
                                <div className="technopedia-info-item">
                                    <span className="technopedia-info-icon">🔄</span>
                                    <span>Multiple submissions allowed</span>
                                </div>
                                <div className="technopedia-info-item">
                                    <span className="technopedia-info-icon">💾</span>
                                    <span>Auto-save enabled</span>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    <div className="technopedia-questions-preview">
                        {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                            <div key={num} className="technopedia-question-preview-card locked">
                                <div className="technopedia-question-number">Q{num}</div>
                                <div className="technopedia-lock-icon">🔒</div>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                        className="technopedia-start-quiz-btn"
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={24} color="inherit" />
                                <span style={{marginLeft: '10px'}}>Starting...</span>
                            </>
                        ) : (
                            '🚀 Start Quiz'
                        )}
                    </Button>
                </div>
            ) : (
                <div className="technopedia-quiz-active-section">
                    {/* Timer */}
                    <div className="technopedia-timer-container">
                        <div className={`technopedia-timer ${timeLeft < 300 ? 'technopedia-timer-warning' : ''}`}>
                            <span className="technopedia-timer-icon">⏰</span>
                            <span className="technopedia-timer-text">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="technopedia-active-user-info">
                        <Avatar className="technopedia-small-avatar">
                            {userData.name[0].toUpperCase()}
                        </Avatar>
                        <span className="technopedia-user-name">{userData.name}</span>
                    </div>

                    {/* Questions grid */}
                    <div className="technopedia-questions-section-c">
                        {questions.map((question, index) => (
                            <div key={question.id} className={`technopedia-question-card ${question.status === 'correct' ? 'answered' : question.status === 'wrong' ? 'wrong' : ''}`}>
                                <div className="technopedia-question-header">
                                    <span className="technopedia-question-letter">{index + 1}</span>
                                    <span className="technopedia-points-badge">{question.status === 'correct' ? '10 pts' : question.status === 'wrong' ? '0 pts' : ''}</span>
                                </div>
                                <div className="technopedia-question-content">
                                    <h3 className="technopedia-question-title">
                                        {question.title || `Question ${index + 1}`}
                                    </h3>
                                    {question.status === 'correct' ? (
                                        <div className="technopedia-status-badge answered">
                                            <span className="check-icon">✓</span>
                                            Answered
                                        </div>
                                    ) : question.status === 'wrong' ? (
                                        <div className="technopedia-status-badge wrong">
                                            <span className="check-icon">✗</span>
                                            Wrong
                                        </div>
                                    ) : (
                                        <div className="technopedia-status-badge locked">
                                            <span className="lock-icon">🔒</span>
                                            Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Quiz Button */}
                    <div className="technopedia-submit-section">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to submit the quiz? This will end your session.')) {
                                    handleEndQuiz();
                                }
                            }}
                            className="technopedia-submit-quiz-btn"
                        >
                            Submit Quiz & View Analytics
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="technopedia-error-message">
                    {error}
                </div>
            )}

            {/* Start Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => !isLoading && setOpenDialog(false)}
                disableBackdropClick={isLoading}
                disableEscapeKeyDown={isLoading}
            >
                <DialogTitle>Start Technopedia Quiz?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to start the Technopedia Quiz. You will have 1 hour to complete 10 questions.
                        <br/><br/>
                        <strong>Important:</strong>
                        <br/>• You can submit multiple answers for each question
                        <br/>• Only your last answer will be considered
                        <br/>• Make sure you have stable internet connection
                        <br/>• Your progress will be automatically saved
                        <br/><br/>
                        Are you ready to begin?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmStart} 
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                <span style={{marginLeft: '8px'}}>Starting...</span>
                            </>
                        ) : (
                            'Start Quiz'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Technopedia;