import React, { useState, useEffect } from 'react';
import techno from "../../Assets/techno-owl.png";
import TechnopedQuestion from './technoped-question';
import './profile.css';
import './updates.css';
import './technoped.css';
import axios from 'axios';

const Technopedia = () => {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3001/";
    const [start, setStart] = useState(true);
    const [date, setDate] = useState('13th July 2024');
    const [user, setUser] = useState('');
    const [isQuizAttempted, setIsQuizAttempted] = useState(false);
    const [score, setScore] = useState(null);
    const [rank, setRank] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseURL}api/uploadcsv/user`, {
                    withCredentials: true
                });
                setUser(response.data.user);
                fetchQuizAttemptStatus(response.data.user.roll);
            } catch (err) {
                console.log('Error fetching user details:', err);
            }
        };

        const fetchQuizAttemptStatus = async (rollNumber) => {
            try {
                const response = await axios.get(`${baseURL}api/check-quiz-attempt/${rollNumber}`);
                setIsQuizAttempted(response.data.isAttempted);
                if (response.data.isAttempted) {
                    fetchScoreAndRank(rollNumber);
                }
            } catch (err) {
                console.log('Error fetching quiz attempt status:', err);
            }
        };

        const fetchScoreAndRank = async (rollNumber) => {
            try {
                const response = await axios.get(`${baseURL}api/get-score-and-rank/${rollNumber}`);
                setScore(response.data.score);
                setRank(response.data.rank);
            } catch (err) {
                console.log('Error fetching score and rank:', err);
            }
        };

        fetchUserDetails();
    }, [baseURL]);

    return (
                    <div className="Technoped-main main">
                        <div className="roll">
                            <p>{user.roll}</p>
                            <img src={techno} alt="" />
                        </div>
                        <div className="announcement">
                            
                        </div>
                        </div>
    )

//     if (start) {
//         return (
//             <div className="Technoped-main main">
//                 <div className="roll">
//                     <p>{user.roll}</p>
//                     <img src={techno} alt="" />
//                 </div>
//                 <div className="announcement">
//                     {/* Technopedia Will Be Live in the First Week of July */}
//                 </div>
//                 <div className='technoped-banner'>
//                     <div className='technoped-banner-heading'>Welcome to the Technopedia, 24</div>
//                     <div className='technoped-banner-subHeading'>You can attempt it until: {date}</div>
//                 </div>
//                 <div className='technopedo-instructions-wrapper'>
//                     <div className='technopedo-instruction-heading'>Instructions</div>
//                     <div className='technopedo-sub-instruc'>
//                         <div className='techopedo-mini-heading'>What is Technopedia?</div>
//                         <div className='technopedo-content'>Technopedia is the online module of Technothlon providing its students with an ultimate experience of the prelims beforehand. With the monthly quizzes, Technopedia aims at keeping the young minds involved in brainstorming questions and helping them prepare for the prelims. Only the students who have registered for Technothlon may log into Technopedia using either their email id or their roll number and password.</div>
//                     </div>
//                     <div className='technopedo-sub-instruc'>
//                         <div className='techopedo-mini-heading'>RULES:</div>
//                         <div className='technopedo-content'>
//                             <ul className='rules-ul'>
//                                 <li>Technopedia contains 8 questions.</li>
//                                 <li>All the questions are integer-based which you have to write in the space provided</li>
//                                 <li>Once you begin the quiz you will get 1.5 hours to attempt Technopedia. After 1.5 hours your score will get automatically generated!</li>
//                                 <li>You can attempt Technopedia only once.</li>
//                                 <li style={{color: 'red'}}>Do not refresh; otherwise, it will restart.</li>

//                             </ul>
//                         </div> 
//                     </div>
//                     <div className='technopedo-sub-instruc'>
//                         <div className='techopedo-mini-heading'><b>Marking Scheme</b> </div>
//                         <div className='technopedo-content'>Each question carries 4 marks. For every correct answer, you will earn +4 marks. In the case of every incorrect answer, 1 mark will be deducted from your total score
//                         </div>
//                         <div className='technopeds-btn-wrapper'>
//                             <button className='technopeda-start-btn' onClick={() => { setStart(false) }}>Are You Ready? Let's Begin!</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     } else {
//         if (isQuizAttempted) {
//             return (
//                 <div className="Technoped-main main">
//                     <div className="roll">
//                         <p>{user.roll}</p>
//                         <img src={techno} alt="" />
//                     </div>
//                     <div className='performance'><h1 style={{fontWeight:'bold',color:'black'}}>You have already attempted the quiz.</h1>
//                     <p>Your score in the quiz: <span style={{fontWeight:'bold'}}>{score !== null ? score : 'Loading...'}/32 points</span></p>
//                     <p>Your current rank: <span style={{fontWeight:'bold'}}>{rank !== null ? rank : 'Loading...'}</span></p>
//                     </div>
                    
//                 </div>
//             );
//         } else {
//             return (
//                 <TechnopedQuestion rollNumber={user.roll} /> // Pass rollNumber as a prop
//             );
//         }
//     }
 };

export default Technopedia;