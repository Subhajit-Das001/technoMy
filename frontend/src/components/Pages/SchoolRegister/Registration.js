import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate,useSearchParams } from 'react-router-dom';
import Loader from '../../design/loader/Loader';
import iitg2 from '../../Assets/img/iitg2.png';
import techniche from '../../Assets/img/technicheb.png';
import logo1 from '../../Assets/img/logo2.png';
import { MdEmail } from 'react-icons/md';
import { FaGlobe, FaInstagram } from 'react-icons/fa';
import ob from '../../Assets/img/ob.png';

import "./Registration.css";
import cityToId from "./cityToID.json";

// Import the Instruction Panel
import InstructionPanel from './InstructionPanel';

const TeamReg = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api" : "http://localhost:3001/api";
  // console.log(baseURL);

  // 1. Existing Team State
  const [team, setTeam] = useState({
    name1: "",
    dob1: "",
    email1: "",
    confirmEmail1: "",
    contact1: "",
    school1: "",
    class1: "",

    name2: "",
    dob2: "",
    email2: "",
    confirmEmail2: "",
    contact2: "",
    school2: "",
    class2: "",
    squad: "",
    language: "",
    mode: "online",
    country: "",
    state: "",
    zone: "",
    city: "",
    view: "",
  });

  // 2. New State for Checkboxes
  const [agreements, setAgreements] = useState({
    readInstructions: false,
    confirmDetails: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();



  //--- Take Schools from URL automatically---
  useEffect(() => {
    const generalSchool = searchParams.get('school');
    const school1Param = searchParams.get('school1');
    const school2Param = searchParams.get('school2');

    if (generalSchool || school1Param || school2Param) {
      setTeam(prev => ({
        ...prev,
        // Uses individual params if provided, otherwise falls back to general 'school' param
        school1: school1Param || generalSchool || prev.school1,
        school2: school2Param || generalSchool || prev.school2,
      }));
    }
  }, [searchParams]);
  

  // --- Handlers ---


  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Logic to check if button should be enabled
  const isPayEnabled = agreements.readInstructions && agreements.confirmDetails;

  // Helper object for Zone Mapping
  const stateToZoneMap = {
    // North
    "Jammu & Kashmir": "North", // Note: Matches your allStates spelling if applicable, otherwise ensure exact match
    "Jammu and Kashmir": "North",
    "Ladakh": "North",
    "Himachal Pradesh": "North",
    "Punjab": "North",
    "Chandigarh": "North",
    "Haryana": "North",
    "Uttarakhand": "North",
    "Delhi": "North",
    "Uttar Pradesh": "North",
    "Bihar": "North",

    // South
    "Telangana": "South",
    "Andhra Pradesh": "South",
    "Karnataka": "South",
    "Kerala": "South",
    "Tamil Nadu": "South",
    "Puducherry": "South",
    "Andaman and Nicobar": "South", // Mapped "Islands" here
    "Lakshadweep": "South",         // Mapped "Islands" here

    // East
    "Jharkhand": "East",
    "Chhattisgarh": "East",
    "Odisha": "East",
    "West Bengal": "East",
    "Assam": "East",
    "Meghalaya": "East",
    "Manipur": "East",
    "Tripura": "East",
    "Mizoram": "East",
    "Nagaland": "East",
    "Arunachal Pradesh": "East",
    "Sikkim": "East",

    // West
    "Rajasthan": "West",
    "Madhya Pradesh": "West",
    "Gujarat": "West",
    "Maharashtra": "West",
    "Goa": "West",
    "Dadra and Nagar Haveli and Daman & Diu": "West"
  };
  

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    // Automatically determine zone, default to empty string if not found
    const determinedZone = stateToZoneMap[selectedState] || "";

    setTeam({
      ...team,
      state: selectedState,
      zone: determinedZone
    });
  };

  // ... (Keeping your countries array truncated for brevity, assume full list is here)
  const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "India", "United States of America",
    "United Kingdom", "Canada"
    // ... Include the rest of your countries list here
  ];

  // All Indian states and union territories
  const allStates = [
    "Jammu & Kashmir",
    "Jammu and Kashmir",
    "Ladakh",
    "Himachal Pradesh",
    "Punjab",
    "Chandigarh",
    "Haryana",
    "Uttarakhand",
    "Delhi",
    "Uttar Pradesh",
    "Bihar",
    "Telangana",
    "Andhra Pradesh",
    "Karnataka",
    "Kerala",
    "Tamil Nadu",
    "Puducherry",
    "Andaman and Nicobar",
    "Lakshadweep",
    "Jharkhand",
    "Chhattisgarh",
    "Odisha",
    "West Bengal",
    "Assam",
    "Meghalaya",
    "Manipur",
    "Tripura",
    "Mizoram",
    "Nagaland",
    "Arunachal Pradesh",
    "Sikkim",
    "Rajasthan",
    "Madhya Pradesh",
    "Gujarat",
    "Maharashtra",
    "Goa",
    "Dadra and Nagar Haveli and Daman & Diu"
  ];

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setTeam({ ...team, [name]: value });
  };

  const handleSquadChange = (e) => {
    setTeam({ ...team, squad: e.target.value });
  };

  const handleLanguageChange = (e) => {
    setTeam({ ...team, language: e.target.value });
  };

  const handleCityChange = (e) => {
    setTeam({ ...team, city: e.target.value });
  };

  const handleViewChange = (e) => {
    setTeam({ ...team, view: e.target.value });
  }


  const handleCountryChange = (e) => {
    setTeam({ ...team, country: e.target.value });
  };

  const handleSchool1Change = (e) => {
    setTeam({ ...team, school1: e.target.value });
  };

  const handleSchool2Change = (e) => {
    setTeam({ ...team, school2: e.target.value });
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const requiredFields = [
      'name1', 'dob1', 'email1', 'confirmEmail1', 'contact1', 'school1', 'class1', // Added class1
      'name2', 'dob2', 'email2', 'confirmEmail2', 'contact2', 'school2', 'class2', // Added class2
      'view', 'city', 'state', 'country', 'squad', 'language'
    ];

    for (const field of requiredFields) {
      if (!team[field]) {
        alert(`Please fill in ${field.replace(/([A-Z0-9])/g, ' $1').trim()}`);
        return false;
      }
    }

    if (!isValidEmail(team.email1)) {
      alert("Please enter a valid email for Student 1 (must include @)");
      return false;
    }
    if (team.email1 !== team.confirmEmail1) {
      alert("Emails for Student 1 do not match");
      return false;
    }

    if (!isValidEmail(team.email2)) {
      alert("Please enter a valid email for Student 2 (must include @)");
      return false;
    }
    if (team.email2 !== team.confirmEmail2) {
      alert("Emails for Student 2 do not match");
      return false;
    }


    if (!Object.keys(cityToId).includes(team.city)) {
      alert("Please select a valid city from the dropdown");
      return false;
    }

    if (team.contact1.length !== 10 || team.contact2.length !== 10) {
      alert("Mobile numbers must be exactly 10 digits.");
      return false;
    }

    // Final security check for agreements (though button is disabled)
    if (!agreements.readInstructions || !agreements.confirmDetails) {
      alert("Please accept the instructions and confirm your details.");
      return false;
    }

    return true;
  };
  const postData = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Send data WITHOUT password
      const res = await axios.post(`${baseURL}/register`, team);

      if (res.data) {
        // USE THE BACKEND PROVIDED URL
        const { paymentUrl } = res.data;

        window.location.href = paymentUrl;
      } else {
        setIsLoading(false);
        window.alert("Team Registration Failed");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      window.alert("Team Registration Failed");
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Inline style object for the checkbox section container
  const checkboxSectionStyle = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    border: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center'
  };

  const checkboxRowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '500px'
  };

  return (
    <div className="wrapper-reg">

      {/* 3. Instruction Panel Popup */}

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
        <div className="header-left">
          <InstructionPanel />
        </div>
        <div className="form-header">

          <h1 className="form-title">Student Registration Form</h1>
          {/* Spacer div to help keep title perfectly centered if needed */}
          <div className="header-spacer"></div>
        </div>
        <form onSubmit={postData}>

          {/* STUDENT 1 SECTION */}
          <h2 className="section-title">Student Information 1</h2>

          <label htmlFor='name1'>Name:</label>
          <input type='text' autoComplete='off' name='name1' id='name1' required value={team.name1} onChange={handleInput} />

          <label htmlFor='dob1'>Date of Birth:</label>
          <input type='date' name='dob1' id='dob1' required value={team.dob1} onChange={handleInput} />

          <label htmlFor="contact1">Contact Information:</label>
          <input type="tel" autoComplete="off" name="contact1" id="contact1" required value={team.contact1} onChange={handleInput} />

          <label htmlFor="email1">Email:</label>
          <input type="email" autoComplete="off" name="email1" id="email1" required value={team.email1} onChange={handleInput} />

          <label htmlFor="confirmEmail1">Confirm Email:</label>
          <input type="email" autoComplete="off" name="confirmEmail1" id="confirmEmail1" placeholder="Re-enter email" required value={team.confirmEmail1} onChange={handleInput} onPaste={(e) => e.preventDefault()} />

          <label htmlFor="school1">School:</label>
          <input type="text" autoComplete="off" name="school1" id="school1" required value={team.school1} onChange={handleSchool1Change} readOnly={!!searchParams.get('school') || !!searchParams.get('school1')} style={ (searchParams.get('school') || searchParams.get('school1')) ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {} } />

          <label htmlFor="class1">Class:</label>
          <select name="class1" id="class1" required value={team.class1} onChange={handleInput}>
            <option value="" disabled>Select Class</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
          </select>

          {/* STUDENT 2 SECTION */}
          <h2 className="section-title">Student Information 2</h2>

          <label htmlFor="name2">Name:</label>
          <input type="text" id="name2" name="name2" required value={team.name2} onChange={handleInput} />

          <label htmlFor='dob2'>Date of Birth:</label>
          <input type='date' name='dob2' id='dob2' required value={team.dob2} onChange={handleInput} />

          <label htmlFor="contact2">Contact Information:</label>
          <input type="tel" autoComplete="off" name="contact2" id="contact2" required value={team.contact2} onChange={handleInput} />

          <label htmlFor="email2">Email:</label>
          <input type="email" autoComplete="off" name="email2" id="email2" required value={team.email2} onChange={handleInput} />

          <label htmlFor="confirmEmail2">Confirm Email:</label>
          <input type="email" autoComplete="off" name="confirmEmail2" id="confirmEmail2" placeholder="Re-enter email" required value={team.confirmEmail2} onChange={handleInput} onPaste={(e) => e.preventDefault()} />

          <label htmlFor="school2">School:</label>
          <input type="text" autoComplete="off" name="school2" id="school2" required value={team.school2} onChange={handleSchool2Change} readOnly={!!searchParams.get('school') || !!searchParams.get('school2')} style={ (searchParams.get('school') || searchParams.get('school2')) ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {} } />

          <label htmlFor="class2">Class:</label>
          <select name="class2" id="class2" required value={team.class2} onChange={handleInput}>
            <option value="" disabled>Select Class</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
          </select>

          {/* TEAM INFO SECTION */}
          <h2 className="section-title">Team Information</h2>
          <label htmlFor="squad">Choose your Squad:</label>
          <select name="squad" id="squad" onChange={handleSquadChange} value={team.squad} required>
            <option value="" disabled>Select Squad</option>
            <option value="Juniors">Juniors Squad</option>
            <option value="Hauts">Hauts Squad</option>
          </select>

          <label htmlFor="language">Language:</label>
          <select name="language" id="language" onChange={handleLanguageChange} value={team.language} required>
            <option value="" disabled>Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          <label htmlFor="country">Country:</label>
          <input type="text" name="country" id="country" list="countries" required value={team.country} onChange={handleCountryChange} />
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
            placeholder="Select State"  // Add placeholder here
            required
          />

          <datalist id="states">
            {filteredStates.map((state, index) => (
              <option key={index} value={state} />
            ))}
          </datalist>

          <label htmlFor="city">City:</label>
          <input type="text" autoComplete="off" list="cities" name="city" id="city" placeholder="City" required value={team.city} onChange={handleCityChange} />
          <datalist id="cities">
            {filteredCities.map((cityName, index) => (
              <option key={index} value={cityName} />
            ))}
          </datalist>


          <label htmlFor="view">How did you hear about Technothlon:</label>
          <select name="view" id="view" onChange={handleViewChange} value={team.view} required>
            <option value="" disabled>Select</option>
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

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              name="readInstructions"
              checked={agreements.readInstructions}
              onChange={handleAgreementChange}
              style={{ width: '20px', height: '20px' }}
            />
            <span>I have read the instructions carefully <span style={{ color: 'red' }}>*</span></span>
          </label>

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              name="confirmDetails"
              checked={agreements.confirmDetails}
              onChange={handleAgreementChange}
              style={{ width: '20px', height: '20px' }}
            />
            <span>I confirm my details (name, email) are correct and cannot be changed later <span style={{ color: 'red' }}>*</span></span>
          </label>

          {/* 4. CHECKBOX AND PAY BUTTON SECTION */}
          <div style={checkboxSectionStyle} className="payment-confirmation-section">



            <p style={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '10px 0',
              fontSize: '16px'
            }}>
              IMPORTANT: Do NOT close the browser after payment. Please wait to be redirected back to our site to receive your Roll Number.
            </p>

            {/* The Submit/Pay Button */}
            <button
              type="submit"
              name="register"
              id="register"
              className={`form-submit ${isPayEnabled ? '' : 'disabled'}`}
              disabled={!isPayEnabled}
              style={{
                backgroundColor: isPayEnabled ? '' : '#cccccc', // Grey if disabled
                cursor: isPayEnabled ? 'pointer' : 'not-allowed',
                opacity: isPayEnabled ? 1 : 0.7
              }}
            >
              Pay Now
            </button>

          </div>

        </form>
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