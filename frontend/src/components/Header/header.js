import React, { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import Blue_logo from "./Blue_technologo.png";
import facebook from "../Assets/img/facbook.png";
import insta from "../Assets/img/insta.png";
import youtube from "../Assets/img/utube.png";
import blog from "../Assets/img/blog.png";
import Graylogo from "../Assets/img/Gray_technologo.png"

import Logo from "../Assets/techno1.png"
import logo from "../Assets/img/logo.png"




function Header() {
  const [clickedLink, setClickedLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
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
          <p>Register</p>
        </Link>
        <Link
          to="/login"
          className={`hlinkss ${clickedLink === "login" ? "clicked" : ""}`}
          onClick={() => setClickedLink("login")}
        >
          <p>Login</p>
        </Link>
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
