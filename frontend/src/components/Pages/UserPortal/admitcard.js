import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet, View } from '@react-pdf/renderer';
import AC from '../../Assets/img/admit-card.png';
import './admitcard.css';

// ---------------------------------------------------------
// EXPLICIT DIMENSIONS
// ---------------------------------------------------------
const PAGE_WIDTH = 1453;
const PAGE_HEIGHT = 787.44;

// ---------------------------------------------------------
// PDF STYLESHEET (Final Fine-Tuned Coordinates)
// ---------------------------------------------------------
const styles = StyleSheet.create({
  page: { 
    width: PAGE_WIDTH,      
    height: PAGE_HEIGHT,     
    position: 'relative' 
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PAGE_WIDTH,      
    height: PAGE_HEIGHT,    
    zIndex: -1,
  },
  valueText: { 
    position: 'absolute',
    fontFamily: 'Helvetica',
    color: '#333333', 
    fontSize: 21 
  },
  
  // 👉 TWEAKED POSITIONS based on your screenshot feedback
  rollNumber: { top: '39.5%', left: '38%' },   // Perfect (unchanged)
  name1: { top: '47.3%', left: '49%' },        // Shifted UP to align with header
  name2: { top: '55.3%', left: '49%' },        // Shifted UP to align with header
  
  // 👉 CENTER BOX: Dropped safely below the overlapping label
  centreContainer: {
    position: 'absolute', 
    top: '69.5%',       // Shifted DOWN to start under the label
    left: '28%',        
    width: '56%',       
    height: '14%',
    display: 'flex',
    flexDirection: 'column',
  },
  centreText: {
    fontFamily: 'Helvetica',
    color: '#333333',
  },
  
  // 👉 REPS: Pulled up to match the horizontal level of their headers
  cityrepName: { top: '83.5%', left: '43%' },  // Shifted UP
  cityrepPhone: { top: '83.5%', left: '72%' }  // Shifted UP
});

// ---------------------------------------------------------
// EXTRACTED PDF COMPONENT
// ---------------------------------------------------------
const AdmitCardPDF = React.memo(({ name1, name2, rollNumber, centerData }) => {
  const rawCenterName = centerData?.centreName || '';
  const rawCenterAddress = centerData?.centreAddress || '';
  
  let fullCentreString = `${rawCenterName}`;
  if (rawCenterAddress) { fullCentreString += `, ${rawCenterAddress}`; }
  if (!fullCentreString.trim()) { fullCentreString = 'To be announced'; }

  const getDynamicFontSize = (text) => {
    const length = text.length;
    if (length < 60) return 28;  
    if (length < 100) return 26; 
    if (length < 150) return 24; 
    return 18;                   
  };
  const centreFontSize = getDynamicFontSize(fullCentreString);

  const repName = centerData?.cityrepName || 'NA';
  const repPhone = centerData?.cityrepPhone || 'NA';

  return (
    <Document>
      {/* 📄 PAGE 1: Admit Card Details */}
      <Page size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }} style={styles.page}>
        
        <Image src={AC} style={styles.bgImage} fixed={true} />
        
        <Text style={[styles.valueText, styles.rollNumber]}>{rollNumber}</Text>
        <Text style={[styles.valueText, styles.name1]}>{name1 || 'NA'}</Text>
        <Text style={[styles.valueText, styles.name2]}>{name2 || 'NA'}</Text>
        
        <View style={styles.centreContainer}>
          <Text style={[styles.centreText, { fontSize: centreFontSize, lineHeight: 1.4 }]}>
            {fullCentreString}
          </Text>
        </View>
        
        <Text style={[styles.valueText, styles.cityrepName]}>{repName}</Text>
        <Text style={[styles.valueText, styles.cityrepPhone]}>{repPhone}</Text>
      </Page>
      
      {/* 📄 PAGE 2: Instructions */}
      <Page size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }} style={styles.page}>
        <View style={{ backgroundColor: '#FFE2A6', borderRadius: 18, margin: 60, padding: 40, width: '90%', alignSelf: 'center' }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 36, textAlign: 'center', marginBottom: 24, color: '#223438', letterSpacing: 1 }}>
            INSTRUCTIONS
          </Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 20, marginBottom: 18, color: '#223438', textDecoration: 'underline' }}>
            General Instructions for Examination
          </Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              1. All registered candidates are required to <Text style={{ fontFamily: 'Helvetica-Bold' }}>download and carry a printed copy of the admit card</Text> on the day of the examination along with an <Text style={{ fontFamily: 'Helvetica-Bold' }}>original ID proof</Text> (Aadhaar Card or School ID Card). The admit card must have a passport size photograph pasted on it.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              2. The examination will be of <Text style={{ fontFamily: 'Helvetica-Bold' }}>2 hours</Text> duration, from <Text style={{ fontFamily: 'Helvetica-Bold' }}>11:00 AM to 1:00 PM</Text>.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              3. Reporting time is <Text style={{ fontFamily: 'Helvetica-Bold' }}>10:30 AM</Text>, and the final entry into the examination centre will be at <Text style={{ fontFamily: 'Helvetica-Bold' }}>10:45 AM</Text>. No candidate will be allowed entry after this time.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              4. No candidate will be allowed to leave the examination hall before 1:00 PM.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              5. Candidates must carry their own <Text style={{ fontFamily: 'Helvetica-Bold' }}>BLACK BALL POINT PEN</Text> for writing the examination. Borrowing of stationery is strictly prohibited.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              6. Adequate rough space will be provided in the question paper itself. No additional rough sheets will be provided at the centre.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              7. Blank papers, clipboards, log tables, slide rulers, calculators, mobile phones, smartwatches, earphones, and any other electronic gadgets are strictly prohibited inside the examination hall.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              8. Use of any kind of unfair means, copying, or misconduct is strictly prohibited and will lead to immediate disqualification from the examination.
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Helvetica' }}>
              9. Candidates must follow all instructions given by the invigilators without argument or delay.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
});

// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------
const AdmitCard = () => {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const [centreInfo, setCentreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}uploadcsv/user`, {
           withCredentials: true 
        });
        const { user: fetchedUser, type: fetchedType, centreInfo: fetchedCentre } = response.data;
        setUser(fetchedUser);
        setType(fetchedType);
        setCentreInfo(fetchedCentre);
      } catch (err) {
        console.log('Error fetching user details:', err);
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    }; 
    fetchUserDetails();
  }, [baseURL]);

  if (loading) {
    return (
      <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
        <h2>Loading your admit card...</h2>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
        <h2>Error loading admit card</h2>
        <p>{error || 'User data not found'}</p>
      </div>
    );
  }

  const rollNumber = user.roll || user.rollNumber;
  const isUnassigned = !user.centreId || user.centreId.trim() === '' || user.centreId === 'null' || user.centreId === 'NA';
  
  const showSchoolBanner = isUnassigned && type === 'cos';
  const showAnnounceBanner = isUnassigned && type !== 'cos';

  return (
    <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
      
      {showSchoolBanner && (
        <div className="w-full bg-blue-100 text-blue-800 p-4 text-center mb-6 font-bold text-lg rounded shadow-sm max-w-4xl">
          The examination will be conducted at the school/coaching institute where you have registered.
        </div>
      )}
      
      {showAnnounceBanner && (
        <div className="w-full bg-blue-100 text-blue-800 p-4 text-center mb-6 font-bold text-lg rounded shadow-sm max-w-4xl">
          Your centre will be announced shortly.
        </div>
      )}
      
      <div className="admitcard-header mb-4">
        <h1 className='text'>TECHNOTHLON'26 ADMIT CARD</h1>
      </div>

      <div className="admitcard-content text-center">
        <h2>Roll Number: {rollNumber}</h2>
        <div className="student-info">
          <p><strong>Name 1:</strong> {user.name1}</p>
          <p><strong>Name 2:</strong> {user.name2}</p>
          <p><strong>Center:</strong> {centreInfo?.centreName}</p>
        </div>
      </div>

      <div className='mt-10'>
        <h2 className='text-2xl text-center'>Download Your Admit Card</h2>
        
        <div className="btn-download mt-10">
          {user && centreInfo ? (
            <PDFDownloadLink
              document={
                <AdmitCardPDF
                  name1={user.name1}
                  name2={user.name2}
                  rollNumber={rollNumber}
                  centerData={centreInfo}
                />
              }
              fileName={`AdmitCard_${rollNumber}.pdf`}
            >
              {({ loading, error }) => {
                if (error) return 'Error generating PDF';
                return loading ? 'Preparing Document...' : 'Download Admit Card';
              }}
            </PDFDownloadLink>
          ) : (
            <span className="text-gray-500">Preparing download link...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;