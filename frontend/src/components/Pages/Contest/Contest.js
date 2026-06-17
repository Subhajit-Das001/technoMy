import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Avatar,
    CircularProgress 
} from '@mui/material'; 
import './Contest.css';
import technoLogo from '../../Assets/img/techno_contest.png';
import starLogo from '../../Assets/img/star.png';
import rightLogo from '../../Assets/img/techniche_logo.png';
import birdLogo from '../../Assets/img/bird_logo1.png';
import arcImage from '../../Assets/img/arc.png';

function Contest() {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
    const navigate = useNavigate();

    // Add this near the top of your component
    useEffect(() => {
        // console.log('Base URL:', baseURL);
    }, [baseURL]);

    // State management
    const [contestDates, setContestDates] = useState({
        schedule: null,
        individualTimer: null
    });
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [contestTimeLeft, setContestTimeLeft] = useState(3600);
    const [questions, setQuestions] = useState([
        { id: 1, letter: 'A', title: 'Lost Sequences in Number Maze', points: 300, content: '', attempted: false, answered: false },
        { id: 2, letter: 'B', title: 'Bamboo Breakfast: Slicing to Share', points: 600, content: '', attempted: false, answered: false },
        { id: 3, letter: 'C', title: "The Leader's Last Apple", points: 1000, content: '', attempted: false, answered: false }
    ]);
    const [contestStarted, setContestStarted] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [scores, setScores] = useState({
        question1: 0,
        question2: 0,
        question3: 0,
        total: 0
    });
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [attemptLocked, setAttemptLocked] = useState(false);

    // Check user authentication
    useEffect(() => {
        const checkAuthentication = () => {
            const userPhone = localStorage.getItem('userPhone');
            const userName = localStorage.getItem('userName');
            const isContestActive = localStorage.getItem('isContestActive');
            
            if (!userPhone || !userName) {
                navigate('/contest/login', { replace: true });
                return;
            }

            setUserName(userName);
            if (isContestActive === 'true') {
                setContestStarted(true);
            }
        };

        checkAuthentication();
    }, [navigate]);

    // Check if contest is already started
    useEffect(() => {
        const startTime = localStorage.getItem('contestStartTime');
        if (startTime) {
            setContestStarted(true);
            const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000);
            const remaining = Math.max(3600 - elapsed, 0);
            setContestTimeLeft(remaining);
        }
    }, []);

    // Timer for contest
    useEffect(() => {
        if (contestStarted) {
            const startTime = localStorage.getItem('contestStartTime');
            const endTime = localStorage.getItem('contestEndTime');
            
            if (!startTime || !endTime) {
                console.error('Missing contest time information');
                return;
            }

            // Set initial time
            const now = new Date();
            const end = new Date(endTime);
            const initialTimeLeft = Math.max(Math.floor((end - now) / 1000), 0);
            setContestTimeLeft(initialTimeLeft);

            // Start the timer
            const timer = setInterval(() => {
                const currentTime = new Date();
                const timeLeft = Math.max(Math.floor((end - currentTime) / 1000), 0);
                
                setContestTimeLeft(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    handleEndContest();
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [contestStarted]);

    // Fetch contest times
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const phone = localStorage.getItem('userPhone');
                const sessionId = localStorage.getItem('sessionToken');
                
                const response = await axios.get(`${baseURL}/api/contest/times`, {
                    params: { phone, sessionId }
                });

                if (response.data) {
                    setContestDates(response.data);
                }
            } catch (error) {
                console.error('Error fetching times:', error);
                setError('Error fetching contest schedule');
            }
        };

        fetchTimes();
        const interval = setInterval(fetchTimes, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, [baseURL]);

    // Fetch contest dates
    useEffect(() => {
        const fetchContestDates = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/contest/dates`);
                
                if (response.data) {
                    setContestDates({
                        startTime: new Date(response.data.startTime),
                        endTime: new Date(response.data.endTime)
                    });

                    const now = new Date();
                    const start = new Date(response.data.startTime);
                    const diff = start - now;
                    
                    if (diff > 0) {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        
                        setTimeLeft({ days, hours, minutes });
                    }
                }
            } catch (error) {
                console.error('Error fetching contest dates:', error);
                setError('Error fetching contest dates');
            }
        };

        fetchContestDates();
    }, [baseURL]);

    // Get answered questions
    useEffect(() => {
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
        setQuestions(prevQuestions => 
            prevQuestions.map(q => ({
                ...q,
                answered: answeredQuestions.includes(q.id.toString())
            }))
        );
    }, []);

    // Add this cleanup effect
    useEffect(() => {
        return () => {
            // Only clear if not in an active contest
            if (!contestStarted) {
                const isContestActive = localStorage.getItem('isContestActive');
                if (!isContestActive) {
                    localStorage.removeItem('contestStartTime');
                    localStorage.removeItem('contestEndTime');
                    localStorage.removeItem('sessionToken');
                }
            }
        };
    }, [contestStarted]);

    // Handlers
    const handleStartContest = () => {
        console.log('Start button clicked'); // Add debug log
        setOpenDialog(true);
    };

    const fetchQuestions = async () => {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                throw new Error('No session token found');
            }

            const questionPromises = [1, 2, 3].map(id => 
                axios.get(`${baseURL}/api/contest/questions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                })
            );
            
            const responses = await Promise.all(questionPromises);
            
            setQuestions(prev => prev.map((q, index) => {
                const responseData = responses[index].data;
                return {
                    ...q,
                    title: ` ${responseData.title}`,
                    letter: responseData.letter,
                    points: responseData.points || q.points,
                    content: responseData.content || ''
                };
            }));
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Failed to load questions. Please try again.');
        }
    };

    const handleConfirmStart = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const userPhone = localStorage.getItem('userPhone');
            const userName = localStorage.getItem('userName');
            const userSchool = localStorage.getItem('userSchool');
            const studentType1 = localStorage.getItem('usertype');

            if (!userPhone || !userName || !userSchool) {
                throw new Error('Missing user information. Please login again.');
            }

            const response = await axios.post(`${baseURL}/api/contest/start`, {
                phone: userPhone,
                name: userName,
                school: userSchool,
                studentType: studentType1
            });

            if (response.data.allowed === false) {
                setError('You have already attempted this contest');
                setAttemptLocked(true);
                setOpenDialog(false);
                return;
            }

            if (response.data.allowed === true || response.data.success) {
                // Set contest times
                const startTime = new Date();
                const endTime = new Date(startTime.getTime() + 3600000); // 1 hour

                // Save to localStorage
                localStorage.setItem('contestStartTime', startTime.toISOString());
                localStorage.setItem('contestEndTime', endTime.toISOString());
                localStorage.setItem('sessionToken', response.data.sessionToken);
                localStorage.setItem('isContestActive', 'true');

                // Update state
                setContestStarted(true);
                setContestTimeLeft(3600); // Set initial time left to 3600 seconds (1 hour)
                setOpenDialog(false);

                // Fetch questions
                await fetchQuestions();
            } else {
                throw new Error(response.data.message || 'Failed to start contest');
            }
        } catch (error) {
            console.error('Contest start error:', error);
            if (error.response?.data?.allowed === false) {
                setError('You have already attempted this contest');
                setAttemptLocked(true);
                setOpenDialog(false);
                return;
            }
            setError(error.response?.data?.message || error.message || 'Failed to start contest');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndContest = async () => {
        try {
            const userPhone = localStorage.getItem('userPhone');
            
            if (!userPhone) {
                setError('User phone not found');
                navigate('/contest/login');
                return;
            }

            const response = await axios.post(`${baseURL}/api/contest/end`, {
                phone: userPhone
            });

            if (response.data.message === 'Contest ended successfully') {
                setScores(response.data.scores);
                setTotalTimeSpent(response.data.totalTimeSpent);

                // Clear all localStorage items
                const itemsToRemove = [
                    'contestStartTime',
                    'contestEndTime',
                    'sessionId',
                    'userPhone',
                    'userName',
                    'userRoll',
                    'usertype',
                    'answeredQuestions',
                    'contestCompleted'
                ];

                itemsToRemove.forEach(item => localStorage.removeItem(item));
                
                // Force clear any remaining items
                localStorage.clear();
                
                // Navigate to login page
                navigate('/contest/login', { replace: true });
            }
        } catch (error) {
            console.error('Error ending contest:', error);
            setError(error.response?.data?.message || 'Error ending contest');
            
            // If there's an error, still try to clear localStorage and redirect
            localStorage.clear();
            navigate('/contest/login', { replace: true });
        }
    };

    const handleBack = () => {
        if (contestStarted) {
            if (window.confirm('Are you sure you want to leave? This will end your contest and clear all data.')) {
                handleEndContest();
            }
        } else {
            localStorage.clear();
            navigate('/contest/login');
        }
    };

    const handleQuestionClick = (id, letter) => {
        navigate(`/contest/${id}/${letter}`);
    };

    // Utility functions
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
    };
    // Components
    


    return (
        <div className="contest-container">
            {/* <button className="back-button" onClick={handleBack}>
                <ArrowBackIcon className="back-icon" />
                <span className="back-text">Back</span>
            </button> */}

            <div className="header-section">
                <div className="main-logo-container">
                    <img src={starLogo} alt="" className="star-logo" />
                    <img src={technoLogo} alt="Technothlon" className="main-logo1" />
                    <img src={rightLogo} alt="" className="right-logo" />
                    <img src={arcImage} alt="" className="arc-image" />
                </div>
               
            </div>

            {!contestStarted ? (
                // <div className="contest-not-started">
                  
                    <div className="questions-section-c">
                        {questions.map((question, index) => (
                            <div key={question.id} className="question-wrapper">
                                {index === 0 && (
                                    <div className="user-info-container">
                                        <div className="user-info">
                                            <Avatar>{userName ? userName[0].toUpperCase() : ''}</Avatar>
                                            <span className="user-name">{userName}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="question-card">
                                    <div className="question-header">
                                        <span className="question-letter">{question.letter}</span>
                                        <span className="points-badge">{question.points} pts</span>
                                    </div>
                                    <div className="question-content">
                                        <h3 className="question-title">
                                            {question.title || `Question ${question.letter}`}
                                        </h3>
                                        <div className="status-badge locked">
                                            <span className="lock-icon">🔒</span>
                                            Locked
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                    {/* </div> */}

                        {!attemptLocked && (
                        <div className="start-section-c">
                            <button 
                                className="start-button" 
                                onClick={handleStartContest}
                                disabled={isLoading} // Add disabled state
                            >
                                <span>{isLoading ? 'Starting...' : '🚀 Start Contest'}</span>
                            </button>
                    </div>
                        )}
                </div>



            ) : (
                <div className="questions-section-c">

                    {/* Timer first */}
                    {contestTimeLeft > 0 && (
                        <div className="timer-container">
                            <div className="timer-c">
                                <span className="timer-icon">⏰</span>
                                <span className="timer-text">{formatTime(contestTimeLeft)}</span>
                            </div>
                        </div>
                    )}

                    {/* User info below timer */}
                    <div className="user-info-container">
                        <div className="user-info">
                            <Avatar>{userName ? userName[0].toUpperCase() : ''}</Avatar>
                            <span className="user-name">{userName}</span>
                        </div>
                    </div>

                    {/* Questions grid */}
                    {questions.map((question, index) => (
                        <div key={question.id} className={`question-wrapper ${question.answered ? 'answered' : ''}`}>
                            <div className="question-card">
                                <div className="question-header">
                                    <span className="question-letter">Question {question.letter}</span>
                                    <span className="points-badge">{question.points} pts</span>
                                </div>
                                <div className="question-content">
                                    <h3 className="question-title">
                                        {question.title || `Question ${question.letter}`}
                                    </h3>
                                    {question.answered ? (
                                        <div className="answered-badge">
                                            <span className="check-icon">✓</span>
                                            Answered
                                        </div>
                                    ) : (
                                        <button 
                                            className="solve-button"
                                            onClick={() => handleQuestionClick(question.id, question.letter)}
                                        >
                                            Solve Now <span className="arrow">→</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* End button in same position as start button */}
                    <div className="start-section-c">
                        <button 
                            className="end-contest-btn"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to end the contest? This action cannot be undone.')) {
                                    handleEndContest();
                                }
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={20} color="inherit" />
                                    <span>Ending...</span>
                                </>
                            ) : (
                                <>
                                    <span>End Contest</span>
                                    <span style={{ fontSize: '20px' }}>⚠️</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <img src={birdLogo} alt="" className="bird-logo" />

            <Dialog
                open={openDialog}
                onClose={() => !isLoading && setOpenDialog(false)}
                disableBackdropClick={isLoading}
                disableEscapeKeyDown={isLoading}
            >
                <DialogTitle>Start Contest?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Warning: Once you start the contest, you cannot restart it. 
                        You will have 1 hour to complete all questions.
                        Negavtive points will be awarded for incorrect answers. 
                        Are you sure you want to proceed?
                    </DialogContentText>
                    {error && (
                        <div className="error-message" style={{ 
                            color: 'red', 
                            marginTop: '10px',
                            padding: '8px',
                            backgroundColor: '#ffebee',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        color="primary"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmStart} 
                        color="primary" 
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span style={{marginRight: '8px'}}>Starting...</span>
                                <CircularProgress size={20} color="inherit" />
                            </>
                        ) : (
                            'Start Contest'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Contest;
