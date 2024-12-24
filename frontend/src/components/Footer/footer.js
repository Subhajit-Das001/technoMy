import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import facebook from "../Assets/img/facbook.png";
import insta from "../Assets/img/insta.png";
import youtube from "../Assets/img/utube.png";
import blog from "../Assets/img/blog.png";
import twitt from "../Assets/img/social-media.png"
import wp from "../Assets/img/whatsapp.png";
import linked from "../Assets/img/social.png";
function Footer() {
  return (
    <div className="footer">
      <div className="frow">
        <div className="columns">
          <a href="/" className="flinks">
            Home
          </a>
           <Link to="/TeamRegistration" className="flinks">
            Register
          </Link>
          
          <Link to="/pyp" className="flinks">
            PYQs
          </Link>
        </div>
        <div className="columns">
        <a href="https://techniche.org/" className="flinks">
            Techniche
          </a>
        
        <Link to="/contactus" className="flinks">
            Contact Us
          </Link>
          {/* {/* <a href="/kvjnv" className="flinks">
            KVs & JNVs
          </a> 
          <a href="/mains" className="flinks">
            Mains
          </a> */}
          
          <Link to="/technopedia" className="flinks">
            Technopedia
          </Link>
          
        </div>
        <div className="columns">
          {/* <Link to="/contactus" className="flinks">
            Contact Us
          </Link> */}
          <a href="/faqs" className="flinks">
            FAQs
          </a>
          
          <a href="/Videos" className="flinks">
            Videos
          </a>
          <a href="/feedback" className="flinks">
            Feedback
          </a>
        </div>
        
      </div>
     
      <hr className="Hr"></hr>
      <div className="frow-last">
        <div className="frow-div">Copyright &copy; 2024-25 Technothlon. All Rights Reserved.</div>

        {/* <div className="frow1">
          <p>Designers</p>
          <div className="space"></div>
          <p>Developers</p>
        </div> */}
      
      <div className="columns_icons">
          <a href="https://www.facebook.com/technothlon/" className="col-ic">
            <img src={facebook}  />
          </a>
          <a href="https://www.youtube.com/@technothlon" className="col-ic">
            <img src={youtube} alt="" />
          </a>
          <a href="https://technothlon.medium.com/" className="col-ic">
            <img src={blog} alt="" />
          </a>
          <a
            href="https://www.instagram.com/technothlon.iitg/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA=="
            className="col-ic"
          >
            <img src={insta} alt="" />
          </a>
          <a href="https://twitter.com/TheTechnothlon" className="col-ic">
            <img src={twitt} alt="" />
          </a>
          <a href="https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S" className="col-ic">
            <img src={wp} alt="" />
          </a>
          <a href="https://in.linkedin.com/company/technothlon" className="col-ic">
            <img src={linked} alt="" />
          </a>
          
        </div>
        </div>
    </div>
  );
}

export default Footer;
