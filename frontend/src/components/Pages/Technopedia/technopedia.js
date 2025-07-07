import React, { useState, useEffect, useRef } from 'react';
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
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import './technopedia.css';
import technoLogo from '../../Assets/img/techno_contest.png';
import starLogo from '../../Assets/img/star.png';
import rightLogo from '../../Assets/img/techniche_logo.png';
import birdLogo from '../../Assets/img/bird_logo1.png';
import arcImage from '../../Assets/img/arc.png';

function Contest() {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
    const navigate = useNavigate();

    // State management
    const [contestDates, setContestDates] = useState({
        schedule: null,
        individualTimer: null
    });
    const [questions, setQuestions] = useState([
        { id: 1, letter: 'A', title: 'Monochromatic Polygon Problem', points: 100, content: '', attempted: false, answered: false },
        { id: 2, letter: 'B', title: 'Minimum Possible Score in a Team Game', points: 100, content: '', attempted: false, answered: false },
        { id: 3, letter: 'C', title: "Steps on a Stopped Escalator", points: 100, content: '', attempted: false, answered: false },
        { id: 4, letter: 'D', title: 'Minimum Students for Common Topic', points: 100, content: '', attempted: false, answered: false },
        { id: 5, letter: 'E', title: 'Danger Symbol on a Grid', points: 100, content: '', attempted: false, answered: false },
        { id: 6, letter: 'F', title: 'Alien Multiplication Problem', points: 100, content: '', attempted: false, answered: false },
        { id: 7, letter: 'G', title: 'Unlocking the Door with Identical Keys', points: 100, content: '', attempted: false, answered: false },
        { id: 8, letter: 'H', title: 'Unique Word Game Scoring', points: 100, content: '', attempted: false, answered: false },
        { id: 9, letter: 'I', title: 'Elevator Problem with Fixed Movement', points: 100, content: '', attempted: false, answered: false },
        { id: 10, letter: 'J', title: 'Milk-Drinking Dragons', points: 100, content: '', attempted: false, answered: false }
    ]);
    const [contestStarted, setContestStarted] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [scores, setScores] = useState({
        question1: 0,
        question2: 0,
        question3: 0,
        question4: 0,
        question5: 0,
        question6: 0,
        question7: 0,
        question8: 0,
        question9: 0,
        question10: 0,
        total: 0
    });
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showReloadConfirm, setShowReloadConfirm] = useState(false);
    const reloadAttemptedRef = useRef(false);

    // Check user authentication
    useEffect(() => {
        const checkAuthentication = () => {
            const userPhone = localStorage.getItem('userPhone');
            const userName = localStorage.getItem('userName');
            const isContestActive = localStorage.getItem('isContestActive');
            
            if (!userPhone || !userName) {
                navigate('/technopedia-login', { replace: true });
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
        }
    }, []);

    // Fetch contest times (but don't show timer to user)
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const phone = localStorage.getItem('userPhone');
                const sessionId = localStorage.getItem('sessionToken');
                
                const response = await axios.get(`${baseURL}/api/technopedia/techno/times`, {
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

    // Listen for answer submissions from question pages
    useEffect(() => {
        const handleAnswerSubmitted = (event) => {
            if (event.detail && event.detail.questionId) {
                setSnackbar({
                    open: true,
                    message: 'Your answer has been submitted successfully!',
                    severity: 'success'
                });
                
                // Update answered questions
                setQuestions(prevQuestions => 
                    prevQuestions.map(q => 
                        q.id === event.detail.questionId 
                            ? { ...q, answered: true, attempted: true }
                            : q
                    )
                );
                
                // Update localStorage
                const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
                if (!answeredQuestions.includes(event.detail.questionId.toString())) {
                    answeredQuestions.push(event.detail.questionId.toString());
                    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
                }
            }
        };

        window.addEventListener('answerSubmitted', handleAnswerSubmitted);
        return () => window.removeEventListener('answerSubmitted', handleAnswerSubmitted);
    }, []);

    useEffect(() => {
        if (!showAnalysis) return;
        const handleBeforeUnload = (e) => {
            if (reloadAttemptedRef.current) return;
            e.preventDefault();
            e.returnValue = '';
            setShowReloadConfirm(true);
            reloadAttemptedRef.current = true;
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showAnalysis]);

    // Handlers
    const handleStartContest = () => {
        setOpenDialog(true);
    };

    const fetchQuestions = async () => {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                throw new Error('No session token found');
            }

            const questionPromises = Array.from({length: 10}, (_, i) => i + 1).map(id => 
                axios.get(`${baseURL}/api/technopedia/techno/questions/${id}`, {
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
                    title: responseData.title || q.title,
                    letter: responseData.letter || q.letter,
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

            console.log('Frontend data being sent:', { userPhone, userName, userSchool, studentType1 });

            if (!userPhone || !userName || !userSchool) {
                throw new Error('Missing user information. Please login again.');
            }

            const requestData = {
                phone: userPhone,
                name: userName,
                school: userSchool,
                studentType: studentType1
            };

            console.log('Request data:', requestData);

            const response = await axios.post(`${baseURL}/api/technopedia/techno/start`, requestData);

            if (response.data.success) {
                // Set contest times (for tracking purposes only)
                const startTime = new Date();
                
                // Save to localStorage
                localStorage.setItem('contestStartTime', startTime.toISOString());
                localStorage.setItem('sessionToken', response.data.sessionToken);
                localStorage.setItem('isContestActive', 'true');

                // Update state
                setContestStarted(true);
                setOpenDialog(false);

                // Fetch questions
                await fetchQuestions();
                
                setSnackbar({
                    open: true,
                    message: 'Contest started successfully! You can now solve questions.',
                    severity: 'success'
                });
            } else {
                throw new Error(response.data.message || 'Failed to start contest');
            }
        } catch (error) {
            console.error('Contest start error:', error);
            setError(error.response?.data?.message || error.message || 'Failed to start contest');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalysis = async () => {
        try {
            const userPhone = localStorage.getItem('userPhone');
            console.log('Fetching analysis for phone:', userPhone);
            
            const response = await axios.get(`${baseURL}/api/technopedia/analysis/${userPhone}`);
            
            console.log('Analysis response:', response.data);
            
            if (response.data.success) {
                setAnalysisData(response.data.analysis);
                return response.data.analysis;
            }
        } catch (error) {
            console.error('Error fetching analysis:', error);
            setError('Error fetching performance analysis');
        }
        return null;
    };

    const handleEndContest = async () => {
        try {
            setIsLoading(true);
            setError('');
            const userPhone = localStorage.getItem('userPhone');
            
            if (!userPhone) {
                setError('User phone not found');
                navigate('/technopedia-login');
                return;
            }

            console.log('Ending contest for phone:', userPhone);
            
            // First end the contest
            const response = await axios.post(`${baseURL}/api/technopedia/techno/end`, {
                phone: userPhone
            });

            console.log('End contest response:', response.data);

            if (response.data.message === 'Contest ended successfully') {
                setScores(response.data.scores);
                setTotalTimeSpent(response.data.totalTimeSpent);

                // Clear localStorage items related to contest
                const itemsToRemove = [
                    'contestStartTime',
                    'sessionToken',
                    'answeredQuestions',
                    'isContestActive'
                ];

                // Clear technopedia-specific localStorage items
                for (let i = 1; i <= 10; i++) {
                    localStorage.removeItem(`technopedia_timeSpent_question_${i}`);
                    localStorage.removeItem(`technopedia_totalTimeSpent_question_${i}`);
                }

                itemsToRemove.forEach(item => localStorage.removeItem(item));

                // Fetch analysis data
                const analysis = await fetchAnalysis();
                if (analysis) {
                    setShowAnalysis(true);
                }
            } else {
                // If the response doesn't indicate success, still try to show analysis
                const analysis = await fetchAnalysis();
                if (analysis) {
                    setShowAnalysis(true);
                }
            }
        } catch (error) {
            console.error('Error ending contest:', error);
            setError(error.response?.data?.message || 'Error ending contest');
            
            // If there's an error, still try to clear localStorage and show analysis
            try {
                const analysis = await fetchAnalysis();
                if (analysis) {
                    setShowAnalysis(true);
                }
            } catch (analysisError) {
                console.error('Error fetching analysis after contest end error:', analysisError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        // Clear all localStorage items related to contest and analysis
        const itemsToRemove = [
            'contestStartTime',
            'sessionToken',
            'userPhone',
            'userName',
            'userSchool',
            'usertype',
            'answeredQuestions',
            'isContestActive',
            'userRoll'
        ];

        for (let i = 1; i <= 10; i++) {
            localStorage.removeItem(`technopedia_timeSpent_question_${i}`);
            localStorage.removeItem(`technopedia_totalTimeSpent_question_${i}`);
        }

        itemsToRemove.forEach(item => localStorage.removeItem(item));

        // Remove any other technopedia-related items
        Object.keys(localStorage).forEach(key => {
            if (key.includes('technopedia') || key.includes('contest') || key.includes('session')) {
                localStorage.removeItem(key);
            }
        });

        // Redirect to login
        navigate('/technopedia-login', { replace: true });
    };

    const handleQuestionClick = (id, letter) => {
        navigate(`/techno/${id}/${letter}`);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleReloadYes = () => {
        setShowReloadConfirm(false);
        window.removeEventListener('beforeunload', () => {}); // Remove handler
        window.location.reload();
    };
    const handleReloadNo = () => {
        setShowReloadConfirm(false);
        reloadAttemptedRef.current = false;
    };

    // Utility functions
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    };

    const formatTimeInMinutes = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };

    // Constants for analysis display
    const metricIcons = {
        accuracy: '🎯',
        averageConfidence: '🔮',
        averageTIQ: '🧠',
        averageEfficiency: '⚡',
        averageConsistency: '📊',
        timeEfficiencyScore: '⏱️'
    };

    const metricTitles = {
        accuracy: 'Accuracy',
        averageConfidence: 'Confidence',
        averageTIQ: 'Tech IQ',
        averageEfficiency: 'Efficiency',
        averageConsistency: 'Consistency',
        timeEfficiencyScore: 'Time Efficiency'
    };

    const statusIcons = {
        correct: '✓',
        wrong: '✗',
        unattempted: '⏸'
    };

    const scoreLabels = {
        confidence: 'Confidence',
        tiq: 'TIQ',
        efficiency: 'Efficiency',
        consistency: 'Consistency'
    };

    const insightIcons = {
        strengths: '💪',
        improvements: '📈',
        recommendations: '💡'
    };

    const insightTitles = {
        strengths: 'Strengths',
        improvements: 'Areas for Improvement',
        recommendations: 'Recommendations'
    };

    const AnalysisComponent = () => {
        if (!analysisData) {
            return (
                <div className="TA-analysis-container">
                    <h2 className="TA-analysis-title">TechnoAnalysis</h2>
                    <div className="TA-analysis-loading">
                        <CircularProgress />
                        <p>Loading your performance analysis...</p>
                    </div>
                </div>
            );
        }
    
        // Performance level indicator
        const getPerformanceLevel = (score) => {
            if (score >= 85) return { level: 'Excellent', color: '#4CAF50', icon: '🏆' };
            if (score >= 75) return { level: 'Good', color: '#2196F3', icon: '🎯' };
            if (score >= 65) return { level: 'Average', color: '#FF9800', icon: '⚡' };
            return { level: 'Needs Improvement', color: '#F44336', icon: '📚' };
        };
    
        const performanceLevel = getPerformanceLevel(analysisData.collectiveScore);
    
        return (
            <div className="TA-analysis-container">
                <h2 className="TA-analysis-title">🔬 TechnoAnalysis Report</h2>
    
                {/* Performance Summary */}
                <div className="TA-performance-summary">
                    <div className="TA-summary-card TA-primary">
                        <div className="TA-summary-icon">{performanceLevel.icon}</div>
                        <div className="TA-summary-content">
                            <div className="TA-summary-value">{analysisData.collectiveScore}/100</div>
                            <div className="TA-summary-label">Overall Score</div>
                            <div className="TA-summary-category" style={{ color: performanceLevel.color }}>
                                {analysisData.performanceCategory}
                            </div>
                        </div>
                    </div>
    
                    <div className="TA-summary-card">
                        <div className="TA-summary-icon">⏱️</div>
                        <div className="TA-summary-content">
                            <div className="TA-summary-value">{analysisData.totalContestTime}m</div>
                            <div className="TA-summary-label">Total Time</div>
                            <div className="TA-summary-sub">Avg: {analysisData.averageTimePerQuestion}m/Q</div>
                        </div>
                    </div>
    
                    <div className="TA-summary-card">
                        <div className="TA-summary-icon">✅</div>
                        <div className="TA-summary-content">
                            <div className="TA-summary-value">{analysisData.completionRate}%</div>
                            <div className="TA-summary-label">Completion Rate</div>
                            <div className="TA-summary-sub">{analysisData.attemptedQuestions}/{analysisData.totalQuestions}</div>
                        </div>
                    </div>
                </div>
    
                {/* Overview Cards */}
                <div className="TA-analysis-overview">
                    <div className="TA-overview-card TA-attempted">
                        <div className="TA-overview-number">{analysisData.attemptedQuestions}</div>
                        <div className="TA-overview-label">Attempted</div>
                    </div>
                    <div className="TA-overview-card TA-correct">
                        <div className="TA-overview-number">{analysisData.correctAnswers}</div>
                        <div className="TA-overview-label">Correct</div>
                    </div>
                    <div className="TA-overview-card TA-wrong">
                        <div className="TA-overview-number">{analysisData.wrongAnswers}</div>
                        <div className="TA-overview-label">Wrong</div>
                    </div>
                    <div className="TA-overview-card TA-unattempted">
                        <div className="TA-overview-number">{analysisData.unattemptedQuestions}</div>
                        <div className="TA-overview-label">Unattempted</div>
                    </div>
                </div>
    
                {/* Performance Metrics */}
                <div className="TA-performance-metrics">
                    {['accuracy', 'averageConfidence', 'averageTIQ', 'averageEfficiency', 'averageConsistency', 'timeEfficiencyScore'].map((metricKey, index) => (
                        <div key={index} className="TA-metric-card">
                            <div className="TA-metric-header">
                                <span className="TA-metric-icon">{metricIcons[metricKey]}</span>
                                <span className="TA-metric-title">{metricTitles[metricKey]}</span>
                            </div>
                            <div className="TA-metric-value">
                                {metricKey === 'averageTIQ' ? `${analysisData[metricKey]}/150` : `${analysisData[metricKey]}/100`}
                            </div>
                            <div className="TA-metric-bar">
                                <div
                                    className="TA-metric-progress"
                                    style={{ width: `${metricKey === 'averageTIQ' ? (analysisData[metricKey] / 150) * 100 : analysisData[metricKey]}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
    
                {/* Insights Section */}
                {analysisData.insights && (
                    <div className="TA-insights-section">
                        <h3>💡 Performance Insights</h3>
                        <div className="TA-insights-grid">
                            {['strengths', 'improvements', 'recommendations'].map((type, index) => (
                                analysisData.insights[type].length > 0 && (
                                    <div key={index} className={`TA-insight-card TA-${type}`}>
                                        <div className="TA-insight-header">
                                            <span className="TA-insight-icon">{insightIcons[type]}</span>
                                            <span className="TA-insight-title">{insightTitles[type]}</span>
                                        </div>
                                        <ul className="TA-insight-list">
                                            {analysisData.insights[type].map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
    
                {/* Question-wise Analysis */}
                <div className="TA-question-analysis">
                    <h3>📊 Question-wise Performance</h3>
                    <div className="TA-questions-grid">
                        {analysisData.questionAnalysis.map((question, index) => (
                            <div key={index} className={`TA-question-card TA-${question.status}`}>
                                <div className="TA-question-header">
                                    <span className="TA-question-number">Q{question.questionId}</span>
                                    <span className={`TA-status-badge TA-${question.status}`}>
                                        {statusIcons[question.status]}
                                    </span>
                                    <span className="TA-question-grade">{question.grade}</span>
                                </div>
                                <div className="TA-question-metrics">
                                    <div className="TA-metric-row">
                                        <span className="TA-metric-label">⏱ Time:</span>
                                        <span className="TA-metric-value">{question.timeSpent}m</span>
                                    </div>
                                    <div className="TA-metric-row">
                                        <span className="TA-metric-label">👁 Visits:</span>
                                        <span className="TA-metric-value">{question.visitCount}</span>
                                    </div>
                                    <div className="TA-metric-row">
                                        <span className="TA-metric-label">📝 Attempts:</span>
                                        <span className="TA-metric-value">{question.submissionCount}</span>
                                    </div>
                                </div>
                                <div className="TA-question-scores">
                                    {['confidence', 'tiq', 'efficiency', 'consistency'].map((scoreKey, idx) => (
                                        <div key={idx} className="TA-score-item">
                                            <span className="TA-score-label">{scoreLabels[scoreKey]}: </span>
                                            <span className="TA-score-value">{question[scoreKey]}{scoreKey === 'tiq' ? '/150' : '/100'}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="TA-correct-answer">
                                    <span className="TA-answer-label">Correct Answer:</span>
                                    <span className="TA-answer-value">{question.correctAnswer}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Final Score */}
                <div className="TA-final-score">
                    <h3>🏆 Final Score</h3>
                    <div className="TA-score-display">
                        <div className="TA-total-score">{analysisData.scores.total}</div>
                        <div className="TA-score-label">Total Points</div>
                    </div>
                </div>
            </div>
        );
    };

    const handleBack = () => {
        // Clear all localStorage items related to contest and analysis
        const itemsToRemove = [
            'contestStartTime',
            'sessionToken',
            'userPhone',
            'userName',
            'userSchool',
            'usertype',
            'answeredQuestions',
            'isContestActive',
            'userRoll'
        ];
        for (let i = 1; i <= 10; i++) {
            localStorage.removeItem(`technopedia_timeSpent_question_${i}`);
            localStorage.removeItem(`technopedia_totalTimeSpent_question_${i}`);
        }
        itemsToRemove.forEach(item => localStorage.removeItem(item));
        Object.keys(localStorage).forEach(key => {
            if (key.includes('technopedia') || key.includes('contest') || key.includes('session')) {
                localStorage.removeItem(key);
            }
        });
        navigate('/technopedia-login', { replace: true });
    };

    return (
        <div className={`contest-container ${contestStarted ? 'contest-started' : ''}`}>
            {/* Back button for contest */}
            {contestStarted && (
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    className="back-button-contest"
                >
                    Back
                </Button>
            )}
            
            <div className="header-section">
                <div className="main-logo-container">
                    <img src={starLogo} alt="" className="star-logo" />
                    <img src={technoLogo} alt="Technothlon" className="main-logo1" />
                    <img src={rightLogo} alt="" className="right-logo" />
                    <img src={arcImage} alt="" className="arc-image" />
                </div>
            </div>

            {showAnalysis ? (
                <AnalysisComponent />
            ) : error ? (
                <div className="error-container" style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    margin: '20px'
                }}>
                    <h3 style={{ color: '#d32f2f', marginBottom: '20px' }}>⚠️ Error</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                    <button 
                        onClick={handleBackToLogin}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Login
                    </button>
                </div>
            ) : !contestStarted ? (
                <div className="TL-questions-section-c">
                    <div className="TL-questions-grid">
                        {/* Avatar/user info row spanning all 3 columns */}
                        <div className="TL-user-info-grid">
                            <div className="user-info">
                                <Avatar>{userName ? userName[0].toUpperCase() : ''}</Avatar>
                                <span className="user-name">{userName}</span>
                            </div>
                        </div>
                        {/* 9 question cards in 3x3 grid */}
                        {questions.slice(0, 9).map((question, index) => (
                            <div key={question.id} className="TL-question-wrapper">
                                <div className="question-card">
                                    <div className="question-header">
                                        <span className="question-letter">{question.letter}</span>
                                        <span className="points-badge">{question.points} pts</span>
                                    </div>
                                    <div className="question-content">
                                        <h3 className="question-title">{question.title || `Question ${question.letter}`}</h3>
                                        <div className="status-badge locked">
                                            <span className="lock-icon">🔒</span>
                                            Locked
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* 10th card centered in last row */}
                        <div className="TL-question-wrapper" style={{ gridColumn: '2 / span 1' }}>
                            <div className="question-card">
                                <div className="question-header">
                                    <span className="question-letter">{questions[9].letter}</span>
                                    <span className="points-badge">{questions[9].points} pts</span>
                                </div>
                                <div className="question-content">
                                    <h3 className="question-title">{questions[9].title || `Question ${questions[9].letter}`}</h3>
                                    <div className="status-badge locked">
                                        <span className="lock-icon">🔒</span>
                                        Locked
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Start button as last grid item */}
                        <div className="start-section-c">
                            <button 
                                className="start-button" 
                                onClick={handleStartContest}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? 'Starting...' : '🚀 Start Contest'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="TL-questions-section-c">
                    <div className="TL-questions-grid">
                        {/* Avatar/user info row spanning all 3 columns */}
                        <div className="TL-user-info-grid">
                            <div className="user-info">
                                <Avatar>{userName ? userName[0].toUpperCase() : ''}</Avatar>
                                <span className="user-name">{userName}</span>
                            </div>
                        </div>
                        {/* 9 question cards in 3x3 grid */}
                        {questions.slice(0, 9).map((question, index) => (
                            <div key={question.id} className="TL-question-wrapper">
                                <div className={`question-card ${question.answered ? 'answered' : 'unlocked'}`}> 
                                    <div className="question-header">
                                        <span className="question-letter">{question.letter}</span>
                                        <span className="points-badge">{question.points} pts</span>
                                    </div>
                                    <div className="question-content">
                                        <h3 className="question-title">{question.title || `Question ${question.letter}`}</h3>
                                        <button 
                                            className={`solve-button ${question.answered ? 'answered' : ''}`}
                                            onClick={() => handleQuestionClick(question.id, question.letter)}
                                        >
                                            {question.answered ? 'Solve Again' : 'Solve Now'} <span className="arrow">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* 10th card centered in last row */}
                        <div className="TL-question-wrapper" style={{ gridColumn: '2 / span 1' }}>
                            <div className={`question-card ${questions[9].answered ? 'answered' : 'unlocked'}`}>
                                <div className="question-header">
                                    <span className="question-letter">{questions[9].letter}</span>
                                    <span className="points-badge">{questions[9].points} pts</span>
                                </div>
                                <div className="question-content">
                                    <h3 className="question-title">{questions[9].title || `Question ${questions[9].letter}`}</h3>
                                    <button 
                                        className={`solve-button ${questions[9].answered ? 'answered' : ''}`}
                                        onClick={() => handleQuestionClick(questions[9].id, questions[9].letter)}
                                    >
                                        {questions[9].answered ? 'Solve Again' : 'Solve Now'} <span className="arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* End button as last grid item */}
                        <div className="start-section-c">
                            <button 
                                className="end-contest-btn" 
                                onClick={handleEndContest}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? 'Ending...' : '🏁 End Contest'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!showAnalysis && <img src={birdLogo} alt="" className="bird-logo" />}

            {/* Start Contest Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => !isLoading && setOpenDialog(false)}
                disableBackdropClick={isLoading}
                disableEscapeKeyDown={isLoading}
            >
                <DialogTitle>Start Contest?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Warning: Once you start the contest, you can solve questions without any time limit. 
                        You can submit multiple answers for each question - your latest answer will be considered.
                        Negative points will be awarded for incorrect answers. 
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

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={showReloadConfirm} onClose={handleReloadNo} disableEscapeKeyDown>
                <DialogTitle>Reload Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reload? You may lose your analysis data.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReloadNo} color="primary">No</Button>
                    <Button onClick={handleReloadYes} color="primary" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Contest;