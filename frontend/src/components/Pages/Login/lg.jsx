import React, { useState, useEffect } from "react";
import "./lg.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockAnimation from "./LockAnimation"; // Component for the animated lock

const Login = () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://technothlon.techniche.org.in/api/"
      : "http://localhost:3001/api/";
  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://technothlon.techniche.org.in/userportal"
      : "http://localhost:3000/userportal";
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false); // Track lock state
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    setRoll("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roll.trim()) {
      setError("Please enter Roll Number");
      return;
    }

    if (!password.trim()) {
      setError("Please enter Password");
      return;
    }

    axios
      .post(`${baseURL}uploadcsv/login`, { roll, password })
      .then((res) => {
        if (res.data.status) {
          setIsUnlocked(true); // Unlock the lock
          setTimeout(() => {
            window.location.href = redirectUrl; // Redirect after animation
          }, 3000); // Add delay for lock animation
        } else {
          setError("Wrong Roll or Password");
          setRoll("");
          setPassword("");
        }
      })
      .catch((err) => {
        console.log("Error during login:", err);
        setError("Wrong Roll or Password");
        setRoll("");
        setPassword("");
      });
  };

  return (
    <div className="login-container">
      <div className="login-screen">
        <div className="login">
          <h2>Login</h2>

          <input
            type="text"
            className="form-control form-input"
            id="roll"
            name="roll"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="Roll no."
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control form-input"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
   
          {error && <p className="error-message">{error}</p>}
         
          <div className="button-contai">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        
        {/* Lock Animation */}
        <LockAnimation roll={roll} isUnlocked={isUnlocked} />
      </div>
    </div>
  );
};

export default Login;
