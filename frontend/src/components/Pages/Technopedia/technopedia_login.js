import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './technopedia_login.css';
import technoped from '../../Assets/coin.png';



const TechnopediaLogin = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
  
  const [rollNumber, setRollNumber] = useState('');
  const [second, setSecond] = useState(''); // email or phone
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Add contest timing state
  const [contestDates, setContestDates] = useState({
    startTime: null,
    endTime: null
  });
  const [contestTime, setContestTime] = useState({
    startTime: null,
    endTime: null,
    isContestStarted: false
  });

  // Add contest timing fetch effect
  useEffect(() => {
    const fetchContestTimes = async () => {
      try {
        // Fixed: Use GET request to the correct endpoint
        const response = await axios.get(`${baseURL}/api/technopedia/techno/dates`);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Add contest timing check
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

    // Check contest timing for login
    if (!(now >= start && now <= end)) {
      setError('Contest has not started yet or has ended. Please check the timing.');
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/technopedia/check-student`, { rollNumber, second });
      if (res.data.exists) {
        // Save user info to localStorage/session                 
        localStorage.setItem('sessionId', `${res.data.rollNumber}-${Date.now()}`);
        localStorage.setItem('userRoll', res.data.rollNumber);
        localStorage.setItem('technopediaSecond', res.data.second);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('usertype', res.data.studentType);
        localStorage.setItem('userPhone', res.data.phone);            
        localStorage.setItem('userSchool', res.data.school);         
        localStorage.setItem('technopediaUserData', JSON.stringify(res.data));
        navigate('/technopedia');
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  console.log('Contest Status:', {
    isContestStarted: contestTime.isContestStarted,
    now: new Date().toISOString(),
    startTime: contestTime.startTime?.toISOString(),
    endTime: contestTime.endTime?.toISOString()
  });

  return (
  <div className="TL-contest-container">
    {/* Layout below matches login.jsx alignment and proportions (centered logo, wide form) */}
    <div className="TL-center-content">
      <div className="tl-logo-container">
        <img src={technoped} alt="Technopedia Logo" className="tl-logo-img" />
      </div>
      <div className="TL-questions-section-c">
        <form className="TL-login-form" onSubmit={handleLogin}>
          <h2 className="TL-login-title">Technopedia Login</h2>
          <div className="TL-input-group">
            <label>Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="TL-input-group">
            <label>Email or Phone Number</label>
            <input
              type="text"
              value={second}
              onChange={e => setSecond(e.target.value)}
              required
            />
          </div>
          {!contestTime.isContestStarted && (
            <div className="TL-timing-info">
              <small>Login will be available when the contest starts</small>
            </div>
          )}
          {error && <div className="TL-error-message">{error}</div>}
          {message && <div className="TL-message">{message}</div>}
          <button type="submit" className="TL-start-button">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
);

};

export default TechnopediaLogin;