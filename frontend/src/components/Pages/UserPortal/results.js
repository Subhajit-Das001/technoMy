import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './result.css';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';

// Import Images
import GoldHaut from '../../Assets/certificate/Gold_Hauts.png';
import SilverHaut from '../../Assets/certificate/Silver_Hauts.png';
import GoldJunior from '../../Assets/certificate/Gold_Juniors.png';
import SilverJunior from '../../Assets/certificate/Silver_Juniors.png';
import ParticipantHaut from '../../Assets/certificate/participation_Hauts.png';
import ParticipationJunior from '../../Assets/certificate/participation_Juniors.png';
import CityTopperHauts from '../../Assets/certificate/CITY_TOPPER_Hauts.png';
import CityTopperJuniors from '../../Assets/certificate/CITY_TOPPER_Juniors.png';

// --- STYLE 1: STANDARD CERTIFICATE STYLES ---
const standardStyles = StyleSheet.create({
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
    width: '100%',
    height: 'auto',
  },
  name: {
    position: 'absolute',
    top: '48.5%',
    transform: 'translate(-50%, -50%)',
    fontSize: 48,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rank: {
    position: 'absolute',
    top: '64.5%',
    left: '47.7%',
    transform: 'translate(-50%, -50%)',
    fontSize: 40,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

// --- STYLE 2: CITY TOPPER SPECIFIC STYLES ---
const cityTopperStyles = StyleSheet.create({
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
    width: '100%',
    height: 'auto',
  },
  name: {
    position: 'absolute',
    top: '48.8%',          
    left: '43%',         
    transform: 'translate(-50%, -50%)',
    fontSize: 48,      // Standard Font Size
    fontWeight: 'bold', // Standard Bold
    color: '#000',
  },
  cityName: {
    position: 'absolute',
    top: '65%',          
    left: '40%',         
    transform: 'translate(-50%, -50%)',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000', 
    textTransform: 'uppercase'
  }
  // Rank style completely removed
});

const Results = () => {
  const [displayedName, setDisplayedName] = useState('');
  const [results, setResults] = useState('');
  const [user, setUser] = useState(null);
  
  // Normal Certificate State
  const [certificateImage, setCertificateImage] = useState(GoldHaut);
  
  // City Topper State
  const [isCityTopper, setIsCityTopper] = useState(false);
  const [cityTopperImage, setCityTopperImage] = useState(null);
  const [cityTopperDetails, setCityTopperDetails] = useState({ city: '' });

  // Confetti State
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {
      window.addEventListener('resize', detectSize);
      return () => {
          window.removeEventListener('resize', detectSize);
      }
  }, []);

  // 1. Fetch User
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}uploadcsv/user`, { withCredentials: true });
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        setDisplayedName(fetchedUser.name1);
      } catch (err) {
        console.log('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, [baseURL]);

  // 2. Fetch Results
  useEffect(() => {
    if (user) {
        const commonRoll = user.rollNumber || user.roll;
        
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${baseURL}uploadcsv/results?rollNumber=${commonRoll}`, { withCredentials: true });
                const userData = response.data.user || { Rank: 'NA' };
                setResults(userData);
                
                if (userData.Rank && userData.Rank !== 'NA' && userData.Rank !== 'Disqualify') {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 8000); 
                }

            } catch (err) {
                console.log('Error fetching results:', err);
                setResults({ Rank: 'NA' });
            }
        };
        fetchResults();
    }
  }, [baseURL, user]);

  // 3. Determine Standard Certificate Image
  useEffect(() => {
    if (results && user) {
      const { Rank } = results;
      const rollNumber = user.rollNumber || user.roll;

      if (rollNumber.startsWith('JR')) {
        if (Rank <= 25) setCertificateImage(GoldJunior);
        else if (Rank > 25 && Rank <= 225) setCertificateImage(SilverJunior);
        else setCertificateImage(ParticipationJunior);
      } else if (rollNumber.startsWith('HE')) {
        if (Rank <= 25) setCertificateImage(GoldHaut);
        else if (Rank > 25 && Rank <= 225) setCertificateImage(SilverHaut);
        else setCertificateImage(ParticipantHaut);
      }
    }
  }, [results, user]);

  // 4. Check City Topper Eligibility
  useEffect(() => {
    const checkCityTopper = async () => {
        if (!user) return;
        const rollNumber = user.rollNumber || user.roll;

        try {
            const response = await axios.get(`${baseURL}uploadcsv/results-table`);
            if (response.data.success) {
                const { cityToppersJuniors, cityToppersHauts } = response.data;
                
                const juniorStudent = cityToppersJuniors.find(student => student.rollNumber === rollNumber);
                const hautStudent = cityToppersHauts.find(student => student.rollNumber === rollNumber);

                if (juniorStudent) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperJuniors);
                    setCityTopperDetails({ city: juniorStudent.city });
                } else if (hautStudent) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperHauts);
                    setCityTopperDetails({ city: hautStudent.city });
                }
            }
        } catch (err) {
            console.error("Error checking city topper status:", err);
        }
    };
    checkCityTopper();
  }, [user, baseURL]);

  if (!results || results.Rank === 'NA' || results.Rank === 'Disqualify') return null;

  // --- PDF COMPONENT 1: STANDARD ---
  const StandardCertificatePDF = ({ name, rank, bgImage }) => (
    <Document>
      <Page size={{ width: 1849, height: 1307 }} style={standardStyles.page}>
        <Image src={bgImage} style={standardStyles.image} />
        <Text style={standardStyles.name}>{name}</Text>
        {rank && <Text style={standardStyles.rank}>{rank}</Text>}
      </Page>
    </Document>
  );

  // --- PDF COMPONENT 2: CITY TOPPER (No Rank) ---
  const CityTopperCertificatePDF = ({ name, city, bgImage }) => (
    <Document>
      <Page size={{ width: 1849, height: 1307 }} style={cityTopperStyles.page}>
        <Image src={bgImage} style={cityTopperStyles.image} />
        
        {/* Name */}
        <Text style={cityTopperStyles.name}>{name}</Text>
        
        {/* City Name */}
        <Text style={cityTopperStyles.cityName}>{city}</Text>
      </Page>
    </Document>
  );

  const handleButtonClick = (name) => {
    setDisplayedName(name);
  };

  return (
    <div className="results-container">
      
      {showConfetti && (
        <Confetti 
            width={windowDimension.width} 
            height={windowDimension.height} 
            tweenDuration={1000}
            numberOfPieces={400}
            gravity={0.2}
        />
      )}

      <div className="result-header mb-4">
        <h1 className='text'>TECHNOTHLON'25 RESULT</h1>
      </div>

      <div className="result-content text-center">
        <h2>Roll Number: {user?.roll || user?.rollNumber}</h2>
        <p className="congrats-message pop-animation">
            Congratulations! You have secured
        </p>
        <h3 className="rank-display">AIR: <span>{results.Rank}</span></h3>
      </div>

      <div className='mt-10 w-full flex flex-col items-center'>
        <h2 className='text-2xl text-center mb-4'>Select Name for Certificate</h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={() => handleButtonClick(user.name1)} 
            className={`name-button ${displayedName === user.name1 ? 'clicked' : ''}`}
          >
            {user.name1}
          </button>
          <button 
            onClick={() => handleButtonClick(user.name2)} 
            className={`name-button ${displayedName === user.name2 ? 'clicked' : ''}`}
          >
            {user.name2}
          </button>
        </div>

        {/* --- SECTION 1: Standard Certificate --- */}
        <div className="certificate-section">
            {/* <h3 className="text-xl mb-3 text-center"> Merit Certificate</h3> */}
            <div className="result-btn-download">
            <PDFDownloadLink
                document={
                    <StandardCertificatePDF 
                        name={displayedName} 
                        rank={results.Rank} 
                        bgImage={certificateImage} 
                    />
                }
                fileName={`Certificate_${displayedName}.pdf`}
            >
                {({ loading }) => (loading ? 'Generating...' : 'Download')}
            </PDFDownloadLink>
            </div>
        </div>

        {/* --- SECTION 2: City Topper Certificate --- */}
        {isCityTopper && cityTopperDetails.city && (
            <div className="certificate-section mt-8">
                <h3 className="text-xl mb-3 text-center text-green-600 font-bold">🌟 City Topper Certificate 🌟</h3>
                <div className="result-btn-download city-topper-btn">
                    <PDFDownloadLink
                        document={
                            <CityTopperCertificatePDF 
                                name={displayedName || "Student"} 
                                city={cityTopperDetails.city}
                                bgImage={cityTopperImage} 
                            />
                        }
                        fileName={`CityTopper_${displayedName}.pdf`}
                    >
                        {({ loading }) => (loading ? 'Generating...' : 'Download')}
                    </PDFDownloadLink>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Results;