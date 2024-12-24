import React, { useState } from 'react';
import './login.css';
import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";
import Techno_owl from "./techno_owl_logo.jpg";
import Button from '../../Assets/Button/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import './lg.css';

const Login = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/userportal" : "http://localhost:3000/userportal";
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false); // Track if clicked
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if roll or password is empty
    if (!roll.trim()) {
      setError('Please enter Roll Number');
      return;
    }

    if (!password.trim()) {
      setError('Please enter Password');
      return;
    }

    // Proceed with login
    axios.post(`${baseURL}uploadcsv/login`, { roll, password })
      .then(res => {
        if (res.data.status) {
          window.location.href = redirectUrl;
        } else {
          setError("Wrong Roll or Password");
          setRoll('');
          setPassword('');
        }
      })
      .catch((err) => {
        console.log('Error during login:', err);
        setError("Wrong Roll or Password");
        setRoll('');
        setPassword('');
      });
  };

  const handleForgotPassword = () => {
    if (!roll.trim()) {
      setError('Please enter your Roll Number to retrieve your password.');
      return;
    }

    setForgotPasswordClicked(true);  // Add underline effect when clicked
    setError(''); // Reset any error state before making the request

    // Send the request to get the password
    axios.post(`${baseURL}/forgot-password`, { rollNumber: roll })
      .then((res) => {
        // Clear the message and show success notification immediately
        setMessage(res.data.message);
          toast.success("Your password has been sent to your email!");
      })
      .catch((err) => {
        // Show error message only if there was an actual failure
        const errorMessage = err.response?.data?.error || "Failed to retrieve password";
        setError(errorMessage);
        setMessage('');
        toast.error(errorMessage);  // Trigger the error notification
      });
  };

  return (
    <div className="App">
      <Header />
      <div className="login-screen">
        <div className="screenn">
          <div className="logo">
            <img src={Techno_owl} alt="AboutUs" />
          </div>
          <div className="head">
            <p className='text-4xl font-bold text-white'>Log In</p>
          </div>
          <div className="text" id="for-whom">
            <p className='text-white text-2xl'>For registered students</p>
          </div>
          <div className="small-fluid"></div>
          <div className="login-card">
            <div className="form-mainn">
              <label className="labell" id="rollnumber">Roll Number</label>
              <input
                type="text"
                className="form-control form-input"
                id="roll"
                name='roll'
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder='Roll no.'
                required
              />
              <label className="labell" id="password">Password</label>
              <input
                type="password"
                placeholder='Password'
                className="form-control form-input"
                id="password"
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}
              <div className="small-fluid"></div>
              <div className="containerr">
                <Button color="#00E86B" text="Login" onClick={handleSubmit} />
              </div>
              
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;
