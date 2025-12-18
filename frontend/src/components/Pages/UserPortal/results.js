import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti'; // <--- IMPORT THIS
import './result.css';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';

// ... (Keep your existing image imports and PDF styles) ...
// Import Images
import GoldHaut from '../../Assets/certificate/Gold_Hauts.png';
import SilverHaut from '../../Assets/certificate/Silver_Hauts.png';
import GoldJunior from '../../Assets/certificate/Gold_Juniors.png';
import SilverJunior from '../../Assets/certificate/Silver_Juniors.png';
import ParticipantHaut from '../../Assets/certificate/participation_Hauts.png';
import ParticipationJunior from '../../Assets/certificate/participation_Juniors.png';
import CityTopperHauts from '../../Assets/certificate/CITY_TOPPER_Hauts.png';
import CityTopperJuniors from '../../Assets/certificate/CITY_TOPPER_Juniors.png';

const styles = StyleSheet.create({
    // ... (Keep your existing styles)
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
    top: '48.3%',
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

const Results = () => {
  // ... (Keep your existing state)
  const [displayedName, setDisplayedName] = useState('');
  const [results, setResults] = useState('');
  const [user, setUser] = useState(null);
  const [certificateImage, setCertificateImage] = useState(GoldHaut);
  const [isCityTopper, setIsCityTopper] = useState(false);
  const [cityTopperImage, setCityTopperImage] = useState(null);

  // --- NEW STATE FOR CONFETTI ---
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  // Helper to detect window resize for confetti
  const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {
      window.addEventListener('resize', detectSize);
      return () => {
          window.removeEventListener('resize', detectSize);
      }
  }, []);

  // ... (Keep your existing useEffects for fetching user and results) ...
    // 1. Fetch User Details
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

  // 2. Fetch Results & Determine Normal Certificate
  useEffect(() => {
    if (user) {
        const commonRoll = user.rollNumber || user.roll;
        
        // Fetch Result Rank
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${baseURL}uploadcsv/results?rollNumber=${commonRoll}`, { withCredentials: true });
                const userData = response.data.user || { Rank: 'NA' };
                setResults(userData);
                
                // --- TRIGGER CELEBRATION IF RANK EXISTS ---
                if (userData.Rank && userData.Rank !== 'NA' && userData.Rank !== 'Disqualify') {
                    setShowConfetti(true);
                    // Optional: Stop confetti after 8 seconds to save performance
                    setTimeout(() => setShowConfetti(false), 8000); 
                }

            } catch (err) {
                console.log('Error fetching results:', err);
                setResults({ Rank: 'NA' });
            }
        };
        fetchResults();

        // Determine Normal Certificate Image
        if (commonRoll.startsWith('JRF')) {
            // Juniors Logic
             // We wait for 'results' to populate, but for image pre-load we can check logic inside the next useEffect
        }
    }
  }, [baseURL, user]);
  
  // ... (Keep your certificate logic useEffects) ...
    // 3. Set Normal Certificate Image when Results change
  useEffect(() => {
    if (results && user) {
      const { Rank } = results;
      const rollNumber = user.rollNumber || user.roll;

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

  // 4. Check City Topper Eligibility
  useEffect(() => {
    const checkCityTopper = async () => {
        if (!user) return;
        const rollNumber = user.rollNumber || user.roll;

        try {
            const response = await axios.get(`${baseURL}uploadcsv/results-table`);
            if (response.data.success) {
                const { cityToppersJuniors, cityToppersHauts } = response.data;
                
                // Check if user's roll number is in the lists
                const isJuniorTopper = cityToppersJuniors.find(student => student.rollNumber === rollNumber);
                const isHautTopper = cityToppersHauts.find(student => student.rollNumber === rollNumber);

                if (isJuniorTopper) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperJuniors);
                } else if (isHautTopper) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperHauts);
                }
            }
        } catch (err) {
            console.error("Error checking city topper status:", err);
        }
    };
    checkCityTopper();
  }, [user, baseURL]);

  if (!results || results.Rank === 'NA' || results.Rank === 'Disqualify') return null;

  // ... (Keep PDF Components) ...
    const CertificatePDF = ({ name, rank, bgImage }) => (
    <Document>
      <Page size={{ width: 1849, height: 1307 }} style={styles.page}>
        <Image src={bgImage} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        {/* Only show rank if it's NOT a City Topper cert (assuming City Topper cert doesn't need AIR printed) */}
        {rank && <Text style={styles.rank}>{rank}</Text>}
      </Page>
    </Document>
  );

  const handleButtonClick = (name) => {
    setDisplayedName(name);
  };


  return (
    <div className="results-container">
      
      {/* --- CONFETTI COMPONENT --- */}
      {showConfetti && (
        <Confetti 
            width={windowDimension.width} 
            height={windowDimension.height} 
            tweenDuration={1000}
            numberOfPieces={400} // Lots of confetti!
            gravity={0.2}
        />
      )}

      <div className="result-header mb-4">
        <h1 className='text'>TECHNOTHLON'25 RESULT</h1>
      </div>

      <div className="result-content text-center">
        <h2>Roll Number: {user?.roll || user?.rollNumber}</h2>
        
        {/* ADDED POP ANIMATION CLASS */}
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

        {/* Certificate Sections (No changes needed) */}
        <div className="certificate-section">
            <h3 className="text-xl mb-3 text-center">Participation / Merit Certificate</h3>
            <div className="result-btn-download">
            <PDFDownloadLink
                document={<CertificatePDF name={displayedName} rank={results.Rank} bgImage={certificateImage} />}
                fileName={`Certificate_${displayedName}.pdf`}
            >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download')}
            </PDFDownloadLink>
            </div>
        </div>

        {isCityTopper && (
            <div className="certificate-section mt-8">
                <h3 className="text-xl mb-3 text-center text-green-600 font-bold">🌟 City Topper Certificate 🌟</h3>
                <div className="result-btn-download city-topper-btn">
                    <PDFDownloadLink
                        document={<CertificatePDF name={displayedName} rank="" bgImage={cityTopperImage} />}
                        fileName={`CityTopper_${displayedName}.pdf`}
                    >
                        {({ loading }) => (loading ? 'Generating...' : 'Download ')}
                    </PDFDownloadLink>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Results;