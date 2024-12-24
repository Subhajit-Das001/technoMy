import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './result.css';
import { Link } from 'react-router-dom';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';

import GoldHaut from '../../Assets/certificate/Gold_Hauts.png';
import SilverHaut from '../../Assets/certificate/Silver_Hauts.png';
import GoldJunior from '../../Assets/certificate/Gold_Juniors.png';
import SilverJunior from '../../Assets/certificate/Silver_Juniors.png';
import ParticipantHaut from '../../Assets/certificate/participation_Hauts.png';
import ParticipationJunior from '../../Assets/certificate/participation_Juniors.png';

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  image: {
    width: '100%', // Full width to maintain aspect ratio
    height: 'auto',
  },
  name: {
    position: 'absolute',
    top: '48.3%', // Adjust as necessary
    transform: 'translate(-50%, -50%)',
    fontSize: 48, // Font size for the name
    color: '#000', // Text color
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rank: {
    position: 'absolute',
    top: '64.5%', // Adjust as necessary to ensure it's visible below the name
    left: '47.7%',
    transform: 'translate(-50%, -50%)',
    fontSize: 40, // Font size for the rank
    color: '#000', // Text color
    textAlign: 'center',
    fontWeight: 'bold', // You can change this to bold if needed
  },
});

const Results = () => {
  const [displayedName, setDisplayedName] = useState('');
  const [results, setResults] = useState('');
  const [user, setUser] = useState(null);
  const [certificateImage, setCertificateImage] = useState(GoldHaut);
  const [selectedButton, setSelectedButton] = useState(null);

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}uploadcsv/user`, {
           withCredentials: true });
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        try{
          console.log(fetchedUser)
        }
        catch (err) {
          console.log('Error fetching user rank details:', err);
        }
        setDisplayedName(fetchedUser.name1);
      } catch (err) {
        console.log('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, [baseURL]);


  useEffect(() => {
    if (user) {
        const commonRoll = user.roll || user.rollNumber; // Create common variable
        const fetchResults = async () => {
            try {
                // Fetch results using the common roll
                const response = await axios.get(`${baseURL}uploadcsv/results?Roll=${commonRoll}`, { withCredentials: true });
                setResults(response.data.user || { Rank: 'NA' });
            } catch (err) {
                setResults({ Rank: 'NA' });
                console.log('Error fetching results:', err);
                
            }
        };
        fetchResults();
    }
}, [baseURL, user]);

  // Update certificate image based on user rank and roll
  useEffect(() => {
    if (results && user) {
      const { Rank } = results;
      //const rollNumber = user.roll;
    const rollNumber = user.roll || user.rollNumber; // Use the common roll here as well


      if (rollNumber.startsWith('JRF')) {
        if (Rank <= 25) setCertificateImage(GoldJunior);
        else if (Rank > 25 && Rank <= 225) setCertificateImage(SilverJunior);
        else setCertificateImage(ParticipationJunior);
      } else if (rollNumber.startsWith('HEF')) {
        if (Rank <= 25) setCertificateImage(GoldHaut);
        else if (Rank > 25 && Rank <= 225) setCertificateImage(SilverHaut);
        else setCertificateImage(ParticipantHaut);
      }
    }
  }, [results, user]);

  // Conditionally render PDF download link if rank is valid
  if (!results || results.Rank === 'NA' || results.Rank === 'Disqualify') return null;

  const CertificatePDF = ({ name, rank }) => (
    <Document>
      <Page size={{ width: 1849, height: 1307 }} style={styles.page}>
        <Image src={certificateImage} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rank}>{rank}</Text>
      </Page>
    </Document>
  );

  const handleButtonClick = (name) => {
    setDisplayedName(name);
    setSelectedButton(name);
  };

  return (
    <div className="results-container flex flex-col items-center justify-center min-h-screen"> {/* Centering styles */}
      <div className="result-header mb-4"> {/* Added margin for spacing */}
        <h1 className='text'>TECHNOTHLON'24 RESULT</h1>
      </div>

      <div className="result-content text-center"> {/* Centering the text */}
        <h2>Roll Number: {user.roll||user.rollNumber}</h2>
        <p className="congrats-message">Congratulations! You have secured</p>
        <h3 className="rank-display">AIR: <span>{results.Rank}</span></h3>
      </div>

      <div className='mt-10'>
        <h2 className='text-2xl text-center'>Download Your Certificate</h2>

        <div className="flex justify-center space-x-4 mt-5">
          <button 
            onClick={() => handleButtonClick(user.name1)} 
            className='name-button'
          >
            {user.name1}
          </button>
          <button 
            onClick={() => handleButtonClick(user.name2)} 
            className='name-button'
          >
            {user.name2}
          </button>
        </div>
        
        <div className="btn-download mt-10">
          <PDFDownloadLink
            document={<CertificatePDF name={displayedName} rank={results.Rank} />}
            fileName="Certificate.pdf"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download Certificate')}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Results;