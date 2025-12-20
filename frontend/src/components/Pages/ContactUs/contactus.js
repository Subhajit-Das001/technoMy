import './contactus.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
// Import Icons
import { FaLinkedinIn, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";

// Images
import dp from '../../Assets/heads/dp.jpg';
import mf from '../../Assets/heads/mf.jpg';
import po from '../../Assets/heads/po.jpg';
import ri from '../../Assets/heads/ri.png';
import ud from '../../Assets/heads/ud.png';
import sr from '../../Assets/heads/sr.jpg';

function ContactUs() {
  const [northZone, setNorthZone] = useState([]);
  const [southZone, setSouthZone] = useState([]);
  const [eastZone, setEastZone] = useState([]);
  const [westZone, setWestZone] = useState([]);

  // --- HEADS DATA ---
  // FILL IN THE ACTUAL DETAILS BELOW
  const headsData = [
     { 
      id: 1, 
      name: "Shreshtha Rastogi", 
      role: "South Zone Head", 
      img: sr,
      linkedin: "https://www.linkedin.com/in/shreshtha-rastogi-24422a313/",
      email: "shreshtharastogi555@gmail.com",
      contact: "7233951978",
      position: "top center"
    },
        { 
      id: 2, 
      name: "Ritik Raj", 
      role: "North Zone Head", 
      img: ri,
      linkedin: "https://www.linkedin.com/in/ritik-raj-0117b5338/",
      email: "ritikraj620071@gmail.com",
      contact: "6200716689",
      position: "left center"
    },

    { 
      id: 3, 
      name: "Deep", 
      role: "West Zone Head", 
      img: dp,
      linkedin: "https://www.linkedin.com/in/deep-shah-b69b89312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "deeps01122006@gmail.com",
      contact: "8511107997",
      position: "top center"
    },
       { 
      id: 4, 
      name: "Uday kiran", 
      role: "South Zone Head", 
      img: ud,
      linkedin: "https://www.linkedin.com/in/uday-kiran-battula-435054250?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "k.battula@iitg.ac.in",
      contact: "8978909914",
      position: "center center"
    },
      { 
      id: 5, 
      name: "Poulomi", 
      role: "East Zone Head", 
      img: po,
      linkedin: "https://www.linkedin.com/in/poulomi-chakraborty-76b97a322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "poulomichakraborty750@gmail.com",
      contact: "9954704388",
      position: "center center"
    },

  
   
    
    { 
      id: 6, 
      name: "Md Mahroof", 
      role: "West Zone Head", 
      img: mf,
      linkedin: "https://www.linkedin.com/in/mahroof-imtiaz-b475a5370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "imtiazmahroof@gmail.com",
      contact: "9954083559",
      position: "right center"
    },
 
  ];

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  useEffect(() => {
    const fetchCityReps = async () => {
      try {
        const [north, south, east, west] = await Promise.all([
          axios.get(`${baseURL}cityreps/North`),
          axios.get(`${baseURL}cityreps/South`),
          axios.get(`${baseURL}cityreps/East`),
          axios.get(`${baseURL}cityreps/West`)
        ]);
        setNorthZone(north.data);
        setSouthZone(south.data);
        setEastZone(east.data);
        setWestZone(west.data);
      } catch (err) {
        console.error('Error fetching city reps:', err);
      }
    };

    fetchCityReps();
  }, [baseURL]);

  const cityreplogin = () => {
    window.location.href =
      process.env.NODE_ENV === "production"
        ? "https://technothlon.techniche.org.in/cityreplogin"
        : "http://localhost:3000/cityreplogin";
  };

  const renderZone = (zoneName, contacts) => (
    <div className="zone">
      <h2>{zoneName} Zone</h2>
      <div className="zone-name">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.cityRepID}>
              <p style={{ fontWeight: "600", whiteSpace: "pre-line"}}>
                {contact.name.replace(/\\n/g, "\n")}
              </p>
              <p>{contact.contact}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="App">
      <Header/>
      
      <div className="cityrp-main">
        <div className="navy">
          <h1>Contact Us</h1>
          <h2>You can contact cityreps of your zone through their contacts given below : -</h2>
          <button onClick={cityreplogin} className="cityrep-login-btn">
            Login for Cityreps
          </button>
        </div>
      </div>
      
      <div className="cityrp-main">
        <div className="head-headings">
          <p>City Representatives</p>
        </div>
        <div className="cityrp">
          {renderZone("North", northZone)}
          {renderZone("South", southZone)}
          {renderZone("East", eastZone)}
          {renderZone("West", westZone)}
        </div>
      </div>

      {/* --- HEADS SECTION WITH SOCIAL ICONS --- */}
      <div className="contact">
        <div className="head-heading">
          <p>Meet Our Heads</p>
        </div>
        
        <div className="heads-grid-container">
          {headsData.map((head) => (
            <div className="head-card" key={head.id}>
              <div className="head-img-wrapper">
                <img src={head.img} alt={head.name}                 style={{ objectPosition: head.position || 'center center' }}
 />
              </div>
              <div className="head-info">
                <h2>{head.name}</h2>
                <div className="divider"></div>
                <p className="role-text">{head.role}</p>
                
                {/* Social Icons Container */}
                <div className="social-links">
                  {head.linkedin && (
                    <a href={head.linkedin} target="_blank" rel="noreferrer" className="social-icon linkedin">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {head.email && (
                    <a href={`mailto:${head.email}`} className="social-icon email">
                      <FaEnvelope />
                    </a>
                  )}
                  {head.contact && (
                    <a href={`tel:${head.contact}`} className="social-icon phone">
                      <FaPhoneAlt />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cont-description">
          <h2>
            For further queries mail us at technothlon@iitg.ac.in / technothlon.iitg@gmail.com
          </h2>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;