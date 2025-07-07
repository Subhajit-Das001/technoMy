import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Text, Image, PDFDownloadLink, StyleSheet, View } from '@react-pdf/renderer';
import AC from '../../Assets/img/AC2.png';
import Ins from '../../Assets/img/ains.png';

import './admitcard.css';

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
    width: '100%',
    height: 'auto',
  },
  insImage: {
    width: '80%',
    marginTop: 20,
    marginLeft: '10%',
  },
  name1: {
    position: 'absolute',
    top: '52%', // Converted to percentage for better scaling
    left: '47%',
    transform: 'translate(-50%, -50%)',
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  name2: {
    position: 'absolute',
    top: '61.1%', // Converted to percentage
    left: '47%',
    transform: 'translate(-50%, -50%)',
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rollNumber: {
    position: 'absolute',
    top: '70.4%', // Converted to percentage
    left: '34.5%',
    transform: 'translate(-50%, -50%)',
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centerContainer: {
    position: 'absolute',
    left: '48%',
    bottom: '18.5%',
    transform: 'translate(-50%, 0)',
    textAlign: 'center',
  },
  centerLine: {
    fontSize: 24,
    color: '#000',
    marginBottom: 6, // or whatever spacing you want
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1424,
    height: 30,
    backgroundColor: '#EA5329',
  },
  rightSmallBar: {
    position: 'absolute',
    top: 5, // just below the top bar
    right: 0,
    width: 33,
    height: 128,
    backgroundColor: '#EA5329',
  },
  rightTallBar: {
    position: 'absolute',
    top: 129, // 30 (top bar) + 130 (small bar)
    right: 0,
    width: 33,
    height: 653,
    backgroundColor: '#FFE2A6',
  },
});

const AdmitCard = () => {
  console.log('AdmitCard component rendered');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseURL = process.env.NODE_ENV === "production" 
    ? "https://technothlon.techniche.org.in/api/" 
    : "http://localhost:3001/api/";

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}uploadcsv/user`, {
           withCredentials: true });
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        console.log('User data:', fetchedUser);
      } catch (err) {
        console.log('Error fetching user details:', err);
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [baseURL]);

  // Show loading state
  if (loading) {
    return (
      <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
        <div className="loading-message">
          <h2>Loading your admit card...</h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
        <div className="error-message">
          <h2>Error loading admit card</h2>
          <p>{error || 'User data not found'}</p>
        </div>
      </div>
    );
  }

  // Move PDF component outside and memoize it
  const AdmitCardPDF = React.memo(({ name1, name2, rollNumber, center }) => {
    const centerLines = center.replace(/\\n/g, '\n').split('\n');
    
    return (
      <Document>
        <Page size={{ width: 1453, height: 787.44 }} style={styles.page}>
          {/* <View style={styles.topBar} /> */}
          <View style={styles.rightSmallBar} />
          <View style={styles.rightTallBar} />
          <Image src={AC} style={styles.image} />
          <Text style={styles.name1}>{name1}</Text>
          <Text style={styles.name2}>{name2}</Text>
          <Text style={styles.rollNumber}>{rollNumber}</Text>
          <View style={styles.centerContainer}>
            {centerLines.map((line, idx) => (
              <Text key={idx} style={styles.centerLine}>{line}</Text>
            ))}
          </View>
        </Page>
        {/* Second page: Instructions */}
        <Page size={{ width: 1453, height: 787.44 }} style={styles.page}>
          <View style={{
            backgroundColor: '#FFE2A6',
            borderRadius: 18,
            margin: 60,
            padding: 40,
            width: '90%',
            alignSelf: 'center',
          }}>
            <Text style={{
              fontSize: 36,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 24,
              color: '#223438',
              letterSpacing: 1
            }}>
              INSTRUCTIONS
            </Text>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 18,
              color: '#223438',
              textDecoration: 'underline',
            }}>
              General Instructions for Examination
            </Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                1. All registered candidates are required to <Text style={{fontWeight: 'bold'}}>download and carry a printed copy of the admit card</Text> on the day of the examination along with an <Text style={{fontWeight: 'bold'}}>original ID proof</Text> (Aadhar Card or School ID Card). The admit card must have a passport size photograph pasted on it.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                2. The examination will be of <Text style={{fontWeight: 'bold'}}>2 hours</Text> duration, from <Text style={{fontWeight: 'bold'}}>11:00 AM to 1:00 PM</Text>.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                3. Reporting time is <Text style={{fontWeight: 'bold'}}>10:30 AM</Text>, and the final entry into the examination centre will be at <Text style={{fontWeight: 'bold'}}>10:45 AM</Text>. No candidate will be allowed entry after this time.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                4. No candidate will be allowed to leave the examination hall before 1:00 PM.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                5. Candidates must carry their own <Text style={{fontWeight: 'bold'}}>BLACK BALL POINT PEN</Text> for writing the examination. Borrowing of stationery is strictly prohibited.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                6. Adequate rough space will be provided in the question paper itself. No additional rough sheets will be provided at the centre.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                7. Blank papers, clipboards, log tables, slide rulers, calculators, mobile phones, smartwatches, earphones, and any other electronic gadgets are strictly prohibited inside the examination hall. Any such objects must be deposited with the invigilator or city representative before the start of the examination and can be collected after its completion.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                8. Use of any kind of unfair means, copying, or misconduct is strictly prohibited and will lead to immediate disqualification from the examination.
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                9. Candidates must follow all instructions given by the invigilators without argument or delay.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  });

  // Pre-calculate values
  const rollNumber = user.roll || user.rollNumber;
  let center = user.centre || user.center || 'To be announced';
  if (center === 'NULL') center = 'Your center will announce very soon';

  return (
    <div className="admitcard-container flex flex-col items-center justify-center min-h-screen">
      <div className="admitcard-header mb-4">
        <h1 className='text'>TECHNOTHLON'25 ADMIT CARD</h1>
      </div>

      <div className="admitcard-content text-center">
        <h2>Roll Number: {rollNumber}</h2>
        <div className="student-info">
          <p><strong>Name 1:</strong> {user.name1}</p>
          <p><strong>Name 2:</strong> {user.name2}</p>
          <p><strong>Center:</strong> {center}</p>
        </div>
      </div>

      <div className='mt-10'>
        <h2 className='text-2xl text-center'>Download Your Admit Card</h2>
        
        <div className="btn-download mt-10">
          <PDFDownloadLink
            document={
              <AdmitCardPDF
                name1={user.name1}
                name2={user.name2}
                rollNumber={rollNumber}
                center={center}
              />
            }
            fileName="AdmitCard.pdf"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download Admit Card')}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;