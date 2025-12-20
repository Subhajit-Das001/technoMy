import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './paymentConfirmed.css';
import Header from '../../../Header/header'; 
import Footer from '../../../Footer/footer'; 
import Loader from '../../../design/loader/Loader';

const PaymentConfirmed = () => {
    const { ciphertext } = useParams(); 
    const [rollNumber, setRollNumber] = useState(null);
    const [password, setPassword] = useState(null); // Added state for password
    const [status, setStatus] = useState('processing'); 
    const [errorMsg, setErrorMsg] = useState('');
    
    const processedRef = useRef(false);
    const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

    useEffect(() => {
        if (ciphertext && !processedRef.current) {
            processedRef.current = true;
            confirmPayment(ciphertext);
        }
    }, [ciphertext]);

    const confirmPayment = async (registrationId) => {
        try {
            const res = await fetch(`${baseURL}/handlePayment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationId: registrationId,
                    paymentStatus: "success" 
                })
            });

            const data = await res.json();

            if (res.ok) {
                setRollNumber(data.rollNumber);
                setPassword(data.password); // Save password to state
                setStatus('success');
            } else {
                setStatus('failed');
                setErrorMsg(data.error || "Payment verification failed");
            }
        } catch (error) {
            setStatus('failed');
            setErrorMsg("Network error occurred");
        }
    };

    return (
        <div className="team-verified-container">
            <Header />
            
            <div className="message-container">
                
                {status === 'processing' && (
                    <div className="processing-box">
                        <h2>Verifying Payment...</h2>
                        <p>Please wait while we generate your Roll Number.</p>
                        {/* <Loader /> */} 
                    </div>
                )}

                {status === 'success' && (
                    <div className="success-box">
                        <h1>Registration Successful!</h1>
                        <p>You have successfully paid the registration fees.</p>
                        
                        <div className="password-section">
                            <h3 className="password-label">Your Roll Number</h3>
                            <div className="password-display">{rollNumber}</div>
                            
                            <hr className="divider"/>

                            <div className="password-section">
                                <span className="password-label">YOUR PASSWORD:</span>
                                
                                {/* Show actual password if available, else show format */}
                                <div className="password-display">
                                    {password || "DDMMYYYY + DDMMYYYY"}
                                </div>
                                
                                <p className="password-hint">
                                    (Your password is a fixed combination of your birth dates in DDMMYYYY format and cannot be changed later.)
                                </p>
                                <p style={{ 
                                    marginTop: '15px', 
                                    fontSize: '0.9rem', 
                                    color: '#b45309', 
                                    backgroundColor: '#fffbeb', 
                                    padding: '8px', 
                                    borderRadius: '6px',
                                    border: '1px solid #fcd34d'
                                }}>
                                    <strong>Note:</strong> This Roll Number and Password are common for both team members.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="error-box">
                        <h1>Verification Failed</h1>
                        <p>{errorMsg}</p>
                        <p className="contact-support">
                            If money was deducted, please contact <a href="mailto:technothlon@iitg.ac.in">technothlon@iitg.ac.in</a>
                        </p>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default PaymentConfirmed;