// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Header from '../../Header/header';
// import Footer from '../../Footer/footer';
// import scroll from '../../Assets/img/scrolldown.png';
// import down from '../../Assets/img/down.png';
// import "./TeamRegister.css";
// import cityToId from "./cityToID.json";

// // Loader Component
// const Loader = () => (
//   <div className="loader">Loading...</div>
// );

// const TeamReg = () => {
//   const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api" : "http://localhost:3001/api";
//   const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/confirmPayment" : "http://localhost:3000/confirmPayment";
//   const [team, setTeam] = useState({
//     name1: "", email1: "", contact1: "", name2: "", email2: "", contact2: "", squad: "", language: "", mode: "online", country: "", state: "", city: "", school: "", password1: "", password2: ""
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   let name, value;
//   const handleInput = (e) => {
//     name = e.target.name;
//     value = e.target.value;
//     setTeam({ ...team, [name]: value });
//   };

//   const handleSquadChange = (e) => {
//     const selectedSquad = e.target.value;
//     setTeam({ ...team, squad: selectedSquad });
//   };

//   const handleLanguageChange = (e) => {
//     const selectedLanguage = e.target.value;
//     setTeam({ ...team, language: selectedLanguage });
//   };

//   const handleCityChange = (e) => {
//     const selectedCity = e.target.value;
//     setTeam({ ...team, city: selectedCity });
//   };

//   const allStates = [
//     "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//     "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//     "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//     "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
//     "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
//     "Uttar Pradesh", "Uttarakhand", "West Bengal"
//   ];

//   const handleStateChange = (e) => {
//     const value = e.target.value;
//     setTeam({ ...team, state: value });
//   };
//   const handleSchoolChange = (e) => {
//     const value = e.target.value;
//     setTeam({ ...team, school: value });
//   };

//   const filteredStates = allStates.filter((state) =>
//     state.toLowerCase().includes(team.state.toLowerCase())
//   );

//   const filteredCities = Object.keys(cityToId).filter((city) =>
//     city.toLowerCase().includes(team.city.toLowerCase())
//   );

//   const validateForm = () => {
//     const requiredFields = ['name1', 'email1', 'contact1', 'name2', 'email2', 'contact2', 'password1', 'password2', 'school', 'city', 'state', 'country', 'squad', 'language'];

//     for (const field of requiredFields) {
//       if (!team[field]) {
//         alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`);
//         return false;
//       }
//     }

//     if (team.password1 !== team.password2) {
//       alert("Passwords do not match");
//       return false;
//     }

//     // Custom validation for city
//     if (!Object.keys(cityToId).includes(team.city)) {
//       alert("Please select a valid city from the dropdown");
//       return false;
//     }

//     return true;
//   };

//   const postData = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await axios.post(`${baseURL}/register`, {
//         ...team,
//         password: team.password1,
//       });

//       if (res.data) {
//         const { randomString, rollNumber } = res.data;
//         const redirectURL = redirectUrl + `/${randomString}&${rollNumber}`;
//         setTimeout(() => {
//           window.location.href = 'https://www.meraevents.com/ticketWidget?eventId=260233&ucode=organizer&wcode=9063CD-9063CD-333333-9063CD-&theme=1&redirectUrl=' + redirectURL;
//         }, 5000);
//       } else {
//         setIsLoading(false);
//         window.alert("Team Registration Failed");
//       }

//     } catch (error) {
//       setIsLoading(false);
//       console.log(error);
//       window.alert("Team Registration Failed")
//     }
//   };

//   const [expanded, setExpanded] = useState(false);

//   const handleExpand = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <div className="App">
//       <Header />

//       <div className="registrations">
//      {/* <p>Online registration has now closed for 2025!</p>  */}
       
//        <div className="team-registration-form">
//           <div className={`reg-instr ${expanded ? 'expanded' : ''}`} onClick={handleExpand}>
//             <h2>INSTRUCTIONS</h2>
//             <ul>
//               <li>Teams must be comprised of students from the same squad and attending the same school.</li>
//               <li>All team members must be in grades 9th to 12th in the upcoming academic year 2024-25.</li>
//               <li>Only team registrations are accepted; individual registrations are not permitted.</li>
//               <li>Each mobile number can only register one team.</li>
//               <li>After filling the form click on "Pay Now" to proceed to the payment portal</li>
//               <li>Follow the instructions to make a successful payment and wait to be redirected back to Technothlon's portal</li>
//               <li>Upon redirection, check your email for a verification message then click on the verification link provided in the email.</li>
//               <li>A confirmation page will open, indicating successful registration.</li>
//               <li>Both participants will receive an email with their roll numbers.</li>
//               <li>Each team is required to purchase only one ticket.</li>
//               <li className='disclaimer'><b style={{ color: 'red' }}>Disclaimer:</b> Ensure all provided information is accurate. Any false information will result in immediate disqualification, without refund.</li>
//             </ul>
//           </div>
//           <div className={`reg ${expanded ? 'hidden' : ''}`}>
//             <h1 className='form-title'><b>REGISTER YOUR TEAM</b></h1>
//             <ul>Before filling out the form, please read the instructions carefully.</ul>
//             <form className='register-form' id='register-form' onSubmit={postData}>
//               <div className='form-group'>
//                 <label htmlFor='name1'>Name 1</label>
//                 <input type='text' autoComplete='off' name='name1' id='name1' placeholder='Name Of Participant' required value={team.name1} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='email1'>Email 1</label>
//                 <input type='email' autoComplete='off' name='email1' id='email1' placeholder='Email address' required value={team.email1} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='contact1'>Contact 1</label>
//                 <input type='tel' autoComplete='off' name='contact1' id='contact1' placeholder='Phone number' required value={team.contact1} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='name2'>Name 2</label>
//                 <input type='text' autoComplete='off' name='name2' id='name2' placeholder='Name Of Participant' required value={team.name2} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='email2'>Email 2</label>
//                 <input type='email' autoComplete='off' name='email2' id='email2' placeholder='Email address' required value={team.email2} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='contact2'>Contact 2</label>
//                 <input type='tel' autoComplete='off' name='contact2' id='contact2' placeholder='Phone number' required value={team.contact2} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='password1'>Create Your Password</label>
//                 <input type='password' autoComplete='off' name='password1' id='password1' placeholder='Password' required value={team.password1} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='password2'>Confirm Your Password</label>
//                 <input type='password' autoComplete='off' name='password2' id='password2' placeholder='Confirm Password' required value={team.password2} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='school'>School Name</label>
//                 <input type='text' autoComplete='off' name='school' id='school' placeholder='School Name' required value={team.school} onChange={handleSchoolChange} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='city'>City</label>
//                 <input type='text' autoComplete='off' list='cities' name='city' id='city' placeholder='City' required value={team.city} onChange={handleCityChange} />
//                 <datalist id='cities'>
//                   {filteredCities.map((cityName, index) => (
//                     <option key={index} value={cityName} />
//                   ))}
//                 </datalist>
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='state'>State</label>
//                 <input type="text" name="state" id="state" value={team.state} onChange={handleStateChange} list="states" className="form-control" placeholder='State' required />
//                 <datalist id="states">
//                   {filteredStates.map((state, index) => (
//                     <option key={index} value={state} />
//                   ))}
//                 </datalist>
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='country'>Country</label>
//                 <input type='text' autoComplete='off' name='country' id='country' placeholder='Country' required value={team.country} onChange={handleInput} />
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='squad'>Choose your Squad</label>
//                 <select name='squad' id='squad' onChange={handleSquadChange} value={team.squad} required>
//                   <option value="" disabled>Select Squad</option>
//                   <option value="Juniors">Juniors Squad</option>
//                   <option value="Hauts">Hauts Squad</option>
//                 </select>
//               </div>
//               <div className='form-group'>
//                 <label htmlFor='language'>Language</label>
//                 <select name='language' id='language' onChange={handleLanguageChange} value={team.language} required>
//                   <option value="" disabled>Select Language</option>
//                   <option value="English">English</option>
//                   <option value="Hindi">Hindi</option>
//                 </select>
//               </div>
//               <div className='form-button'>
//                 <button type='submit' className='form-submit' name='register' id='register'>Pay Now</button>
//               </div>
//             </form>
//             {isLoading && <Loader />}
//           </div>
//         </div> 
//       </div> 
//     </div>
//   );
// };

// export default TeamReg;
