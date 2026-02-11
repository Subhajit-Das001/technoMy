import React, { useState } from 'react';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
import axios from 'axios';
import './feedback.css';

const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";

const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // Default to empty to force user selection
    const [feedbackType, setFeedbackType] = useState(''); 
    const [feedbackContent, setFeedbackContent] = useState('');
    
    // NEW: Loading State
    const [loading, setLoading] = useState(false);
    // NEW: Success Message State
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedbackType) {
            alert('Please select a feedback type.');
            return;
        }

        // 1. Start Loading (Disable button & show "Submitting...")
        setLoading(true); 
    
        const formData = {
            name: name,
            email: email,
            feedbackType: feedbackType,
            feedbackContent: feedbackContent
        };
    
        try {
            const response = await axios.post(`${baseURL}feedback/feedback`, formData);
    
            // 2. Stop Loading (Process finished)
            setLoading(false);

            if (response.status === 201) {
                // 3. Show Success Message AFTER loading is done
                setSuccessMessage('Feedback Submitted');
                
                // Hide message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
                
                // Clear form
                setName('');
                setEmail('');
                setFeedbackType('');
                setFeedbackContent('');
            } else {
                alert('Failed to submit feedback. Please try again later.');
            }
        } catch (error) {
            setLoading(false); // Stop loading even on error
            console.error('Error:', error);
            alert('An error occurred while submitting feedback. Please try again later.');
        }
    };
    

    return (
        <div className="App">
            <Header />
            {successMessage && (
                <div className="feedback-success-message">
                    ✓ {successMessage}
                </div>
            )}
            <div className="feedback-main">
                <div className="feed-head">
                    <h1>FEEDBACK</h1>
                    <p>Thanks for your interest in Technothlon! Let us know about any suggestions or complaints you might have</p>
                </div>
                <div className="feed-form">
                    <form onSubmit={handleSubmit}>
                        <div className="Name">
                            <h2>Name</h2>
                            <input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="Email">
                            <h2>Email</h2>
                            <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="feed-type">
                            <div>
                                <h2>Type Of Feedback</h2>
                                <select 
                                    name="complain" 
                                    id="complain" 
                                    className="custom-dropdown" 
                                    value={feedbackType} 
                                    onChange={(e) => setFeedbackType(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>-- Select Issue Type --</option>
                                    <optgroup label="Registration & Login">
                                        <option value="online_registration">Online Registration Issue</option>
                                        <option value="payment_issue">Payment Failure / Money Deducted</option>
                                        <option value="credentials">Forgot Roll Number / Password</option>
                                        <option value="login_issue">Login Trouble</option>
                                    </optgroup>
                                    <optgroup label="Certificates & Results">
                                        <option value="certificate_download">Certificate Download Issue</option>
                                        <option value="city_topper">City Topper Certificate Enquiry</option>
                                        <option value="result_enquiry">Result / Rank Enquiry</option>
                                        <option value="details_correction">Name/School Correction</option>
                                    </optgroup>
                                    <optgroup label="Partnership & Sponsorship">
                                        <option value="become_sponsor">Want to Sponsor Technothlon</option>
                                        <option value="school_partnership">School Partnership / Tie-up</option>
                                        <option value="city_rep">Apply for City Representative</option>
                                        <option value="collaboration">General Collaboration</option>
                                    </optgroup>
                                    <optgroup label="General">
                                        <option value="suggestion">Suggestion / Feedback</option>
                                        <option value="complain">General Complaint</option>
                                        <option value="other">Other</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <div className="feed-cont">
                            <h2>Feedback</h2>
                            <textarea placeholder="Enter your Feedback..." className="content" value={feedbackContent} onChange={(e) => setFeedbackContent(e.target.value)} required></textarea>
                        </div>
                        
                        <div className="submit">
                            {/* UPDATED BUTTON: Disables when loading */}
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className={loading ? 'loading-btn' : ''}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Feedback;