import React, { useState } from "react";
import "./Instruction.css";

const InstructionPanel = () => {
  // Set initial state to true so it opens on first load
  const [expanded, setExpanded] = useState(true);
  
  // State for checkboxes
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

  // Handle Checkbox changes
  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Check if both are checked to enable the button
  const isFormValid = checks.readInstructions && checks.confirmDetails;

  return (
    <>
      <button className="instruction-btn" onClick={handleExpand}>
        Show Instructions
      </button>

      <div className={`reg-instr ${expanded ? "expanded" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>

        <h2>INSTRUCTIONS</h2>
        <ul>
          <li>Teams must be comprised of students from the same squad.</li>
          <li>All team members must be in grades 9th to 12th in the upcoming academic year 2025-26.</li>
          <li>Only team registrations are accepted; individual registrations are not permitted.</li>
          <li>Each mobile number can only register one team.</li>
          <li>Write ‘Student’ at the 'Designation' spot</li>
          <li>After filling the form, click on 'Pay Now' to proceed to the payment portal</li>
          <li>Follow the instructions to make a successful payment and wait to be redirected back to Technothlon's portal</li>
          <li>A confirmation page will open, indicating successful registration.</li>
          <li>Both participants will receive an email with Roll numbers.</li>
          <li><strong>Each team is required to purchase only one ticket.</strong></li>
          <li className="disclaimer">
            <b style={{ color: "red" }}>Disclaimer:</b> Ensure all provided information is accurate. Any false information will result in immediate disqualification, without refund.
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
              I confirm my details (name, email, etc.) are correct and cannot be changed later <span className="req">*</span>
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