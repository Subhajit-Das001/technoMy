// AppRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Pages/Home/home';
import Pyp from './components/Pages/Pyp/Pyp';
// import Technopedia from './components/Pages/Technopedia/technopedia';
import AboutUs from './components/Pages/AboutUs/aboutus';
import ContactUs from './components/Pages/ContactUs/contactus';

import Cityreplogin from './components/Pages/cityrep/cityreplogin';
import Cityrep_Portal from './components/Pages/cityrep/cityrep_portal';

import Leaderboard from './components/Pages/Contest/Leaderboard';


import Login from './components/Pages/Login/login';
import Register from './components/Pages/Register/register';
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


import Contestlogin from './components/Pages/Contest/contest_login';
import Contest from './components/Pages/Contest/Contest';
import Question from './components/Pages/Contest/question';
import TechnopediaLogin from './components/Pages/Technopedia/technopedia_login';
import Technopedia from './components/Pages/Technopedia/technopedia';
import TechnopediaQuestion from './components/Pages/Technopedia/technopedia-question';

import CenterTable from './components/Pages/Center/CenterTable';
import Merch from './components/Pages/Merch/merch';

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

      <Route path="/dashboard" element={<Technothlon23Updates />} />
      <Route path="/teamverified" element={<TeamVerified />} />
      <Route path="/confirmPayment/:ciphertext" element={<PaymentConfirmed />} />
      <Route path="/userportal" element={<UserPortal/>}/>
      <Route path="/Admitcard" element={<AdmitCard/>}/>
     
      <Route path="/cityreplogin" element={<Cityreplogin />} />
      <Route path="/cityrep_portal" element={<Cityrep_Portal />} />

      {/* Contest Routes */}
      <Route path="/contest/login" element={<Contestlogin />} />
      <Route path="/contest" element={<Contest />} />
      <Route path="/contest/:id/:letter" element={<Question />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/center-list" element={<CenterTable />} />
      <Route path="/technopedia-login" element={<TechnopediaLogin />} />
      <Route path="/technopedia" element={<Technopedia />} />
      <Route path="/techno/:id/:letter" element={<TechnopediaQuestion />} />
      <Route path="/Technothlon-Merch" element={<Merch/>} />

       </Routes>
  );
};

export default AppRoutes;
