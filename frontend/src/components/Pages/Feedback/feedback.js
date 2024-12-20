import React, { useState } from 'react';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
import axios from 'axios';
import './feedback.css';
const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3000/";
const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedbackType, setFeedbackType] = useState('complain');
    const [feedbackContent, setFeedbackContent] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = {
            name: name,
            email: email,
            feedbackType: feedbackType,
            feedbackContent: feedbackContent
        };
    
        try {
            const response = await axios.post(`${baseURL}feedback/feedback`, formData);
    
            if (response.status === 201) {
                alert('Thankyou for your feedback!');
                setName('');
                setEmail('');
                setFeedbackType('complain');
                setFeedbackContent('');
            } else {
                alert('Failed to submit feedback. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting feedback. Please try again later.');
        }
    };
    

    return (
        <div className="App">
            <Header />
            <div className="feedback-main">
                <div className="feed-head">
                    <h1>FEEDBACK</h1>
                    <p>Thanks for your interest in Technothlon! Let us know about any suggestions or complaints you might have</p>
                </div>
                <div className="feed-form">
                    <form onSubmit={handleSubmit}>
                        <div className="Name">
                            <h2>Name</h2>
                            <input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="Email">
                            <h2>Email</h2>
                            <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="feed-type">
                            <div>
                                <h2>Type Of Feedback</h2>
                                <select name="complain" id="complain" className="custom-dropdown" value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
                                    <option value="complain">Complain</option>
                                    <option value="suggestion">Suggestion</option>
                                </select>
                            </div>
                        </div>
                        <div className="feed-cont">
                            <h2>Feedback</h2>
                            <textarea placeholder="Enter your Feedback..." className="content" value={feedbackContent} onChange={(e) => setFeedbackContent(e.target.value)}></textarea>
                        </div>
                        <div className="submit">
                            <button type="submit" >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Feedback;
