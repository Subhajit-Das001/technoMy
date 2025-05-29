// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
// import './Contest.css';

// function Contest() {
//     const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
//     const navigate = useNavigate();

//     // State management
//     const [contestDates, setContestDates] = useState({
//         startTime: null,
//         endTime: null
//     });
//     const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
//     const [contestTimeLeft, setContestTimeLeft] = useState(3600);
//     const [questions, setQuestions] = useState([
//         { id: 1, letter: 'A', points: 300, attempted: false, answered: false },
//         { id: 2, letter: 'B', points: 600, attempted: false, answered: false },
//         { id: 3, letter: 'C', points: 1000, attempted: false, answered: false }
//     ]);
//     const [contestStarted, setContestStarted] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [userName, setUserName] = useState('');
//     const [error, setError] = useState('');
//     const [scores, setScores] = useState({
//         question1: 0,
//         question2: 0,
//         question3: 0,
//         total: 0
//     });
//     const [totalTimeSpent, setTotalTimeSpent] = useState(0);

//     // Check user authentication
//     useEffect(() => {
//         const storedUserName = localStorage.getItem('userName');
//         if (!storedUserName) {
//             navigate('/login');
//             return;
//         }
//         setUserName(storedUserName);
//     }, [navigate]);

//     // Check if contest is already started
//     useEffect(() => {
//         const startTime = localStorage.getItem('contestStartTime');
//         if (startTime) {
//             setContestStarted(true);
//             const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000);
//             const remaining = Math.max(3600 - elapsed, 0);
//             setContestTimeLeft(remaining);
//         }
//     }, []);

//     // Timer for contest
//     useEffect(() => {
//         if (contestStarted) {
//             const endTime = new Date(localStorage.getItem('contestEndTime'));
            
//             const timer = setInterval(() => {
//                 const now = new Date();
//                 const remaining = Math.max(Math.floor((endTime - now) / 1000), 0);
                
//                 setContestTimeLeft(remaining);
                
//                 if (remaining <= 0) {
//                     clearInterval(timer);
//                     handleEndContest();
//                 }
//             }, 1000);
    
//             return () => clearInterval(timer);
//         }
//     }, [contestStarted]);

//     // Fetch contest times
//     useEffect(() => {
//         const fetchContestTimes = async () => {
//             try {
//                 const sessionId = localStorage.getItem('sessionId');
//                 const userPhone = localStorage.getItem('userPhone');
                
//                 if (!sessionId || !userPhone) {
//                     navigate('/contest/login');
//                     return;
//                 }

//                 const response = await axios.get(`${baseURL}/api/contest/times`, {
//                     params: { phone: userPhone, sessionId }
//                 });
                
//                 if (response.data.startTime && response.data.endTime) {
//                     setContestDates({
//                         startTime: new Date(response.data.startTime),
//                         endTime: new Date(response.data.endTime)
//                     });

//                     const now = new Date();
//                     const end = new Date(response.data.endTime);
//                     const diff = end - now;
                    
//                     if (diff > 0) {
//                         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//                         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//                         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        
//                         setTimeLeft({ days, hours, minutes });
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching contest times:', error);
//                 if (error.response?.status !== 404) {
//                     setError('Error fetching contest times');
//                 }
//             }
//         };

//         fetchContestTimes();
//     }, [baseURL, navigate]);

//     // Fetch contest dates
//     useEffect(() => {
//         const fetchContestDates = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/api/contest/dates`);
                
//                 if (response.data) {
//                     setContestDates({
//                         startTime: new Date(response.data.startTime),
//                         endTime: new Date(response.data.endTime)
//                     });

//                     const now = new Date();
//                     const start = new Date(response.data.startTime);
//                     const diff = start - now;
                    
//                     if (diff > 0) {
//                         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//                         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//                         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        
//                         setTimeLeft({ days, hours, minutes });
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching contest dates:', error);
//                 if (error.response?.status !== 404) {
//                     setError('Error fetching contest dates');
//                 }
//             }
//         };

//         fetchContestDates();
//     }, [baseURL]);

//     // Get answered questions
//     useEffect(() => {
//         const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
//         setQuestions(prevQuestions => 
//             prevQuestions.map(q => ({
//                 ...q,
//                 answered: answeredQuestions.includes(q.id.toString())
//             }))
//         );
//     }, []);

//     // Handlers
//     const handleStartContest = () => setOpenDialog(true);

//     const handleConfirmStart = async () => {
//         try {
//             setError('');
//             const userPhone = localStorage.getItem('userPhone');
//             const userName = localStorage.getItem('userName');

//             if (!userPhone || !userName) {
//                 setError('User information missing. Please login again.');
//                 navigate('/contest/login');
//                 return;
//             }

//             const response = await axios.post(`${baseURL}/api/contest/start`, {
//                 phone: userPhone,
//                 name: userName
//             });

//             if (response.data.message === 'Contest started') {
//                 setContestStarted(true);
//                 localStorage.setItem('contestStartTime', response.data.startTime);
//                 localStorage.setItem('contestEndTime', response.data.endTime);
//                 localStorage.setItem('sessionId', response.data.sessionToken);
//                 setOpenDialog(false);
//             }
//         } catch (error) {
//             console.error('Error starting contest:', error);
//             if (error.response?.status === 400 && error.response?.data?.message.includes('already participated')) {
//                 setError('This phone number has already participated in the contest');
//             } else {
//                 setError(error.response?.data?.message || 'Error starting contest');
//             }
//         }
//     };

//     const handleEndContest = async () => {
//         try {
//             const userPhone = localStorage.getItem('userPhone');
            
//             if (!userPhone) {
//                 setError('User phone not found');
//                 navigate('/contest/login');
//                 return;
//             }

//             const response = await axios.post(`${baseURL}/api/contest/end`, {
//                 phone: userPhone
//             });

//             if (response.data.message === 'Contest ended successfully') {
//                 setScores(response.data.scores);
//                 setTotalTimeSpent(response.data.totalTimeSpent);

//                 // Clear all localStorage items
//                 const itemsToRemove = [
//                     'contestStartTime',
//                     'contestEndTime',
//                     'sessionId',
//                     'userPhone',
//                     'userName',
//                     'userRoll',
//                     'answeredQuestions',
//                     'contestCompleted'
//                 ];

//                 itemsToRemove.forEach(item => localStorage.removeItem(item));
                
//                 // Force clear any remaining items
//                 localStorage.clear();
                
//                 // Navigate to login page
//                 navigate('/contest/login', { replace: true });
//             }
//         } catch (error) {
//             console.error('Error ending contest:', error);
//             setError(error.response?.data?.message || 'Error ending contest');
            
//             // If there's an error, still try to clear localStorage and redirect
//             localStorage.clear();
//             navigate('/contest/login', { replace: true });
//         }
//     };

//     const handleBack = () => {
//         if (contestStarted) {
//             if (window.confirm('Are you sure you want to leave? This will end your contest and clear all data.')) {
//                 handleEndContest();
//             }
//         } else {
//             localStorage.clear();
//             navigate('/contest/login');
//         }
//     };

//     const handleQuestionClick = (id, letter) => {
//         navigate(`/contest/${id}/${letter}`);
//     };

//     // Utility functions
//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     const formatDate = (date) => {
//         if (!date) return '';
//         return new Date(date).toLocaleString('en-US', {
//             dateStyle: 'full',
//             timeStyle: 'short'
//         });
//     };

//     // Components
//     const QuestionCard = ({ question, answered, onClick }) => (
//         <div 
//             className={`question-card ${answered ? 'answered' : ''}`}
//             onClick={answered ? null : onClick}
//         >
//             <h3>Question {question.letter}</h3>
//             <p>Points: {question.points}</p>
//             {answered && <div className="answered-badge">✓ Answered</div>}
//         </div>
//     );

//     return (
//         <div className="contest-container">
//             <div className="contest-header">
//                 <Button
//                     startIcon={<ArrowBackIcon />}
//                     onClick={handleBack}
//                     className="back-button"
//                     color="primary"
//                 >
//                     Back to Login
//                 </Button>
//                 <div className="contest-times">
//                     <div className="contest-period">
//                         <p>Contest Period:</p>
//                         <p>Start: {formatDate(contestDates.startTime)}</p>
//                         <p>End: {formatDate(contestDates.endTime)}</p>
//                     </div>
//                     <div className="timer">
//                         {contestStarted ? 
//                             `Time Remaining: ${formatTime(contestTimeLeft)}` :
//                             `Contest Opens In: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
//                         }
//                     </div>
//                 </div>
//                 <div className="user-info">
//                     <Avatar>{userName ? userName[0].toUpperCase() : ''}</Avatar>
//                     <span className="user-name">{userName}</span>
//                 </div>
//             </div>

//             <div className="questions-grid">
//                 {questions.map((question) => (
//                     <QuestionCard 
//                         key={question.id} 
//                         question={question} 
//                         answered={question.answered} 
//                         onClick={() => handleQuestionClick(question.id, question.letter)}
//                     />
//                 ))}
//             </div>

         

//             {contestStarted && (
//                 <div className="contest-stats">
//                     <div className="scores">
//                         <h3>Scores:</h3>
//                         <p>Question A: {scores.question1}</p>
//                         <p>Question B: {scores.question2}</p>
//                         <p>Question C: {scores.question3}</p>
//                         <p>Total: {scores.total}</p>
//                     </div>
//                     <div className="time-spent">
//                         <h3>Time Spent:</h3>
//                         <p>{Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s</p>
//                     </div>
//                 </div>
//             )}

//             <button 
//                 className="end-contest-btn"
//                 onClick={handleEndContest}
//                 disabled={!contestStarted}
//             >
//                 End Contest
//             </button>

//             <Dialog
//                 open={openDialog}
//                 onClose={() => setOpenDialog(false)}
//             >
//                 <DialogTitle>Start Contest?</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Warning: Once you start the contest, you cannot restart it. 
//                         You will have 1 hour to complete all questions. 
//                         Are you sure you want to proceed?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog(false)} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleConfirmStart} color="primary" variant="contained">
//                         Start
//                     </Button>
//                 </DialogActions>
//                 {error && <div className="error-message">{error}</div>}
//             </Dialog>
//         </div>
//     );
// }

// export default Contest;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './contest_login.css';
import AnimatedCountdown from '../../design/countdown';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

// Add this utility function at the top of your component
const toProperCase = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const StudentAuth = () => {
  const navigate = useNavigate();
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

  const [isRegistered, setIsRegistered] = useState(true);
  const [newStudentMode, setNewStudentMode] = useState('signup'); // 'signup' or 'signin'
  const [formData, setFormData] = useState({
    rollNumber: '',
    phone: '',
    name: '',
    school: '',
    city: ''
  });
  const [message, setMessage] = useState('');
  const [contestDates, setContestDates] = useState({
    startTime: "2025-05-17T09:00:00.000Z",  // Replace with your actual dates
    endTime: "2025-05-17T10:00:00.000Z"
  });
  const [contestTime, setContestTime] = useState({
    startTime: null,
    endTime: null,
    isContestStarted: false
  });

  useEffect(() => {
    const fetchContestTimes = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/contest/times`);
        if (response.data.schedule) {
          const startTime = new Date(response.data.schedule.startTime);
          const endTime = new Date(response.data.schedule.endTime);
          const now = new Date();
          
          setContestTime({
            startTime,
            endTime,
            isContestStarted: now >= startTime && now <= endTime
          });
        }
      } catch (error) {
        console.error('Error fetching contest schedule:', error);
        setMessage('Error fetching contest schedule');
      }
    };

    fetchContestTimes();
    const interval = setInterval(fetchContestTimes, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contestTime.isContestStarted) {
      setMessage('Contest has not started yet. Please wait for the scheduled time.');
      return;
    }

    try {
      // For registered students (using roll number)
      if (isRegistered) {
        const response = await axios.post(`${baseURL}/api/auth/check-student`, {
          rollNumber: formData.rollNumber,
          phone: formData.phone
        });

        if (response.data.exists) {
          // Store session data
          localStorage.setItem('sessionId', `${formData.rollNumber}-${Date.now()}`);
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('userPhone', response.data.phone);
          localStorage.setItem('userRoll', formData.rollNumber);
          localStorage.setItem('userSchool', response.data.school);
          localStorage.setItem('isNewStudent', 'false');
          
          // Clear existing contest data
          localStorage.removeItem('contestStartTime');
          localStorage.removeItem('contestEndTime');
          localStorage.removeItem('answeredQuestions');
          
          setMessage(`Welcome back, ${response.data.name}!`);
          navigate('/contest', { replace: true });
        } else {
          setMessage(response.data.message);
        }
      } 
      // For new students
      else {
        if (newStudentMode === 'signup') {
          // New student registration
          const formattedData = {
            name: formData.name,
            email: formData.email.toLowerCase(),
            phone: formData.phone,
            school: formData.school,
            city: formData.city
          };

          const response = await axios.post(`${baseURL}/api/auth/register-new`, formattedData);

          if (response.data.success) {
            setMessage(response.data.message);
            // Clear form data except email and phone for signin
            const signinData = {
              email: formData.email,
              phone: formData.phone
            };
            setFormData({...formData, ...signinData});
            setNewStudentMode('signin');
          } else {
            setMessage(response.data.message);
            if (response.data.shouldSignIn) {
              setNewStudentMode('signin');
            }
          }
        } else {
          // New student signin
          const response = await axios.post(`${baseURL}/api/auth/signin-new`, {
            email: formData.email,
            phone: formData.phone
          });

          if (response.data.success) {
            // Store session data
            localStorage.setItem('sessionId', `${response.data.email}-${Date.now()}`);
            localStorage.setItem('userName', response.data.name);
            localStorage.setItem('userPhone', response.data.phone);
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userCity', response.data.city); 
             localStorage.setItem('userSchool', response.data.school);// Add city
            localStorage.setItem('isNewStudent', 'true');
            
            // Clear existing contest data
            localStorage.removeItem('contestStartTime');
            localStorage.removeItem('contestEndTime');
            localStorage.removeItem('answeredQuestions');
            
            setMessage('Successfully signed in!');
            setTimeout(() => {
              navigate('/contest', { replace: true });
            }, 1000);
          } else {
            setMessage(response.data.message);
          }
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };



  // Update the signin form inputs
  const renderForm = () => {
    if (isRegistered) {
      return (
        <>
          <input
            type="text"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
            required
          />
        </>
      );
    }

    return (
      <div className="new-student-container">
        <div className="new-student-toggle">
          <button 
            className={newStudentMode === 'signup' ? 'active' : ''} 
            onClick={() => {
              setNewStudentMode('signup');
              setMessage('');
            }}
          >
            Sign Up
          </button>
          <button 
            className={newStudentMode === 'signin' ? 'active' : ''} 
            onClick={() => {
              setNewStudentMode('signin');
              setMessage('');
            }}
          >
            Sign In
          </button>
        </div>

        {newStudentMode === 'signup' ? (
          <>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              required
            />
            <input
              type="text"
              placeholder="School Name"
              value={formData.school}
              onChange={(e) => setFormData({...formData, school: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              required
            />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="auth-container">
        <div className={`countdown-wrapper ${contestTime.isContestStarted ? 'contest-started' : ''}`}>
          {contestTime.startTime && (
            <>
              <h3 className="contest-status">
                {!contestTime.isContestStarted 
                  ? "Contest starts in:" 
                  : "Contest ends in:"}
              </h3>
              <AnimatedCountdown 
                startTime={contestTime.startTime}
                endTime={contestTime.endTime}
                className="login-countdown"
                activeTimeType={!contestTime.isContestStarted ? "start" : "end"}
                showLabels={true}
                timezone="Asia/Kolkata"
              />
            </>
          )}
        </div>

        {!contestTime.isContestStarted ? (
          <div className="contest-not-started">
            <h2>Contest Not Started</h2>
            <p>Please wait for the contest to begin at <strong>{contestTime.startTime?.toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full',
              timeStyle: 'short'
            })}</strong> </p>
          </div>
        ) : (
          <>
            <div className="main-toggle">
              <button 
                className={isRegistered ? 'active' : ''} 
                onClick={() => setIsRegistered(true)}
              >
                Registered Student
              </button>
              <button 
                className={!isRegistered ? 'active' : ''} 
                onClick={() => setIsRegistered(false)}
              >
                New Student
              </button>
            </div>

            <form 
              onSubmit={handleSubmit} 
              className="auth-form" 
              data-form-type={
                isRegistered ? undefined : 
                newStudentMode === 'signup' ? 'signup' : 'signin'
              }
            >
              <h2>
                {isRegistered ? 'Registered Student Login' : 
                (newStudentMode === 'signup' ? 'New Student Registration' : 'New Student Sign In')}
              </h2>
              
              {renderForm()}

              <button type="submit" className="submit-button">
                {isRegistered ? 'Login' : 
                (newStudentMode === 'signup' ? 'Register' : 'Sign In')}
              </button>
            </form>
          </>
        )}

        {message && <div className="message">{message}</div>}
      </div>
      
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        className="back-button"
        variant="contained"
      >
        Back
      </Button>
    </>
  );
};

export default StudentAuth;