import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Header/header";
import Footer from "../../Footer/footer";
import "./contactus.css";

import cv from '../../Assets/heads/charvi3.jpeg'
import sk from '../../Assets/heads/shubham2.jpeg'
import pj from '../../Assets/heads/Poojitha.jpg'
import vr from '../../Assets/heads/Varshini.jpg'
import lb from '../../Assets/heads/lalith1.jpeg'
import jk from '../../Assets/heads/jayant1.jpeg'
import ek from '../../Assets/heads/Ekshit.jpeg'


const Ct = () => {
  const [northZone, setNorthZone] = useState([]);
  const [southZone, setSouthZone] = useState([]);
  const [eastZone, setEastZone] = useState([]);
  const [westZone, setWestZone] = useState([]);
  const [loading, setLoading] = useState(true); // For handling loading state
  const [error, setError] = useState(null); // For handling errors

  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://technothlon.techniche.org.in/api/"
      : "http://localhost:3001/api/";

  useEffect(() => {
    const fetchCityReps = async () => {
      try {
        setLoading(true); // Start loading
        const [north, south, east, west] = await Promise.all([
          axios.get(`${baseURL}cityreps/North`),
          axios.get(`${baseURL}cityreps/South`),
          axios.get(`${baseURL}cityreps/East`),
          axios.get(`${baseURL}cityreps/West`),
        ]);
        setNorthZone(north.data);
        setSouthZone(south.data);
        setEastZone(east.data);
        setWestZone(west.data);
      } catch (err) {
        console.error('Error fetching city reps:', err);
        setError('Failed to fetch city representatives.');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCityReps();
  }, [baseURL]);

  const renderZone = (zoneName, contacts) => (
    <div className="zone">
      <h2>{zoneName} Zone</h2>
      <div className="zone-name">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.cityRepID}>
              <p style={{ fontWeight: "600" }}>{contact.name}</p>
              <p>{contact.contact}</p>
            </div>
          ))
        ) : (
          <p>No representatives found</p>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading city representatives...</div>;
  if (error) return <div>{error}</div>;

  const TeamMember = ({ image, name, contact,zone }) => {
    return (
        <div className="home-container">
      <div className="profile-card">
        <div className="img">
          <img src={image} alt={name} />
        </div>
        <div className="caption">
          <h3>{name}</h3>
          <p>Contact: {contact}</p>
          <h2>{zone}</h2>
        </div>
      </div>
      </div>
    );
  };

  const teamMembers = [
    { id: 1, name: "Charvi Sri Koppisetti", contact: "123-54f456-7890", image:cv ,zone:"North Zone" },
    { id: 2, name: "Shubham Kumar Soni", contact: "987-654-3210", image:sk ,zone:"East Zone" },
    { id: 3, name: "Poojitha Reddy", contact: "555-555-5555", image:pj  ,zone:"South Zone"},
    { id: 4, name: "Varshini Sathineni", contact: "444-444-4444", image:vr  ,zone:"West Zone"},
    { id: 5, name: "Lalithkumar Banglore Sreenivasan ", contact: "333-333-3333", image:lb  ,zone:"North Zone"},
    { id: 6, name: "Jayant Kumar", contact: "222-222-2222", image:jk  ,zone:"West Zone"},
    { id: 7, name: "Ekshith sai Gunakar Pasala", contact: "111-111-1111", image:ek ,zone:"South Zone"},
  ];


  return (
    <div className="App">
      <Header />
      <div className="cityrp-main">
        <div className="navy">
          <h1>Contact Us</h1>
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

      <div className="home-container">
      {teamMembers.map((member) => (
        <TeamMember
          key={member.id}
          image={member.image}
          name={member.name}
          contact={member.contact}
          zone={member.zone}
        />
      ))}
    </div>

      <Footer />
    </div>
  );
};

export default Ct;
