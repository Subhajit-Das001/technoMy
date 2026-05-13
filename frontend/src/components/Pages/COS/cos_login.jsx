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

  const [school_id, setSchoolId] = useState('');
  const [branch_id, setBranchId] = useState('');
  const [bpoc_mail, setBpocMail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!school_id.trim() || !branch_id.trim() || !bpoc_mail.trim()) {
      setError('Please enter correct details');
      return;
    }

    // Send branch_id as password to backend
    axios.post(`${baseURL}cos_portal/login`, { school_id, branch_id , bpoc_mail})
      .then(res => {
        if (res.data.status) {
          window.location.href = redirectUrl;
        } else {
          setError("Invalid Details");
          setSchoolId('');
          setBranchId('');
          setBpocMail('');
        }
      })
      .catch(() => {
        setError("Invalid Details");
        setSchoolId('');
        setBranchId('');
        setBpocMail('');
      });
  };

  return (
    <div className="cos_kv_login_wrapper">
      <div className="cos_kv_login_container">
        <div className="cos_kv_login_box">
          <div className="cos_kv_logo_container">
            <img src={logo2} alt="Technothlon Logo" className="cos_kv_logo" />
          </div>
          
          <h1 className="cos_kv_portal_title">SCHOOL LOGIN PORTAL</h1>
          
          <form onSubmit={handleSubmit} className="cos_kv_login_form">
            <div className="cos_kv_input_group">
              <label htmlFor="school_id" className="cos_kv_input_label">School ID</label>
              <input
                id="school_id"
                type="text"
                value={school_id}
                onChange={(e) => setSchoolId(e.target.value)}
                className="cos_kv_input_field"
                placeholder="Enter School ID"
                required
              />
            </div>

            <div className="cos_kv_input_group">
              <label htmlFor="branch_id" className="cos_kv_input_label">Branch ID</label>
              <input
                id="branch_id"
                type="text"
                value={branch_id}
                onChange={(e) => setBranchId(e.target.value)}
                className="cos_kv_input_field"
                placeholder="Enter Branch ID"
                required
              />
            </div>
            <div className="cos_kv_input_group">
              <label htmlFor="bpoc_mail" className="cos_kv_input_label">POC Mail ID</label>
              <input
                id="bpoc_mail"
                type="text"
                value={bpoc_mail}
                onChange={(e) => setBpocMail(e.target.value)}
                className="cos_kv_input_field"
                placeholder="Enter POC Mail ID"
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
