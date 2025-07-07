import './home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import  HeroImg  from "./HeroImgD.png"
import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";
import HautsTheme from "../../Assets/img/Hautstheme.png";
import JuniorTheme from "../../Assets/img/Juniorstheme.png";
import Prize1 from "../../Assets/img/prizes1.png";
import Prize2 from "../../Assets/img/prizes2.png";
import Prize3 from "../../Assets/img/prizes3.png";
import Laptop from "../../Assets/img/laptop.png";
import Results from "../../Assets/img/Results.png";
import IITG from "../../Assets/img/iitg.png";
import AboutUs from "../../Assets/img/AboutUs.png";
import LED from "../../Assets/img/LED.png";
import Mains from "../../Assets/img/Mains.png";
import Pedia from "../../Assets/img/Pedia.png";
import Technoped from "../../Assets/coin.png";
import Logo from '../../Assets/technologo.png'
import Text from "../../design/text"
import Birb from '../../Assets/Birb.png'
import Events from '../../design/events'
import Stats from "../../design/stats/states"
import Announcement from '../../Pages/Announcement/announcement';

import TREX from '../../Assets/img/trex.jpeg';
import Ednite from '../../Assets/img/ednite.png'


const stopMarquee = () => {
      document.querySelector('.floating-notice marquee').stop();
    };
  
    const startMarquee = () => {
      document.querySelector('.floating-notice marquee').start();
    };

function Home() {
  const prizeImages = document.querySelectorAll('.prize-img');

prizeImages.forEach(img => {
  img.addEventListener('click', () => {
    prizeImages.forEach(otherImg => {
      otherImg.classList.remove('active');
    });
    img.classList.add('active');
  });
});






    return (
    <div className="App">
      <Header />
      <div className="floating-notice" style={{backgroundColor: "yellow"}}>
      <marquee behavior="scroll" direction="left" onMouseOver={stopMarquee} onMouseOut={startMarquee} >
  <p>The wait is over! Admit Card for Technothlon 2025 is live now!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
  

</marquee>

    </div>

    <div className="splash-screen">
      <div className="divbig">
      <div className="Heading-Hero">
        The Ultimate Test of Logic
        {/* <Text/> */}
      </div>
      <div className="SubHeading-Hero">
      Technothlon is an international school championship organized entirely by its student community. Renowned as one of the largest events of its kind, it began its journey in 2004 and has grown tremendously, attracting thousands of students every year.

        {/* Technothlon is an international school championship organized by the student fraternity of IIT Guwahati. Technothlon was started with a group of students in a small room in 2004 to inspire young minds. */}
      </div>


      
      <div className="center">
          <div className="check-center">Click here for viewing Registered Centers
          <Link  to='/center-list'><button className='btn1'>Centers</button></Link>
          </div>
          
      </div> 
      </div>
      <div className="Hero-img">
        <img src={HeroImg}  />
      </div>
    </div>

    <div class="parent">
      <div>
        <Announcement/>
      </div>
  <div class="heading">
    <div class="main-headss">Check out last year's Prizes!</div>
  </div>
  <div class="image-container">
    <img class="prize-img " src={Prize1} alt="Prize-img" />
    <img class="prize-img" src={Prize2} alt="Invite" />
    <img class="prize-img" src={Prize3} alt="Invite" />
  </div>
</div>

    <div className="parent">
      <div className="heading">
        <div className="main-headss">Check out Last year's Themes!</div>
    </div>

    <div className="image-container">
    <img class="prize-imgg" src={HautsTheme} alt="Invite" />
    <img class="prize-imgg" src={JuniorTheme} alt="Invite" />
</div>
    </div>
    <div className="separator"></div>
    <div className="parent-slider">
<div className='statsclass'>
  <Stats/>
</div>
<div>
<h2 class="event-heading">Last Year's Events</h2>

</div>
<div className='events'>
          <Events/>
          </div>
          <div className="partners-section">
  <h4 className="partners-title">Our Official Partners for Technothlon 2025</h4>
  <div className="partners-list">
    <a href="https://www.ednite.com/" target="_blank" rel="noopener noreferrer" className="partner-card">
      <img src={Ednite} alt="EdNite Logo" className="partner-logo" />
      <div className="partner-info">
        {/* <div className="partner-name">EdNite</div> */}
        <div className="partner-role">Academic Partner</div>
      </div>
    </a>
    <a href="https://www.trexed.com/" target="_blank" rel="noopener noreferrer" className="partner-card">
      <img src={TREX} alt="TReX Logo" className="partner-logo" />
      <div className="partner-info">
        {/* <div className="partner-name">TReX</div> */}
        <div className="partner-role">Organising Partner</div>
      </div>
    </a>
  </div>
</div>


      <h4 className="h4-updates">RECENT UPDATES</h4>
      <div className="slick-update ">
        <a href="/center-list" className="update-card">
          <div className="update-card-icon">
            <img src={IITG} alt="IIT Guwahati Icon" />
          </div>
          <div className="update-card-content">
            <div style={{fontWeight: 'bold'}}>Admit card are out!</div>
            <div>Check now your center</div>
          </div>
        </a>
        {/* <a href="/technopedia-login" className="update-card">
          <div className="update-card-icon u1">
            <img src={Technoped} alt="Technopedia Icon" />
          </div>
          <div className="update-card-content">
            <div style={{fontWeight: 'bold'}}>Technopedia is available now.</div>
            <div>So check your IQ level!</div>
          </div>
        </a> */}
      </div>
    </div>
    <div className="parent-1">
        
          <div className="info-card">
            <img src={AboutUs} alt="About Us Image" className="about-us-image info-img"/>
            <div className="info-card-heading">About Us</div>
            <div className="info-card-content">
              Over the past 21 years we have expanded our reach to over 450+ cities all over India and various centers abroad.
            </div>
            <a href="/aboutus"> Learn More </a>
          </div>
      
          <div className="info-card">
            <img src={Pedia} alt="Technopedia Image" className='info-img' />
            <div className="info-card-heading">Technopedia</div>
            <div className="info-card-content">
              Technopedia is the online module of Technothlon providing its students an ultimate experience of the prelims beforehand!
            </div>
            <a href="/technopedia"> Learn More </a>
          </div>
        
          <div className="info-card">
            <img src={Mains} alt="Mains Image" className='info-img'/>
            <div className="info-card-heading">PYQs</div>
            <div className="info-card-content">
            Look through our repository of past question papers to help you prepare for Technothlon 2025.
            </div>
            <a href="/pyp"> Learn More </a>
          </div>
         

          {/* <div className="info-card">
            <img src={Mains} alt="Mains Image" />
            <div className="info-card-heading">Mains</div>
            <div className="info-card-content">
              Mains is an event based competition which is conducted at IIT Guwahati, where the top 25 teams from each squad compete.
            </div>
            <a href="/mains"> Learn More </a>
          </div> */}
       
        
          {/* <div className="info-card">
            <img src={LED} alt="L.E.D. Image" />
            <div className="info-card-heading">L.E.D.</div>
            <div className="info-card-content">
              "Learn.Experience.Discover". Through this initiative, we demonstrate simple experiments to school students, to explain basic principles of science.
            </div>
            <a href="/leds"> Learn More </a>
        </div>*/}
        
    </div>
     <Footer /> 
    </div>
    );

  }
  
  export default Home;


