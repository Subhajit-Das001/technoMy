                                                                                                                                                                                                             import React, { useEffect, useState } from 'react';
import axios from 'axios';
import techno from "../../Assets/techno-owl.png";
import './technoped-result.css';
const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3001/";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/login" : "http://localhost:3000/login";
const ResultPage = ({ rollNumber, examDuration }) => {
    const [score, setScore] = useState(null);
    const [rank, setRank] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    const formatDuration = (durationInSeconds) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        return `${hours} hrs ${minutes} mins ${seconds} seconds`;
    };

    useEffect(() => {
        const fetchScoreAndRank = async () => {
            try {
                const scoreResponse = await axios.get(`${baseURL}api/score/${rollNumber}`);
                const rankResponse = await axios.get(`${baseURL}api/rank/${rollNumber}`);
                setScore(scoreResponse.data.score);
                setRank(rankResponse.data.rank);
            } catch (error) {
                console.error('Error fetching score or rank:', error);
            }
        };

        const fetchLeaderboard = async () => {
            try {
                const leaderboardResponse = await axios.get(`${baseURL}api/leaderboard`);
                setLeaderboard(leaderboardResponse.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchScoreAndRank();
        fetchLeaderboard();
    }, [rollNumber]);

    if (score === null || rank === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="tped-question-main main">
            <div className="roll">
                <p>{rollNumber}</p>
                <img src={techno} alt="" />
            </div>

            <div className='content'>
                <div className='Congratulations'>Congratulations!</div>
                <div className='statement'>
                    <p>You have successfully completed technopedia</p>
                    <p>Your Score is <span style={{ fontWeight: 'bold', color: 'black' }}>{score}/32 points</span></p>
                    <p>You have taken time: <span style={{ color: 'red' }}>{formatDuration(examDuration)}</span></p>
                    <p>Your Leaderboard Rank: <span style={{ fontWeight: 'bold', color: 'black' }}>{rank}</span></p>
                    <p style={{color:'red'}}><span style={{fontWeight:'bold', color:'red'}}>Note:</span>Your rank is bound to change as more students attempt the quiz.</p>
                </div>

          
            </div>
        </div>
    );
};

export default ResultPage;