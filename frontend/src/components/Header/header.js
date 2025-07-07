import React, { useState, useEffect } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import Blue_logo from "./Blue_technologo.png";
import facebook from "../Assets/img/facbook.png";
import insta from "../Assets/img/insta.png";
import youtube from "../Assets/img/utube.png";
import blog from "../Assets/img/blog.png";
import Graylogo from "../Assets/img/Gray_technologo.png"
import { FaTrophy } from 'react-icons/fa'; // for leaderboard icon
import { GiPodium } from 'react-icons/gi'; // for contest icon
import axios from 'axios';
import Logo from "../Assets/techno1.png"
import logo from "../Assets/img/logo.png"

function Header() {
  const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

  const [clickedLink, setClickedLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showContest, setShowContest] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const refreshPage = () => {
    window.location.reload(); // This will reload the page
  };
  const handleClick = (linkName) => {
  document.querySelectorAll('.hlinks').forEach(link => {
    link.classList.remove('clicked');
  });
  document.querySelector(`.hlinks.${linkName}`).classList.add('clicked');
};

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleMerchNavClick = async () => {
    try {
      await axios.post(`${baseURL}merch/navclick`);
      // Navigate to merch page
      window.location.href = '/Technothlon-Merch'; // or use your router
    } catch (err) {
      console.error('Error tracking merch nav click:', err);
    }
  };

  useEffect(() => {
    const checkAnnouncements = async () => {
      try {
        const response = await axios.get(`${baseURL}announcement`);
        const announcements = response.data;
        
        // Log the announcements to debug
        console.log('Received announcements:', announcements);
        
        // Check for announcements with id 1 and 4
        const contestAnnouncement = announcements.find(ann => Number(ann.id) === 1);
        const leaderboardAnnouncement = announcements.find(ann => Number(ann.id) === 4);
        
        // Debug logs
        console.log('Contest announcement:', contestAnnouncement);
        console.log('Leaderboard announcement:', leaderboardAnnouncement);
        
        setShowContest(!!contestAnnouncement);
        setShowLeaderboard(!!leaderboardAnnouncement);
      } catch (error) {
        console.error('Error checking announcements:', error);
      }
    };

    checkAnnouncements();
  }, [baseURL]);

  return (
    <div className="header">
      <div className="hamburger" onClick={toggleMenu}>
  
  <div className="hamburger-span">
    <span className={`hamburger-span-line ${isOpen ? "open" : ""}`} />
    <span className={`hamburger-span-line ${isOpen ? "open" : ""}`} />
    <span className={`hamburger-span-line ${isOpen ? "open" : ""}`} />
  </div>
  <div className="techno">
    <img src={Logo} alt="" />
  </div>
</div>

      <div className={`navbar ${isOpen ? "open" : ""}`}>
      <Link to="/" className="hlink" onClick={() => setClickedLink("/")}>
      <img className="techno-logo" src={Logo} alt="logo" />
    </Link>
        <div className="four-link">
        <Link
  to="/aboutus"
  className={`hlinks aboutus ${clickedLink === "aboutus" ? "clicked" : ""}`}
  onClick={() => setClickedLink("aboutus")}
>
  <p>About Us</p>
</Link>
          <Link
            to="/technopedia"
            className={`hlinks ${clickedLink === "technopedia" ? "clicked" : ""}`}
            onClick={() => setClickedLink("technopedia")}
          >
            <p>Technopedia</p>
          </Link>
          
          <Link
            to="/pyp"
            className={`hlinks ${clickedLink === "pyqs" ? "clicked" : ""}`}
            onClick={() => setClickedLink("pyqs")}
          >
            <p>PYQS</p>
          </Link>
          <Link
            to="/contactus"
            className={`hlinks ${clickedLink === "contactus" ? "clicked" : ""}`}
            onClick={() => setClickedLink("contactus")}
          >
            <p>Contact Us</p>
          </Link>
        </div>
        <div className="regggg">
         <Link
          to="/TeamRegistration"
          className={`regist ${clickedLink === "register" ? "clicked" : ""}`}
          onClick={() => setClickedLink("register")}
        >
          <p className="registp">Register</p>
        </Link>

        
        <Link
          to="/login"
          className={`hlinkss ${clickedLink === "login" ? "clicked" : ""}`}
          onClick={() => setClickedLink("login")}
        >
          <p>Login</p>
        </Link>
        <Link
            to="/Technothlon-Merch"
            className={`hlinks merch-highlight ${clickedLink === "merch" ? "clicked" : ""}`}
            onClick={handleMerchNavClick}
          >
            <p>TechnoMerch</p>
          </Link>
        
        {showContest  && (
          <Link
            to="/contest/login"
            className={`hlinkss contest-link ${clickedLink === "contest" ? "clicked" : ""}`}
            onClick={() => setClickedLink("contest")}
          >
  
              <span className="contest-link-content">💻 Contest</span>
          </Link>
        )}
        
        {showLeaderboard && (
          <Link
            to="/leaderboard"
            className={`hlinkss leaderboard-link ${clickedLink === "leaderboard" ? "clicked" : ""}`}
            onClick={() => setClickedLink("leaderboard")}
          >
              <span className="leaderboard-link-content">🏆 Leaderboard</span>
          </Link>
        )}
        </div>
        
        <div className="handles-icons">
          <a href="https://www.facebook.com/technothlon/" className="flinks">
            <img src={facebook} alt="" />
          </a>
          <a href="https://www.youtube.com/@technothlon" className="flinks">
            <img src={youtube} alt="" />
          </a>
          <a href="#" className="flinks">
            <img src={blog} alt="" />
          </a>
          <a
            href="https://www.instagram.com/technothlon.iitg/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA=="
            className="flinks"
          >
            <img src={insta} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
