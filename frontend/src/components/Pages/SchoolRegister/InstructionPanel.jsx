import React, { useState } from "react";
import "./Instruction.css";

const InstructionPanel = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleClose = (e) => {
    e.stopPropagation(); 
    setExpanded(false);
  };

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
               <li> <strong>Each team is required to purchase only one ticket.</strong></li>
               <li className='disclaimer'><b style={{ color: 'red' }}>Disclaimer:</b> Ensure all provided information is accurate. Any false information will result in immediate disqualification, without refund.</li>
             </ul>
               
             
      </div>
    </>
  );
};

export default InstructionPanel;
