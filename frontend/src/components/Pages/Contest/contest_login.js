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
    email: '',
    school: '',
    city: ''
  });
  const [message, setMessage] = useState('');
  const [contestDates, setContestDates] = useState({
    startTime: null,
    endTime: null
  });
  const [contestTime, setContestTime] = useState({
    startTime: null,
    endTime: null,
    isContestStarted: false
  });

  useEffect(() => {
    const fetchContestTimes = async () => {
      try {
        // Fixed: Use GET request to the correct endpoint
        const response = await axios.get(`${baseURL}/api/contest/dates`);
        const { startTime, endTime } = response.data;

        const now = new Date();
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);

        // Convert all times to timestamps for accurate comparison
        const nowTS = now.getTime();
        const startTS = startTimeDate.getTime();
        const endTS = endTimeDate.getTime();

        const isContestActive = nowTS >= startTS && nowTS <= endTS;
        
        console.log('Time Debug:', {
          now: now.toISOString(),
          start: startTimeDate.toISOString(),
          end: endTimeDate.toISOString(),
          isActive: isContestActive
        });

        setContestTime({
          startTime: startTimeDate,
          endTime: endTimeDate,
          isContestStarted: isContestActive
        });

        setContestDates({
          startTime: startTimeDate.toISOString(),
          endTime: endTimeDate.toISOString()
        });

      } catch (error) {
        console.error('Error fetching contest times:', error);
        // Set fallback message
        setMessage('Unable to fetch contest timing. Please try again later.');
      }
    };

    fetchContestTimes();
    const interval = setInterval(fetchContestTimes, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const now = new Date().getTime();
    const start = new Date(contestDates.startTime).getTime();
    const end = new Date(contestDates.endTime).getTime();
    
    // Debug log
    console.log('Submit Time Check:', {
      now: new Date().toISOString(),
      start: contestDates.startTime,
      end: contestDates.endTime,
      isActive: now >= start && now <= end
    });
  
    // Check contest timing for login/signin operations only (not for signup/registration)
    const isLoginOperation = isRegistered || (!isRegistered && newStudentMode === 'signin');
    
    if (isLoginOperation && !(now >= start && now <= end)) {
      setMessage('Contest has not started yet or has ended. Please check the timing.');
      return;
    }
    
    // For signup, allow registration even before contest starts
    if (!isRegistered && newStudentMode === 'signup') {
      // Allow signup anytime - no time restriction
      console.log('Signup operation - no time restriction');
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
          localStorage.setItem('usertype', response.data.studentType);          
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
            localStorage.setItem('userSchool', response.data.school);
            localStorage.setItem('usertype', response.data.studentType);            
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

  console.log('Contest Status:', {
    isContestStarted: contestTime.isContestStarted,
    now: new Date().toISOString(),
    startTime: contestTime.startTime?.toISOString(),
    endTime: contestTime.endTime?.toISOString()
  });

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
          
          {/* Show timing message for login operations when contest is not active */}
          {!contestTime.isContestStarted && (isRegistered || newStudentMode === 'signin') && (
            <div className="timing-info">
              <small>
                {isRegistered ? 'Login' : 'Sign In'} will be available when the contest starts
              </small>
            </div>
          )}
        </form>

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