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
        <li>Admit Card is now available. Please check your examination centre and download your admit card at the earliest.</li>
        <li>If you spot an error in any questions, email us at technothlon.iitg@gmail.com or technothlon@iitg.ac.in.</li>
          <li>For technical issues with result access, contact our team promptly.</li>
          <li>Stay tuned! Follow our social media handles for more updates. Good luck, champs!</li>
        </ul>
      </div>
    </div>
    <p className="footer-note">For more updates, check our website or reach out to us directly.</p>
  </div>
  );
};

export default Updates;
