import React, { useState } from 'react';
import './cityreplogin.css';
import Header from "../../Header/header";
import Footer from "../../Footer/footer";
import Button from '../../Assets/Button/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { KeyRound, User } from 'lucide-react';

const CityrepLogin = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/cityrep_portal" : "http://localhost:3000/cityrep_portal";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter User ID and Password');
      return;
    }

    axios.post(`${baseURL}cityrep_portal/login`, { username, password })
      .then(res => {
        if (res.data.status) {
          window.location.href = redirectUrl;
        } else {
          setError("Invalid User ID or Password");
          setUsername('');
          setPassword('');
        }
      })
      .catch(() => {
        setError("Invalid User ID or Password");
        setUsername('');
        setPassword('');
      });
  };

  return (
    <div className="App">
      <Header />
      <div className="cityrep-login-container">
        <div className="cityrep-login-box">
          <div className="cityrep-login-header">
            <div className="cityrep-login-icon">
              <User className="cityrep-icon" />
            </div>
            <h2 className="cityrep-login-title">Welcome Back</h2>
            <p className="cityrep-login-subtitle">City Representatives Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username" className="input-label">User ID</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
              <KeyRound className="icon" />
              <span>Sign In</span>
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CityrepLogin;