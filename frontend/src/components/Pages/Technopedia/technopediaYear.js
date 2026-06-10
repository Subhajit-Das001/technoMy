import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import technoLogo from '../../Assets/img/techno_contest.png';
import readingbook from "../../Assets/img/readingbook.png"
import school from "../../Assets/school.png"
import { Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import "./technopediaYear.css"
function TechnopediaYear() {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [years, setYears] = useState([])
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const checkAuthentication = () => {
            const userPhone = localStorage.getItem('userPhone');
            const userName = localStorage.getItem('userName');
            const isContestActive = localStorage.getItem('isContestActive');

            if (!userPhone || !userName) {
                navigate('/technopedia-login', { replace: true });
                return;
            }
            setUserName(userName)
        };
        checkAuthentication();
    }, [navigate]); 
    useEffect(() => {
        const fetchQuestionsYear = async () => {
            try {
                setError("")
                const response = await axios.get(`${baseURL}/api/technopedia/questions/years`);
                // console.log(response.data);
                setYears(response.data.data)
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to fetch questions. Please try again later.');
            }
        }
        fetchQuestionsYear();
    }, [])
    const totalPoints = (currentYear) => {
        let TotalPoints = 0;
        currentYear.questions.map((question) => {
            TotalPoints += question.points
        })
        return TotalPoints
    }
    const handleLogout = () => {
        // Clear all localStorage items related to contest and analysis
        const itemsToRemove = [
            'contestStartTime',
            'sessionToken',
            'userPhone',
            'userName',
            'userSchool',
            'usertype',
            'answeredQuestions',
            'isContestActive',
            'userRoll'
        ];

        for (let i = 1; i <= 10; i++) {
            localStorage.removeItem(`technopedia_timeSpent_question_${i}`);
            localStorage.removeItem(`technopedia_totalTimeSpent_question_${i}`);
        }

        itemsToRemove.forEach(item => localStorage.removeItem(item));

        // Remove any other technopedia-related items
        Object.keys(localStorage).forEach(key => {
            if (key.includes('technopedia') || key.includes('contest') || key.includes('session')) {
                localStorage.removeItem(key);
            }
        });

        // Redirect to login
        navigate('/technopedia-login', { replace: true });
    };

    const handleYearWiseQuestion = async (year, language) => {
    // Default to 'en' if language is missing (acts as a safety net for older database records)
    const langRoute = language || 'en';
    navigate(`/technopedia/${year}/${langRoute}`);
};
const latestContest = years.length > 0
    ? years.reduce((latest, current) =>
        new Date(current.startTime) > new Date(latest.startTime)
            ? current
            : latest
    )
    : null;
    return (
        <div className='technopedia-year'>
            <div className="TPY-header-section">
    <div className="TPY-logo-container">
        <img src={technoLogo} alt="Technothlon" className="TPY-logo" />
    </div>
    <div className="TPY-user-info">
        <Avatar>{userName ? userName[0].toUpperCase() : 'A'}</Avatar>
        <span className="TPY-user-name">{userName}</span>
        <IconButton onClick={handleLogout}>
            <LogoutIcon />
        </IconButton>
    </div>
</div>
            <div className="TL-year-question">
                <div className='year-paper-heading'>
                    <h1 >Technopedia</h1>
                    {/* <p>
                        Technopedia is the digital learning platform of Technothlon, designed to help students improve logical thinking, analytical skills, and problem-solving abilities through interactive challenges.
                    </p> */}
                </div>
                <div className="year-paper-container">
                    {years.map((year, index) => {
                        const isLatest =
        latestContest &&
        year.startTime === latestContest.startTime;
        return(
    <div key={index} className={`TL-year-wrapper ${isLatest ? 'latest-contest' : ''}`}>
         {isLatest && (
        <div className="latest-badge">
            
        </div>
    )}
        <div className='year-paper'>
            <div className='year-paper-details'>
                <span className='year-paper-detail'>
                    {/* Dynamically append -हिंदी if the language is 'hi' */}
                    {year.year}{year.language === 'hi' ? '-हिंदी' : ''}
                </span>
                <span className='year-paper-detail'>Practice Contest</span>
            </div>
            <div className='year-paper-icon'>
                <ion-icon name="calendar-clear-outline"></ion-icon>
            </div>
        </div>
        
        <div className='year-paper-question'>
            <div className='year-paper-question-details'>
                <span className='year-paper-icon'><ion-icon name="document-text-outline"></ion-icon></span>
                <span className='year-paper-bold'>{year.questions.length}</span>
                <span>Problem</span>
            </div>
            <div className='year-paper-question-details'>
                <span className='year-paper-icon'><ion-icon name="star-outline"></ion-icon></span>
                <span className='year-paper-bold'>{totalPoints(year)}</span>
                <span>Points</span>
            </div>
        </div>
        
        <button
            // Pass BOTH the year and the language to the navigation handler
            onClick={() => { handleYearWiseQuestion(year.year, year.language) }}
            className='year-paper-button'>
            <span>Start Solving</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
    </div>
)})}

                </div>
                <div className='year-paper-footer'>
                    <div className='year-paper-footer-box'>
                        <div className='footer-image-div'>
                            {/* image */}
                            <img className='footer-img' src={readingbook} alt='reading-book' />
                        </div>
                        <div className='footer-text-div'>
                            <h1>
                                What is Technopedia?
                            </h1>
                            <p>
                                Technopedia is an online learning initiative by Technothlon, IIT Guwahati, where students explore logic-based challenges, puzzles, and analytical problems designed to strengthen creative thinking and problem-solving skills.
                            </p>
                        </div>
                    </div>
                    <div className='year-paper-footer-box'>
                        <div className='footer-image-div'>
                            {/* image */}
                            <img className='footer-img' src={school} alt='school' />
                        </div>
                        <div className='footer-text-div'>
                            <h1>
                                What is Technothlon?
                            </h1>
                            <p>
                                Technothlon is an international school championship organized by the students of IIT Guwahati with the aim of inspiring young minds through logic, creativity, and innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TechnopediaYear
