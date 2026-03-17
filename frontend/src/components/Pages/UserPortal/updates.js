import React, { useState, useEffect } from 'react';
import techno from "../../Assets/techno-owl.png";
import './profile.css';
import './updates.css';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Updates = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";

  const [user, setUser] = useState('');
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}uploadcsv/user`, { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        console.log('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="updates-main" style={{padding: '3.4vw'}}>
    <div className="heading-banner">General Instructions</div>
    {/* <img src={techno} alt="Technothlon Owl" className="instructions-image" /> */}
    <div className="updates-content-wrapper">
      <div className="updates-content-heading">TECHNOTHLON 2025 UPDATES</div>
      <div className="updates-contents">
        <ul>
        <li>Certificates are now available. Make sure to download your corresponding certificate.</li>
<li>Online registration for Technothlon '26 is now live! Register your team today.</li>
<li>Technopedia is live! Join now using your roll number and registered email or contact number.</li>
<li>Prepare for the exam by practicing with our past year resources and study materials.</li> </ul>
      </div>
    </div>
    <p className="footer-note">For more updates, check our website or reach out to us directly.</p>
  </div>
  );
};

export default Updates;
