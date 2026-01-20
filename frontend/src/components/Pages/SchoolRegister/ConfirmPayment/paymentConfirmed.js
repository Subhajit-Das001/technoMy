import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './paymentConfirmed.css';
import Header from '../../../Header/header';
import Footer from '../../../Footer/footer';
import Loader from '../../../design/loader/Loader';

const PaymentConfirmed = () => {
    const { ciphertext } = useParams();
    const [rollNumber, setRollNumber] = useState(null);
    const [password, setPassword] = useState(null);
    const [status, setStatus] = useState('input'); // Start in 'input' or 'processing'
    const [errorMsg, setErrorMsg] = useState('');
    const [manualOrderId, setManualOrderId] = useState('');

    const processedRef = useRef(false);
    const hasAutoProcessed = useRef(false); // To prevent double processing
    const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

    useEffect(() => {
        // 1. Try to get orderid from URL
        const params = new URLSearchParams(window.location.search);
        const urlOrderId = params.get('orderid') || params.get('orderId');

        if (ciphertext && urlOrderId && !hasAutoProcessed.current) {
            hasAutoProcessed.current = true;
            setStatus('processing');
            confirmPayment(ciphertext, urlOrderId);
        } else if (!urlOrderId) {
            // If no orderID in URL, stay in 'input' state so user can enter it
            setStatus('input');
        }
    }, [ciphertext]);

    const confirmPayment = async (registrationId, orderId) => {
        try {
            const res = await fetch(`${baseURL}/handlePayment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationId: registrationId,
                    paymentStatus: "success",
                    orderId: orderId
                })
            });

            const data = await res.json();

            if (res.ok) {
                setRollNumber(data.rollNumber);
                setPassword(data.password);
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

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const trimmedId = manualOrderId.trim();
        if (!/^\d{7}$/.test(trimmedId)) {
            alert("Invalid Order ID. Stop Hacking!!!!");
            return;
        }
        setStatus('processing');
        confirmPayment(ciphertext, trimmedId);
    }

    return (
        <div className="team-verified-container">
            <Header />

            <div className="message-container">

                {/* STATE: INPUT (Fallback if no URL param) */}
                {status === 'input' && (
                    <div className="input-box" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2>Final Step!</h2>
                        <p>Please enter the <strong>Order ID / Ticket ID</strong> sent to your email by MeraEvents.</p>
                        <form onSubmit={handleManualSubmit} style={{ marginTop: '20px' }}>
                            <input
                                type="text"
                                placeholder="Enter 7-digit Order ID"
                                value={manualOrderId}
                                onChange={(e) => setManualOrderId(e.target.value)}
                                style={{ padding: '10px', width: '250px', fontSize: '16px' }}
                                maxLength={7}
                                required
                            />
                            <br />
                            <button
                                type="submit"
                                style={{
                                    marginTop: '15px',
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Generate Roll Number
                            </button>
                        </form>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="processing-box">
                        <h2>Verifying Payment...</h2>
                        <p>Checking your Order ID and generating Roll Number.</p>
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

                            <hr className="divider" />

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
                        <button
                            onClick={() => setStatus('input')}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Valid ID Again
                        </button>
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