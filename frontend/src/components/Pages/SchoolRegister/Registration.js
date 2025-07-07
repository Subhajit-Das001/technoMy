import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
import Loader from '../../design/loader/Loader';
import iitg2 from '../../Assets/img/iitg2.png';
import techniche from '../../Assets/img/technicheb.png';
import logo1 from '../../Assets/img/logo2.png';
import { MdEmail } from 'react-icons/md';
import { FaGlobe, FaInstagram } from 'react-icons/fa';
import ob from '../../Assets/img/ob.png';

import "./Registration.css";
import cityToId from "./cityToID.json";

import InstructionPanel from './InstructionPanel'


// Loader Component


const TeamReg = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api" : "http://localhost:3001/api";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/confirmPayment" : "http://localhost:3000/confirmPayment";
  const [team, setTeam] = useState({
    name1: "", email1: "", contact1: "", school1: "", name2: "", email2: "", contact2: "", school2: "", squad: "", language: "", mode: "online", country: "", state: "", city: "",view:"", password1: "", password2: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const allStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal","Ladakh", "Jammu & Kashmir", "Puducherry", "Lakshadweep", "Delhi", "Chandigarh", "Dadra and Nagar Haveli and Daman & Diu", "Andaman and Nicobar"
  ];
  const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See",
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State",
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay",
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
  ];
  



  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setTeam({ ...team, [name]: value });
  };





  const handleSquadChange = (e) => {
    const selectedSquad = e.target.value;
    setTeam({ ...team, squad: selectedSquad });
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setTeam({ ...team, language: selectedLanguage });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setTeam({ ...team, city: selectedCity });
  };
  const handleViewChange=(e)=>{
    const selectedView = e.target.value;
    setTeam({ ...team, view: selectedView });
  }

 
  const handleStateChange = (e) => {
    const value = e.target.value;
    setTeam({ ...team, state: value });
  };
  const handleCountryChange = (e) => {
    const value = e.target.value;
    setTeam({ ...team, country: value });
  };
  const handleSchool1Change = (e) => {
    const value = e.target.value;
    setTeam({ ...team, school1: value });
  };
  const handleSchool2Change = (e) => {
    const value = e.target.value;
    setTeam({ ...team, school2: value });
  };


  const filteredStates = allStates.filter((state) =>
    state.toLowerCase().includes(team.state.toLowerCase())
  );
  const filteredCountry = allCountries.filter((country) =>
    country.toLowerCase().includes(team.country.toLowerCase())
  );

  

  const filteredCities = Object.keys(cityToId).filter((city) =>
    city.toLowerCase().includes(team.city.toLowerCase())
  );


  const validateForm = () => {
    const requiredFields = ['name1', 'email1', 'contact1', 'name2', 'email2', 'contact2', 'password1', 'password2', 'school1','school2','view', 'city', 'state', 'country', 'squad', 'language'];

    for (const field of requiredFields) {
      if (!team[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }

    if (team.password1 !== team.password2) {
      alert("Passwords do not match");
      return false;
    }

    // Custom validation for city
    if (!Object.keys(cityToId).includes(team.city)) {
      alert("Please select a valid city from the dropdown");
      return false;
    }

    if (team.contact1.length !== 10 || team.contact2.length !== 10) {
      alert("Mobile numbers must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const postData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${baseURL}/register`, {
        ...team,
        password: team.password1,
      });

      if (res.data) {
        const {  rollNumber } = res.data;
        const redirectURL = redirectUrl + `/${rollNumber}`;
        setTimeout(() => {
          window.location.href = `https://www.meraevents.com/ticketWidget?eventId=262881&ucode=organizer&wcode=9063CD-9063CD-333333-9063CD-&theme=1&redirectUrl=` + redirectURL;
        }, 5000);
      } else {
        setIsLoading(false);
        window.alert("Team Registration Failed");
      }

    } catch (error) {
      setIsLoading(false);
      console.log(error);
      window.alert("Team Registration Failed")
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate(); // Add this hook
  
  // Add the click handler function
  const handleLogoClick = () => {
    navigate('/');
  };


  

  return (
    <div className="wrapper-reg">
      <div className="header-banner-reg">
        <div className="logo-container-reg">
          <img src={iitg2} alt="IIT Guwahati" className="institution-logo-reg" />
          <div className="ob-reg" style={{ backgroundImage: `url(${ob})` }}>
            <img 
              src={logo1} 
              alt="Technothlon" 
              className="main-logo-reg"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <img src={techniche} alt="Techniche" className="partner-logo-reg" />
        </div>
      </div>

      <div className="containe">
        {/* <Header/> */}

        {/* <div>
          <InstructionPanel/>
        </div> */}

        <h1 className="form-title">Student Registration Form</h1>
        <div style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          color: '#b71c1c',
          margin: '40px 0',
          fontWeight: 'bold',
          background: '#fff3e0',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}>
          Registration for Technothlon 2025 is closed now.
        </div>
        {/* <form onSubmit={postData}>
          <h2 className="section-title">Student Information 1</h2>
          <label htmlFor='name1'>Name:</label>
          <input type='text' autoComplete='off' name='name1' id='name1' placeholder='' required value={team.name1} onChange={handleInput} />
          
          <label htmlFor="full-name">Contact Information:</label>
          <input
            type="tel"
            autoComplete="off"
            name="contact1"
            id="contact1"
            required
            value={team.contact1}
            onChange={handleInput}
          />
          <label htmlFor="email1">Email:</label>
          <input
            type="email"
            autoComplete="off"
            name="email1"
            id="email1"
            required
            value={team.email1}
            onChange={handleInput}
          />
          <label htmlFor="school1">School:</label>
          <input
            type="text"
            autoComplete="off"
            name="school1"
            id="school1"
            required
            value={team.school1}
            onChange={handleSchool1Change}
          />
          <h2 className="section-title">Student Information 2</h2>
          <label htmlFor="full-name">Name:</label>
          <input
            type="text"
            id="name2"
            name="name2"
            required
            value={team.name2}
            onChange={handleInput}
          />
          <label htmlFor="full-name">Contact Information:</label>
          <input
            type="tel"
            autoComplete="off"
            name="contact2"
            id="contact2"
            required
            value={team.contact2}
            onChange={handleInput}
          />
          <label htmlFor="email1">Email:</label>
          <input
            type="email"
            autoComplete="off"
            name="email2"
            id="email2"
            required
            value={team.email2}
            onChange={handleInput}
          />
          <label htmlFor="school2">School:</label>
          <input
            type="text"
            autoComplete="off"
            name="school2"
            id="school2"
            required
            value={team.school2}
            onChange={handleSchool2Change}
          />
          <h2 className="section-title">Team Information</h2>
          <label htmlFor="squad">Choose your Squad:</label>
          <select
            name="squad"
            id="squad"
            onChange={handleSquadChange}
            value={team.squad}
            required
          >
            <option value="" disabled>
              Select Squad
            </option>
            <option value="Juniors">Juniors Squad</option>
            <option value="Hauts">Hauts Squad</option>
          </select>
          <label htmlFor="language">Language:</label>
          <select
            name="language"
            id="language"
            onChange={handleLanguageChange}
            value={team.language}
            required
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
      
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            name="country"
            id="country"
            list="countries"
            // placeholder="Country"
            required
            value={team.country}
            onChange={handleCountryChange}
          />
          <datalist id="countries">
            {filteredCountry.map((country, index) => (
              <option key={index} value={country} />
            ))}

          </datalist>
          
          <label htmlFor="state">State:</label>
          <input
            type="text"
            name="state"
            id="state"
            list="states"
            value={team.state}
            onChange={handleStateChange}
            required
          />
          <datalist id="states">
            {filteredStates.map((state, index) => (
              <option key={index} value={state} />
            ))}
          </datalist>

          
          <label htmlFor="city">City:</label>
          <input
            type="text"
            autoComplete="off"
            list="cities"
            name="city"
            id="city"
            placeholder="City"
            required
            value={team.city}
            onChange={handleCityChange}
          />
          <datalist id="cities">
            {filteredCities.map((cityName, index) => (
              <option key={index} value={cityName} />
            ))}
          </datalist>

          
          <label htmlFor='password1'></label>
          <input type='password' autoComplete='off' name='password1' id='password1' placeholder='Password' required value={team.password1} onChange={handleInput} />
          
          
          <input type='password' autoComplete='off' name='password2' id='password2' placeholder='Confirm Password' required value={team.password2} onChange={handleInput} />
          
      

          <label htmlFor="view">How did you hear about Technothlon:</label>
          <select
            name="view"
            id="view"
            onChange={handleViewChange}
            value={team.view}
            required
          >
            <option value="" disabled>
              Select 
            </option>
            <option value="Cityrep">Through City Representatives</option>
            <option value="School">Through Your School/Teacher</option>
            <option value="Friends">Through Friends or Family</option>
            <option value="Social Media">Through Social Media Platforms</option>
            <option value="Newspaper">Through Newspaper or Magazine</option>
            <option value="Website">Through the Official Technothlon Website</option>
            <option value="Already Participated">I Have Already Participated Before</option>
            <option value="Event">Through a Local Event/Workshop</option>
            <option value="Other">Other</option>
          </select>


          <button
            type="submit"
            className="form-submit"
            name="register"
            id="register"
          >
            Pay Now
          </button>
        </form> */}
        {isLoading && <Loader />}
      </div>

      <footer className="contact-footer-reg">
        <div className="contact-links-reg">
          <a href="mailto:technothlon@iitg.ac.in">
            <MdEmail className="footer-icon-reg" />
            <span>technothlon@iitg.ac.in</span>
          </a>
          <a href="https://technothlon.techniche.org.in">
            <FaGlobe className="footer-icon-reg" />
            <span>technothlon.techniche.org.in</span>
          </a>
          <a href="https://instagram.com/technothlon.iitg">
            <FaInstagram className="footer-icon-reg" />
            <span>technothlon.iitg</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default TeamReg;









