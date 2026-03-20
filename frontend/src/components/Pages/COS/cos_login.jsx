import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './cos_login.css';
import logo2 from '../../Assets/img/logo.png';

const COSLogin = () => {
  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";
  
  const redirectUrl = process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/school-dashboard"
    : "http://localhost:3000/school-dashboard";

  const [principal_id, setPrincipalId] = useState('');
  const [poc_id, setPocId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!principal_id.trim() || !poc_id.trim()) {
      setError('Please enter Principal ID and POC ID');
      return;
    }

    // Send poc_id as password to backend
    axios.post(`${baseURL}cos_portal/login`, { principal_id, password: poc_id })
      .then(res => {
        if (res.data.status) {
          window.location.href = redirectUrl;
        } else {
          setError("Invalid Principal ID or POC ID");
          setPrincipalId('');
          setPocId('');
        }
      })
      .catch(() => {
        setError("Invalid Principal ID or POC ID");
        setPrincipalId('');
        setPocId('');
      });
  };

  return (
    <div className="cos_kv_login_wrapper">
      <div className="cos_kv_login_container">
        <div className="cos_kv_login_box">
          <div className="cos_kv_logo_container">
            <img src={logo2} alt="Technothlon Logo" className="cos_kv_logo" />
          </div>
          
          <h1 className="cos_kv_portal_title">School Registration Portal</h1>
          
          <form onSubmit={handleSubmit} className="cos_kv_login_form">
            <div className="cos_kv_input_group">
              <label htmlFor="principal_id" className="cos_kv_input_label">Principal ID</label>
              <input
                id="principal_id"
                type="text"
                value={principal_id}
                onChange={(e) => setPrincipalId(e.target.value)}
                className="cos_kv_input_field"
                placeholder="Enter Principal ID"
                required
              />
            </div>

            <div className="cos_kv_input_group">
              <label htmlFor="poc_id" className="cos_kv_input_label">POC ID</label>
              <input
                id="poc_id"
                type="text"
                value={poc_id}
                onChange={(e) => setPocId(e.target.value)}
                className="cos_kv_input_field"
                placeholder="Enter POC ID"
                required
              />
            </div>

            {error && <div className="cos_kv_error_message">{error}</div>}

            <button type="submit" className="cos_kv_submit_button">
              Sign in
            </button>
          </form>

          <div className="cos_kv_footer">
            <p className="cos_kv_copyright">© 2026 Technothlon Office Automation</p>
            <p className="cos_kv_recommendation">We strongly recommend to use updated browsers only</p>
            <div className="cos_kv_browser_icons">
              <span className="cos_kv_browser_icon">Chrome</span>
              <span className="cos_kv_browser_icon">Edge</span>
              <span className="cos_kv_browser_icon">Firefox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COSLogin;
