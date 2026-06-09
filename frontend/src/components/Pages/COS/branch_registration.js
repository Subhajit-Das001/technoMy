import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './branch_registration.css'; // Create this CSS for the blue/white landscape layout
import logo2 from '../../Assets/img/logo.png';

const POCRegistration = () => {
  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  const navigate = useNavigate();

  const initialFormState = {
    branch_name: '',
    school_id: '',
    bpoc_name: '',
    bpoc_mail: '',
    bpoc_contact: '',
    city: '',
    state: ''
  };
const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
    setError(''); 
  }
  };

  const validateForm = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // Assuming standard 10-digit format

    if (!emailRegex.test(data.bpoc_mail)) {
      return "Please enter a valid email address.";
    }
    if (!phoneRegex.test(data.bpoc_contact)) {
      return "Please enter a valid 10-digit contact number.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Apply .trim() to all string fields
    const trimmedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key].trim();
      return acc;
    }, {});
    // 2. Capitalize State field (e.g., "west bengal" -> "West Bengal")
    if (trimmedData.state) {
    trimmedData.state = capitalizeWords(trimmedData.state);
  }
    // Check for empty fields
    const hasEmptyFields = Object.values(trimmedData).some(val => val === '');
    if (hasEmptyFields) {
      setError("All fields are required.");
      return;
    }

    const validationError = validateForm(trimmedData);
    if (validationError) {
      setError(validationError);
      return;
    }

  try {
    setIsLoading(true);

    const res = await axios.post(
      `${baseURL}cos_portal/register-poc`,
      trimmedData
    );

    if (res.data.success) {
      setFormData(initialFormState);
      setShowPopup(true);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      setError(
        err.response.data.message ||
        err.response.data.error ||
        "Registration failed."
      );
      // console.log(err);
    } else {
      setError("Server error. Please try again later.");
    }
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <div className="poc_reg_wrapper">
      <div className="poc_reg_container landscape_layout">
        <div className="poc_reg_box">
          <div className="poc_reg_header">
  <img src={logo2} alt="Logo" className="poc_reg_logo" />
  <h1 className="poc_reg_title">POC REGISTRATION</h1>
</div>
          <form onSubmit={handleSubmit} className="poc_reg_form_grid">
            {/* Column 1 */}
            <div className="poc_reg_column">
              <div className="poc_reg_input_group">
                <label>Branch Name</label>
                <input type="text" name="branch_name" value={formData.branch_name} onChange={handleChange} required />
              </div>
              <div className="poc_reg_input_group">
                <label>School ID</label>
                <input type="text" name="school_id" value={formData.school_id} onChange={handleChange} required />
              </div>
              <div className="poc_reg_input_group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="poc_reg_input_group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div>

            {/* Column 2 */}
            <div className="poc_reg_column">
              <div className="poc_reg_input_group">
                <label>POC Name</label>
                <input type="text" name="bpoc_name" value={formData.bpoc_name} onChange={handleChange} required />
              </div>
              {/* <div className="poc_reg_input_group">
                <label>POC ID</label>
                <input type="text" name="branch_id" value={formData.branch_id} onChange={handleChange} required />
              </div> */}
              <div className="poc_reg_input_group">
                <label>POC Email</label>
                <input type="email" name="bpoc_mail" value={formData.bpoc_mail} onChange={handleChange} required />
              </div>
              <div className="poc_reg_input_group">
                <label>POC Contact</label>
                <input type="tel" name="bpoc_contact" value={formData.bpoc_contact} onChange={handleChange} required />
              </div>
            </div>

            <div className="poc_reg_full_width">
              {error && <div className="poc_reg_error">{error}</div>}
<button
  type="submit"
  className="poc_reg_submit_btn"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="btn_loader_wrapper">
      <span className="btn_loader"></span>
      Registering...
    </span>
  ) : (
    "Register Branch"
  )}
</button>            </div>
          </form>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="poc_reg_modal_overlay">
          <div className="poc_reg_modal_content">
            <h2>Success</h2>
            <p>Branch registered. Credentials have been sent through your mail. Kindly Check the spam/junk folders too.</p>
            <button 
              className="poc_reg_login_btn" 
              onClick={() => navigate('/school-registration')}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POCRegistration;