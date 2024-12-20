import React from 'react';
import './teamVerified.css';
import Header from '../../../Header/header';
import Footer from '../../../Footer/footer';

const TeamVerified = () => {
  return (
    <div className="team-verified-container">
      <Header />
      {/* <div className="content"> */}
        <div className="message">
          <h1>Your team has been successfully registered and verified!</h1>
          <p>Congratulations! You are now officially part of the Technothlon.</p>
        {/* </div> */}
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default TeamVerified;
