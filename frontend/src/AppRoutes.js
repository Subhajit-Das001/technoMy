// AppRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Pages/Home/home';
import Pyp from './components/Pages/Pyp/Pyp';
import Technopedia from './components/Pages/Technopedia/technopedia';
import AboutUs from './components/Pages/AboutUs/aboutus';
import ContactUs from './components/Pages/ContactUs/contactus';

// import Ct from './components/Pages/ContactUs/ct.js';


import Login from './components/Pages/Login/login';
import Register from './components/Pages/Register/register';
//import Technothlon23Updates from './components/Pages/Technothlon2023/Updates/updates';
import SchoolReg from './components/Pages/SchoolRegister/SchoolReg';
import Technothlon23Updates from './components/Pages/Technothlon2023/Updates/updates';
import Feedback from './components/Pages/Feedback/feedback';
import Faqs from './components/Pages/FAQs/FAQs';
import Mains from './components/Pages/Mains/mains';
import KV_JNV from './components/Pages/KV_JNV/kvjnv';
import Videos from './components/Pages/Videos/Videos';
import LEDs from './components/Pages/LEDs/led';
import StudentLandingPage from './components/Pages/Student/StudentLandingPage/StudentLandingPage'
import RegisteredSchool from './components/Pages/Center/RegisteredSchool'
import TeamVerified from './components/Pages/SchoolRegister/VerifyTeam/teamVerified';
import PaymentConfirmed from './components/Pages/SchoolRegister/ConfirmPayment/paymentConfirmed';
import UserPortal from './components/Pages/UserPortal/mainside';
import AdmitCard from './components/Pages/Admitcard';
import Registration from './components/Pages/SchoolRegister/Registration'

// import ContestForm from './components/Pages/Contest/ContestForm.js'
// import Crew from './components/Pages/Crew/crew.js'



const AppRoutes = () => {
  return (
    <Routes>



      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/pyp" element={<Pyp />} />
      <Route path="/technopedia" element={<Technopedia />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/kvjnv" element={<KV_JNV />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/mains" element={<Mains />} />
      <Route path="/leds" element={<LEDs />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path='/registeredschool' element={<RegisteredSchool />} />
   <Route path='/studentlanding' element={<StudentLandingPage/>} /> 
         <Route
        path="/technothlon2023-updates"
        element={<Technothlon23Updates />}
      />
      <Route
        path="/technothlon2023-upload"
        element={<Technothlon23Updates />}
      />
      <Route
        path="/technothlon2023-registerations"
        element={<Technothlon23Updates />}
      />
      <Route path="/TeamRegistration" element={<Registration />} />

       {/* <Route path="/schoolregister" element={<SchoolReg />} />  */}

      <Route path="/dashboard" element={<Technothlon23Updates />} />
      <Route path="/teamverified" element={<TeamVerified />} />
      <Route path="/confirmPayment/:ciphertext" element={<PaymentConfirmed />} />
     {/* <Route path="/dashboard24" element={<Technothlon23Updates />}/> */}
      <Route path="/userportal" element={<UserPortal/>}/>
      <Route path="/Admitcard" element={<AdmitCard/>}/>
      {/* <Route path="/ContestForm" element={<ContestForm/>}/>
      <Route path="/Crew-Member" element={<Crew/>}/> */}

      {/* <Route path="/Ct" element={<Ct/>}/> */}


    </Routes>
  );
};

export default AppRoutes;
