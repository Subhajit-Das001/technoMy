import React, { useState, useEffect } from 'react';
import techno from "../../Assets/techno-owl.png";
import './profile.css';
import './updates.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
const Updates = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";

  const [user, setUser] = useState('');
  const tp_link = "https://technothlon.techniche.org.in/technopedia";
  const pyp = "https://technothlon.techniche.org.in/pyp";
  const lwLink = "https://www.instagram.com/p/DZW7g43j1KS/?igsh=Z2pjcGdkZ3hydDdz";
  const mc_link = "https://technothlon.techniche.org.in/mega-contest"
  
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
    {/* <div className="heading-banner">General Instructions</div> */}
    {/* <img src={techno} alt="Technothlon Owl" className="instructions-image" /> */}
    <div className="updates-content-wrapper">
      <div className="updates-content-heading">TECHNOTHLON 2026 UPDATES</div>
      <div className="updates-contents">
<ul>
  <li>
    Get ready for the Mega Contest on 21 June, 11:00 AM! Register for free and stand a chance to win exciting prizes.
    {" "}
    <a
      href={mc_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
      Participate Now! →
    </a>
  </li>
  <li>
    Explore and practice in your preferred language now.
    {" "}
    <a
      href={tp_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
      Technopedia is now available in Hindi! →
    </a>
  </li>
        <li>
     Challenge yourself daily with fresh questions ,  
    {" "}
    <a
      href={lwLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
     Logic Week is live now! →
    </a>
  </li>
  <li>
    Technopedia is live now. Practice a wide range of questions and receive a
    personalized performance analysis report to track your progress.
  </li>

  <li>
    Technopedia can be attempted individually using your roll number along with
    your registered email address or contact number.
    {" "}
    <a
      href={tp_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
      Start practicing →
    </a>
  </li>

  <li>
    Previous year papers from the 2024 and 2025 editions of Technothlon, along
    with their answer keys, are now available.
    {" "}
    <a
      href={pyp}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 600,
      }}
    >
      Click here to view →
    </a>
  </li>
 <li>
    Admit cards will be released during the first week of July. Please keep
    checking the portal for updates.
  </li>
  <li>
    Your login password is <strong>dob1+dob2</strong>, where{" "}
    <strong>dob1</strong> and <strong>dob2</strong> are the dates of birth of
    both participants in DD/MM/YYYY format.
  </li>

 



       </ul>
      </div>
    </div>
<p className="footer-note">
  All important announcements and updates will be displayed here in the Updates section.
  Follow us on our social media platforms and stay tuned!
</p> 
<div className="social-links">
  <a href="https://www.instagram.com/technothlon.iitg/" target="_blank" rel="noreferrer">
    <FaInstagram />
  </a>

  <a href="https://x.com/TheTechnothlon" target="_blank" rel="noreferrer">
    <FaXTwitter />
  </a>

  <a href="https://www.facebook.com/technothlon/" target="_blank" rel="noreferrer">
    <FaFacebook />
  </a>

  <a href="https://www.whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S" target="_blank" rel="noreferrer">
    <FaWhatsapp />
  </a>
</div>
 </div>
  );
};

export default Updates;
