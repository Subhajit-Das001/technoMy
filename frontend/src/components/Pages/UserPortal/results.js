import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import './result.css';

// Import Images
import GoldHaut from '../../Assets/certificate/Certificate_Techno_Gold_Hauts.png';
import SilverHaut from '../../Assets/certificate/Certificate_Techno_Silver_Hauts.png';
import GoldJunior from '../../Assets/certificate/Certificate_Techno_Gold_Juniors.png';
import SilverJunior from '../../Assets/certificate/Certificate_Techno_Silver_Juniors.png';
import BronzeHaut from '../../Assets/certificate/Certificate_Techno_Bronze_Hauts.png';
import BronzeJunior from '../../Assets/certificate/Certificate_Techno_Bronze_Juniors.png';
import ParticipantHaut from '../../Assets/certificate/Certificate_Techno_participation_Hauts.png';
import ParticipationJunior from '../../Assets/certificate/Certificate_Techno_participation_Juniors.png';
import CityTopperHauts from '../../Assets/certificate/State-Toppers-Hauts.png';
import CityTopperJuniors from '../../Assets/certificate/State-Toppers-Juniors.png';

// --- STYLES ---
const standardStyles = StyleSheet.create({
  page: { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 },
  image: { width: '100%', height: 'auto' },
  name: { position: 'absolute', top: '48.5%', transform: 'translate(-50%, -50%)', fontSize: 48, color: '#000', textAlign: 'center', fontWeight: 'bold' },
  rank: { position: 'absolute', top: '64.5%', left: '47.7%', transform: 'translate(-50%, -50%)', fontSize: 40, color: '#000', textAlign: 'center', fontWeight: 'bold' },
});

const cityTopperStyles = StyleSheet.create({
  page: { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 },
  image: { width: '100%', height: 'auto' },
  name: { position: 'absolute', top: '48.8%', left: '43%', transform: 'translate(-50%, -50%)', fontSize: 48, fontWeight: 'bold', color: '#000' },
  cityName: { position: 'absolute', top: '65%', left: '40%', transform: 'translate(-50%, -50%)', fontSize: 35, fontWeight: 'bold', color: '#000', textTransform: 'uppercase' }
});

const Results = () => {
  const [displayedName, setDisplayedName] = useState('');
  const [results, setResults] = useState('');
  const [user, setUser] = useState(null);
  const [certificateImage, setCertificateImage] = useState(GoldHaut);
  const [certCategory, setCertCategory] = useState('Participation');
  const [isCityTopper, setIsCityTopper] = useState(false);
  const [cityTopperImage, setCityTopperImage] = useState(null);
  const [cityTopperDetails, setCityTopperDetails] = useState({ state: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Reference for smooth scrolling
  const certificateRef = useRef(null);

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  const detectSize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
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
                setResults({ Rank: 'Not Announced' });
            }
        };
        fetchResults();
    }
  }, [baseURL, user]);

  // 3. Determine Standard Certificate Image & Category
  useEffect(() => {
    if (results && user) {
      const { Rank } = results;
      const rollNumber = user.rollNumber || user.roll;

      if (rollNumber.startsWith('JR')) {
        if (Rank <= 50) { setCertificateImage(GoldJunior); setCertCategory('Gold'); }
        else if (Rank > 50 && Rank <= 250) { setCertificateImage(SilverJunior); setCertCategory('Silver'); }
        else if (Rank > 250 && Rank <= 500) { setCertificateImage(BronzeJunior); setCertCategory('Bronze'); }
        else { setCertificateImage(ParticipationJunior); setCertCategory('Participation'); }
      } else if (rollNumber.startsWith('HE')) {
        if (Rank <= 50) { setCertificateImage(GoldHaut); setCertCategory('Gold'); }
        else if (Rank > 50 && Rank <= 250) { setCertificateImage(SilverHaut); setCertCategory('Silver'); }
        else if (Rank > 250 && Rank <= 500) { setCertificateImage(BronzeHaut); setCertCategory('Bronze'); }
        else { setCertificateImage(ParticipantHaut); setCertCategory('Participation'); }
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
                const { stateToppersJuniors, stateToppersHauts } = response.data;

const juniorStudent = stateToppersJuniors?.find(
  student => student.rollNumber === rollNumber
);

const hautStudent = stateToppersHauts?.find(
  student => student.rollNumber === rollNumber
);

                if (juniorStudent) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperJuniors);
                    setCityTopperDetails({ state: juniorStudent.state });
                } else if (hautStudent) {
                    setIsCityTopper(true);
                    setCityTopperImage(CityTopperHauts);
                    setCityTopperDetails({ state: hautStudent.state });
                }
            }
        } catch (err) {
            console.error("Error checking city topper status:", err);
        }
    };
    checkCityTopper();
  }, [user, baseURL]);

  if (!results || results.Rank === 'NA' || results.Rank === 'Disqualify') return null;

  // --- PDF COMPONENTS ---
  const StandardCertificatePDF = ({ name, rank, bgImage }) => (
    <Document><Page size={{ width: 1849, height: 1307 }} style={standardStyles.page}><Image src={bgImage} style={standardStyles.image} /><Text style={standardStyles.name}>{name}</Text>{rank && <Text style={standardStyles.rank}>{rank}</Text>}</Page></Document>
  );

 const CityTopperCertificatePDF = ({ name, state, bgImage }) => (
  <Document>
    <Page size={{ width: 1849, height: 1307 }} style={cityTopperStyles.page}>
      <Image src={bgImage} style={cityTopperStyles.image} />
      <Text style={cityTopperStyles.name}>{name}</Text>
      <Text style={cityTopperStyles.cityName}>{state}</Text>
    </Page>
  </Document>
);

  const handleButtonClick = (name) => setDisplayedName(name);

  const scrollToCertificates = () => {
    certificateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCertMessage = () => {
     if (certCategory === 'Gold')
  return 'You have been awarded the prestigious Gold Merit Certificate. This recognizes your exceptional logical aptitude and top-tier performance.';

if (certCategory === 'Silver')
  return 'You have earned the Silver Merit Certificate for your remarkable performance. This validates your strong critical thinking skills.';

if (certCategory === 'Bronze')
  return 'You have been awarded the Bronze Merit Certificate in recognition of your commendable performance. This reflects your strong problem-solving ability and promising analytical potential.';

return 'You have received the official Certificate of Participation. Keep honing your logical skills and never stop aiming high!';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-12 font-sans relative">
      
      {/* 
        Fix applied here: 
        1. zIndex: 9999 ensures it's above all standard UI elements.
        2. position: 'fixed' ensures the confetti stays over the viewport even if the user scrolls.
        3. pointerEvents: 'none' ensures it won't block clicks to the buttons behind it.
      */}
      {showConfetti && (
        <Confetti 
            width={windowDimension.width} 
            height={windowDimension.height} 
            tweenDuration={1000} 
            numberOfPieces={500} 
            gravity={0.2} 
            colors={['#0F766E', '#10B981', '#F59E0B', '#3B82F6']} 
            style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section with Scroll Action */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#01523d] whitespace-nowrap">
                    Technothlon'26 Result
                </h1>
                <p className="text-slate-500 font-medium tracking-widest uppercase mt-1 whitespace-nowrap">
                    Roll Number: {user?.roll || user?.rollNumber}
                </p>
            </div>
            <button 
                onClick={scrollToCertificates}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#064E3B] rounded-full font-bold text-sm transition-colors duration-300"
            >
                View Certificates
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </button>
        </div>

        {/* --- ORGANIC AIR DISPLAY --- */}
        <div className="w-full bg-white py-16 px-6 flex flex-col items-center justify-center rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <p className="text-[#014431] font-bold tracking-widest uppercase text-lg mb-2 text-center">
              Congratulations! You have secured
            </p>
            
            <div className="text-7xl md:text-8xl bg-clip-text bg-[#024735] mb-6 pop-animation drop-shadow-sm text-center">
              All India Rank {results.Rank}
            </div>

            {/* Special IITG Message for Rank <= 25 */}
            {results.Rank <= 25 && (
                <div className="mt-4 max-w-2xl text-center bg-[#edf3f0] border border-[#A7F3D0] rounded-2xl p-5 shadow-sm">
                    <p className="text-[#065F46] font-semibold text-lg leading-relaxed">
                        Congratulations on qualifying for the Prelims Round of Technothlon 2026.
The Prelims Round is scheduled from 28th–30th August 2026 at IIT Guwahati. Team Technothlon will contact you shortly with further details.
                    </p>
                </div>
            )}
        </div>

        {/* --- AWARDS & RECOGNITION SECTION --- */}
        <div ref={certificateRef} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 w-full flex flex-col items-center scroll-mt-8">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#064E3B] mb-3">Achievements & Certifications</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Choose a team member below to display their name accurately on the certificate.</p>
            
            {/* Name Toggle */}
            <div className="mt-6 inline-flex bg-slate-100 rounded-xl p-1.5 border border-slate-200">
              <button 
                onClick={() => handleButtonClick(user.name1)} 
                className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-colors duration-75 ${displayedName === user.name1 ? 'bg-gradient-to-r from-[#064E3B] to-[#047857] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {user.name1}
              </button>
              <button 
                onClick={() => handleButtonClick(user.name2)} 
                className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-colors duration-75 ${displayedName === user.name2 ? 'bg-gradient-to-r from-[#064E3B] to-[#047857] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {user.name2}
              </button>
            </div>
          </div>

          {/* Cards Container */}
          <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-8">
            
            {/* Standard Certificate Card */}
            <div className={`bg-slate-50 rounded-2xl border ${certCategory === 'Gold' ? 'border-yellow-400/50' : certCategory === 'Silver' ? 'border-slate-300' : 'border-slate-200'} p-8 flex flex-col items-start justify-between w-full flex-1 shadow-sm`}>
              <div className="w-full">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    {certCategory === 'Gold' && '🥇'}
                    {certCategory === 'Silver' && '🥈'}
                    {certCategory === 'Participation' && '📜'}
                    {certCategory} Certificate
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8">
                    {getCertMessage()}
                  </p>
              </div>
              
              <PDFDownloadLink
                document={<StandardCertificatePDF name={displayedName} rank={results.Rank} bgImage={certificateImage} />}
                fileName={`Certificate_${displayedName}.pdf`}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm text-center transition shadow-md"
              >
                {({ loading }) => (loading ? 'Generating Document...' : 'Download Certificate')}
              </PDFDownloadLink>
            </div>

            {/* City Topper Certificate Card */}
            {isCityTopper && cityTopperDetails.state && (
              <div className="bg-[#F0FDF4] rounded-2xl border border-[#86EFAC] p-8 flex flex-col items-start justify-between w-full flex-1 shadow-sm">
                <div className="w-full">
                    <h3 className="text-2xl font-bold text-[#065F46] mb-3 flex items-center gap-2">
                       🌟 State Topper
                    </h3>
                    <p className="text-[#047857] text-sm leading-relaxed mb-8">
                     An exclusive honor for achieving the highest rank in <strong>{cityTopperDetails.state}</strong>. Your exceptional performance has made your state proud.
                    </p>
                </div>
                
                <PDFDownloadLink
                 document={<CityTopperCertificatePDF name={displayedName || 'Student'} state={cityTopperDetails.state} bgImage={cityTopperImage} />}
                  fileName={`CityTopper_${displayedName}.pdf`}
                  className="w-full py-3.5 bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white rounded-xl font-bold text-sm text-center transition shadow-md"
                >
                  {({ loading }) => (loading ? 'Generating Document...' : 'Download Certificate')}
                </PDFDownloadLink>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;