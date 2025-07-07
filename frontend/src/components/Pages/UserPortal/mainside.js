import React, { useState, useEffect } from 'react';
import Profile from './profile';
import SignOut from './signout';
import Updates from './updates';
// import Technoped from './technoped';
import techno from "../../Assets/techno-owl.png";
import bluetechno from "../../Header/Blue_technologo.png";
import admin from '../../Assets/img/icon-admin.png';
import hat from '../../Assets/img/icno-hat.png';
import signout from '../../Assets/img/icon-signout.png';
import add from '../../Assets/img/Add-icon.png';
import Ac from './ac.png';
import Chess from './chess.png'
import { useNavigate } from 'react-router-dom';
import Results from './results';
import axios from 'axios';
import './side.css';
import ChessGamePage from './ChessGamePage';
import AdmitCard from './admitcard';

const UserPortal = () => {
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
    const [sidePanel, setSidePanel] = useState(false); // Start with sidebar closed on mobile
    const [user, setUser] = useState(null);
    const [isChessFullscreen, setIsChessFullscreen] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const isSmallScreen = window.innerWidth < 750;
            setIsMobile(isSmallScreen);
            // Auto-close sidebar on mobile when resizing
            if (isSmallScreen) {
                setSidePanel(false);
            } else {
                setSidePanel(true);
            }
        };

        window.addEventListener('resize', handleResize);
        
        // Set initial state
        if (window.innerWidth >= 750) {
            setSidePanel(true);
        }
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        // Reset fullscreen mode when switching sections
        if (section !== 'Chess') {
            setIsChessFullscreen(false);
        }
        // Auto-collapse sidebar on mobile after selection
        if (isMobile) {
            setSidePanel(false);
        }
    };

    const handleChessFullscreenToggle = (isFullscreen) => {
        setIsChessFullscreen(isFullscreen);
    };

    const toggleSidebar = () => {
        setSidePanel(!sidePanel);
    };

    const list = [
        { title: 'Profile', img: admin }, 
        { title: 'Updates', img: add }, 
        { title: 'Results', img: hat }, 
        { title: 'Chess', img: Chess }, 
        { title: 'AdmitCard', img: Ac }
    ];

    return (
        <div className="user-main">
            {/* Hamburger menu button - Always visible on mobile */}
            {isMobile && !isChessFullscreen && (
                <div 
                    className='hamburger-menu-button' 
                    onClick={toggleSidebar}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke='black' className="hamburger-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
            )}

            {/* Sidebar */}
            {!isChessFullscreen && (
                <div 
                    className={`user-side ${isMobile ? 'mobile-sidebar' : ''} ${sidePanel ? 'sidebar-open' : 'sidebar-closed'}`}
                >
                    {/* Desktop hamburger button */}
                    {!isMobile && (
                        <div 
                            className='hamburger-lines desktop-hamburger' 
                            onClick={toggleSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke='black' className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>
                    )}

                    <div className="blue-techno">
                        <img src={bluetechno} alt="" />
                    </div>
                    <div className='side-panel-wrapper'>
                        <div className="techno-img">
                            <img 
                                src={techno} 
                                alt="" 
                                className="techno-owl-img"
                            />
                        </div>
                        <div className='page-cont'>
                            {list.map(item => (
                                <div 
                                    key={item.title}
                                    className={`${item.title} ${activeSection === item.title ? 'active' : ''} navLi`}
                                    onClick={() => handleSectionClick(item.title)}
                                >
                                    <img src={item.img} alt={item.title} />
                                    <span className="nav-text">{item.title}</span>
                                </div>
                            ))}
                            <div 
                                className={`SignOut ${activeSection === 'SignOut' ? 'active' : ''} navLi`}
                                onClick={() => handleSectionClick('SignOut')}
                            >
                                <img src={signout} alt="Sign Out" />
                                <span className="nav-text">Sign Out</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for mobile when sidebar is open */}
            {isMobile && sidePanel && !isChessFullscreen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidePanel(false)}
                />
            )}
            
            {/* Main content area */}
            <div 
                className={`user-disp ${isChessFullscreen ? 'fullscreen' : ''} ${isMobile ? 'mobile-content' : ''}`}
            >
                <User 
                    selectedSection={selectedSection} 
                    onChessFullscreenToggle={handleChessFullscreenToggle}
                    isChessFullscreen={isChessFullscreen}
                />
            </div>
        </div>
    );
};

const User = ({ selectedSection, onChessFullscreenToggle, isChessFullscreen }) => {
    return (
        <div>
            {selectedSection === 'Profile' && <Profile />}
            {selectedSection === 'Updates' && <Updates />}
            {selectedSection === 'SignOut' && <SignOut />}
            {selectedSection === 'Results' && <Results />}
            {selectedSection === 'Chess' && (
                <ChessGamePage 
                    onFullscreenToggle={onChessFullscreenToggle}
                    isFullscreen={isChessFullscreen}
                />
            )}
            {selectedSection === 'AdmitCard' && <AdmitCard />}
        </div>
    );
};

export default UserPortal;