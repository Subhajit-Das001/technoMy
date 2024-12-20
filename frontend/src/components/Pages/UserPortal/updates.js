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
    <div className="updates-main flex justify-center ">
      {/* <div className="user-info">
        <p>{user.roll || user.rollNumber}</p>
        <img src={techno} alt="Technothlon Owl" className="techno-logo" />
      </div> */}
      {/* <div className="profile-heading">Updates</div> */}
      <div className="heading-banner">General Instructions</div>
      <div className="updates-content-wrapper">
        <div className="updates-content-heading">TECHNOTHLON 2024 UPDATES</div>
        <div className="updates-contents">
          <ul>
            <li>Results declared by our team are final, no re-evaluation queries will be entertained.</li>
            <li>If you spot an error in any questions, email us at technothlon.iitg@gmail.com or technothlon@iitg.ac.in.</li>
            <li>For technical issues with result access, contact our team promptly.</li>
            <li>Stay tuned! Follow our social media handles for more updates. Good luck, champs!</li>
          </ul>
        </div>
        {/* Uncomment the button when ready */}
        {/* <div className="get-admitCard-wrapper">
          <button className="get-admitCard-btn" onClick={createAndDownloadPdf}>
            Download Admit Card
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Updates;
