import React, { useState, useEffect } from 'react';
import Profile from './profile';
import SignOut from './signout';
import Updates from './updates';
import Technoped from './technoped';
import techno from "../../Assets/techno-owl.png";
import bluetechno from "../../Header/Blue_technologo.png";
import admin from '../../Assets/img/icon-admin.png';
import hat from '../../Assets/img/icno-hat.png';
import signout from '../../Assets/img/icon-signout.png';
import add from '../../Assets/img/Add-icon.png';
import { useNavigate } from 'react-router-dom';
import Results from './results';
import axios from 'axios';
import './side.css';

const UserPortal = () => {
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth < 750);
    const [sidePanel, setSidePanel] = useState(screenWidth ? false : true);

    // Retrieve the selected section from localStorage when component mounts
    useEffect(() => {
        const savedSection = localStorage.getItem('selectedSection');
        if (savedSection) {
            setSelectedSection(savedSection);
            setActiveSection(savedSection);
        } else {
            // Default to Profile if no section is saved
            setSelectedSection('Profile');
            setActiveSection('Profile');
        }
    }, []);

    // Save selected section to localStorage whenever it changes
    useEffect(() => {
        if (selectedSection) {
            localStorage.setItem('selectedSection', selectedSection);
        }
    }, [selectedSection]);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        setActiveSection(section);
    };

    const list = [
        { title: 'Profile', img: admin }, 
        { title: 'Updates', img: add }, 
        { title: 'Results', img: hat }, 
    ];

    return (
        <div className="user-main">
            <div className="user-side" style={{ width: sidePanel ? '25vw' : '8vw' }}>
                <div className='hamburger-lines' style={{ left: sidePanel ? '25vw' : '8vw', position: 'absolute' }}
                    onClick={() => { setSidePanel(!sidePanel) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke='black' className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                <div className="blue-techno"><img src={bluetechno} alt="" /></div>
                <div className='side-panel-wrapper'>
                    <div className="techno-img"><img src={techno} alt="" style={{ width: sidePanel ? '80%' : '80px' }} /></div>
                    <div className='page-cont'>
                        {(sidePanel && screenWidth) ? (
                            <div className='nav'>
                                MAIN NAVIGATION
                            </div>
                        ) : ('')}
                        {
                            list.map(item => (
                                <div 
                                    key={item.title}
                                    className={activeSection === item.title ? `${item.title} active navLi` : `${item.title} navLi`}
                                    style={{ display: 'flex', justifyContent: sidePanel ? 'left' : 'center', paddingLeft: sidePanel ? '8%' : '0%' }}
                                    onClick={() => handleSectionClick(item.title)}
                                >
                                    <img src={item.img} alt={item.title} />
                                    {sidePanel ? `${item.title}` : ''}
                                </div>
                            ))
                        }
                        <div 
                            className={activeSection === 'SignOut' ? 'SignOut active navLi' : 'SignOut navLi'}
                            style={{ display: 'flex', justifyContent: sidePanel ? 'left' : 'center', paddingLeft: sidePanel ? '8%' : '0%' }}
                            onClick={() => handleSectionClick('SignOut')}
                        >
                            <img src={signout} alt="Sign Out" />{sidePanel ? 'Sign Out' : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-disp" style={{ width: sidePanel ? '75vw' : '92vw' }}>
                <User selectedSection={selectedSection} />
            </div>
        </div>
    );
};

const User = ({ selectedSection }) => {
    return (
        <div>
            {selectedSection === 'Profile' && <Profile />}
            {selectedSection === 'Updates' && <Updates />}
            {selectedSection === 'SignOut' && <SignOut />}
            {selectedSection==='Results' && <Results/>}
          
        </div>
    );
};

export default UserPortal;
