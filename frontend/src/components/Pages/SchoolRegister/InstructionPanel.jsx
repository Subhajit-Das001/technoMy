import React, { useState } from "react";
import "./Instruction.css";

const InstructionPanel = () => {
  const [expanded, setExpanded] = useState(true);
  
  const [checks, setChecks] = useState({
    readInstructions: false,
    confirmDetails: false,
  });

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    setExpanded(false);
  };

  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Check validity
  const isFormValid = checks.readInstructions && checks.confirmDetails;

  return (
    <>
    <button 
        className="info-icon-btn" 
        onClick={handleExpand}
        title="Show Instructions"
        aria-label="Show Instructions"
      >
        i
      </button>

      <div className={`reg-instr ${expanded ? "expanded" : ""}`}>
        
        {/* --- UPDATE: Close Button is now conditional --- */}
        <button 
            className="close-btn" 
            onClick={isFormValid ? handleClose : null} 
            style={{ 
                opacity: isFormValid ? 1 : 0.3, 
                cursor: isFormValid ? 'pointer' : 'not-allowed' 
            }}
            title={isFormValid ? "Close" : "Please agree to the instructions first"}
        >
          &times;
        </button>

        <h2>INSTRUCTIONS</h2>
        <ul>
<li>The registration fee is <strong>₹200</strong> per team.</li>         
          <li>Please enter your <strong>correct Full Name, Email ID, and Phone Number</strong>. These details <strong>cannot be changed</strong> later.</li>
          <li>All communication, resources, and admit cards will be sent to your registered Email ID. <strong>Ensure your email is active and correct.</strong></li>
          <li><strong>Squad Eligibility (Academic Year 2026):</strong>
            <ul style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'circle' }}>
              <li><strong>Juniors Squad:</strong> Class 9 & 9, 9 & 10, or 10 & 10.</li>
              <li><strong>Hauts Squad:</strong> Class 11 & 11, 11 & 12, or 12 & 12.</li>
            </ul>
          </li>
          <li>After clicking <strong>'Pay Now'</strong>, you will be redirected to the payment portal. After a successful payment, <strong>DO NOT CLOSE OR REFRESH</strong> the window. Wait to be redirected back to the Success Page.</li>
          <li>If the payment is deducted but you do not receive a Roll Number within <strong>1 hour</strong>, please email us immediately at <a href="mailto:technothlon.iitg@gmail.com">technothlon.iitg@gmail.com</a>.</li>
          <li><strong>Password Format:</strong> Your password will be a combination of both team members' birth dates in <code>DDMMYYYY</code> format.</li>
          <li>If your online registration fails 2-3 times, please contact any <strong>Zonal Head</strong> for assistance.</li>
          <li className="disclaimer">
            <b style={{ color: "red" }}>Disclaimer:</b> Ensure all provided information is accurate. Any false information will result in immediate disqualification without refund.
          </li>
        </ul>

        {/* Checkbox Section */}
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="readInstructions"
              checked={checks.readInstructions}
              onChange={handleCheckChange}
            />
            <span className="checkbox-text">
              I have read the instructions carefully <span className="req">*</span>
            </span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="confirmDetails"
              checked={checks.confirmDetails}
              onChange={handleCheckChange}
            />
            <span className="checkbox-text">
              I confirm my details are correct and cannot be changed later <span className="req">*</span>
            </span>
          </label>
        </div>

        {/* Proceed Button */}
        <div className="action-area">
          <button 
            className={`proceed-btn ${isFormValid ? 'active' : 'disabled'}`} 
            onClick={isFormValid ? handleClose : null}
            disabled={!isFormValid}
          >
            Agree & Proceed
          </button>
        </div>
      </div>
    </>
  );
};

export default InstructionPanel;