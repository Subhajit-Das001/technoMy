import { useState, useEffect } from 'react';
import axios from 'axios'; // Add axios import
import { useNavigate } from 'react-router-dom';
import iitg2 from '../../Assets/img/iitg2.png';
import { MdEmail } from 'react-icons/md';
import { FaGlobe, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import ob from '../../Assets/img/ob.png';
import techniche from '../../Assets/img/technicheb.png';
import logo from '../../Assets/img/text_logo.png';
import logo1 from '../../Assets/img/logo2.png';

import './CenterTable.css';


const CenterTable = () => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/center-list`);
                setCenters(response.data);
                // Log the entire response to check the data structure
                console.log('Centers data:', response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching centers:', error);
                setError('Failed to load centers');
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, [baseURL]);

    if (loading) return <div className="loading">Loading centers...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!centers.length) return <div className="no-data">No centers available</div>;

    return (
        <div className="center-table-container">
            <table className="center-table">
                <thead>
                    <tr>
                        <th>Center Name</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {centers.map((center) => (
                        <tr key={center._id}>
                            <td data-label="Center Name">
                                <a href={center.link} target="_blank" rel="noopener noreferrer">
                                    {center.name}
                                </a>
                            </td>
                            <td data-label="City">{center.city}</td>
                            <td data-label="State">{center.state}</td>
                            <td data-label="Location">
                                {center.location ? (
                                    <a 
                                        href={center.location} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="location-link"
                                    >
                                        <FaMapMarkerAlt className="location-icon" /> 
                                    </a>
                                ) : (
                                    <span className="no-location">N/A</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TechnothonCenterList = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="technothlon-container">
            <div className="header-banner">
                <div className="logo-container">
                    <img src={iitg2} alt="IIT Guwahati" className="institution-logo" />
                    <div className="ob" style={{ backgroundImage: `url(${ob})` }}>
                        <img 
                            src={logo1} 
                            alt="Technothlon" 
                            className="main-logo"
                            onClick={handleLogoClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <img src={techniche} alt="Techniche" className="partner-logo" />
                </div>
            </div>

            <div className="content-section">
                <div className="content-wrapper">
                    <h1 className="page-title">Examination Centers</h1>
                    <p className="description">
                        Below is the list of centers where Technothlon 2025 examination will be conducted.
                        <span className="important-note">
                             These are the centers finalized so far. Many more are yet to be confirmed.
                        </span>
                    </p>
                    <CenterTable />
                
                </div>
            </div>

            <footer className="contact-footer">
                <div className="contact-links">
                    <a href="mailto:technothlon@iitg.ac.in">
                        <MdEmail className="footer-icon" />
                        <span>technothlon@iitg.ac.in</span>
                    </a>
                    <a href="https://technothlon.techniche.org.in">
                        <FaGlobe className="footer-icon" />
                        <span>technothlon.techniche.org.in</span>
                    </a>
                    <a href="https://instagram.com/technothlon.iitg">
                        <FaInstagram className="footer-icon" />
                        <span>technothlon.iitg</span>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default TechnothonCenterList;