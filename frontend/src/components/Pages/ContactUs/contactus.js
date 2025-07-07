import './contactus.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";
import Button from '../../Assets/Button/button';
import cv from '../../Assets/heads/charvi3.jpeg';
import sk from '../../Assets/heads/shubham2.jpeg';
import pj from '../../Assets/heads/Poojitha.jpg';
import vr from '../../Assets/heads/Varshini.jpg';
import lb from '../../Assets/heads/lalith1.jpeg';
import jk from '../../Assets/heads/jayant1.jpeg';
import ek from '../../Assets/heads/Ekshit.jpeg';

function ContactUs() {
  const [northZone, setNorthZone] = useState([]);
  const [southZone, setSouthZone] = useState([]);
  const [eastZone, setEastZone] = useState([]);
  const [westZone, setWestZone] = useState([]);

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
              <p style={{ fontWeight: "600",whiteSpace: "pre-line"}}>{contact.name.replace(/\\n/g, "\n")}</p>
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
          <h2>
            You can contact cityreps of your zone through their contacts given below : - 
          </h2>
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
          {/* Render Zones dynamically based on the fetched data */}
          {renderZone("North", northZone)}
          {renderZone("South", southZone)}
          {renderZone("East", eastZone)}
          {renderZone("West", westZone)}
        </div>
      </div>

      <div className="contact">
        <div className="head-heading">
          <p>Meet Our Heads</p>
        </div>
        <div className="main-head">
          <div className="heads">
            <div className="head-pic">
              <img src={cv} alt="Charvi Sri Koppisetti" />
            </div>
            <div className="abt-head">
              <h2>Charvi Sri Koppisetti</h2>
            {/* <h3>9963249409</h3> */}
              <p>North Zone Head</p>
            </div>
          </div>

          <div className="heads">
            <div className="head-pic">
              <img src={vr} alt="Varshini Sathineni" />
            </div>
            <div className="abt-head">
              <h2>Varshini Sathineni</h2>
              {/* <h3>8106226713</h3> */}

              <p>West Zone Head</p>
            </div>
          </div>

          <div className="heads">
            <div className="head-pic">
              <img src={pj} alt="Poojitha Reddy" />
            </div>
            <div className="abt-head">
              <h2>Poojitha Reddy</h2>
              {/* <h3>9063910805</h3> */}
              <p>South Zone Head</p>
            </div>
          </div>
        </div>

        <div className="main-head">
          <div className="heads">
            <div className="head-pic">
              <img src={lb} alt="Lalithkumar Banglore Sreenivasan" />
            </div>
            <div className="abt-head">
              <h2>Lalithkumar Banglore Sreenivasan</h2>
              {/* <h3>6379749909</h3> */}
              <p>North Zone Head</p>
            </div>
          </div>

          <div className="heads">
            <div className="head-pic">
              <img src={jk} alt="Jayant Kumar" />
            </div>
            <div className="abt-head">
              <h2>Jayant Kumar</h2>
              {/* <h3>8003674745</h3> */}
              <p>West Zone Head</p>
            </div>
          </div>

          <div className="heads">
            <div className="head-pic">
              <img src={ek} alt="Ekshith sai Gunakar Pasala" />
            </div>
            <div className="abt-head">
              <h2>Ekshith sai Gunakar Pasala</h2>
              {/* <h3>9515364418</h3> */}
              <p>South Zone Head</p>
            </div>
          </div>
        </div>

        <div className="main-head">
          <div className="heads">
            <div className="head-pic">
              <img src={sk} alt="Shubham Kumar Soni" />
            </div>
            <div className="abt-head">
              <h2>Shubham Kumar Soni</h2>
              {/* <h3>9142244288</h3> */}
              <p>East Zone Head</p>
            </div>
          </div>
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
