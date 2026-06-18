import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from "../../Assets/technologo.png";  // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 25;
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const baseURL = process.env.NODE_ENV === "production" 
                    ? "https://technothlon.techniche.org.in" 
                    : "http://localhost:3001";

                const response = await axios.get(`${baseURL}/api/contest/leaderboard`);
                
                if (response.data.showLeaderboard) {
                    setLeaderboardData(response.data.data);
                    setShowLeaderboard(true);
                } else {
                    setError('Leaderboard is not yet available');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const formatTime = (seconds) => {
        if (!seconds) return '-';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getQuestionStatus = (status, time, score) => {
        switch (status) {
            case 'correct':
                return (
                    <div className="status correct">
                        <FaCheck />
                        <div className="score-info">
                            <span className="time">{formatTime(time)}</span>
                            {/* <span className="score">(+{Math.round(score)})</span> */}
                        </div>
                    </div>
                );
            case 'incorrect':
                return (
                    <div className="status incorrect">
                        <FaTimes />
                    </div>
                );
            default:
                return (
                    <div className="status not-attempted">
                        <FaMinus />
                    </div>
                );
        }
    };

    const getRankDisplay = (rank) => {
        switch(rank) {
            case 1:
                return <span>{rank} 🥇</span>;
            case 2:
                return <span>{rank} 🥈</span>;
            case 3:
                return <span>{rank} 🥉</span>;
            default:
                return rank;
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getFilteredData = () => {
        return leaderboardData.filter(entry => 
            entry.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getCurrentPageData = () => {
        const filteredData = getFilteredData();
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);

    if (loading) {
        return (
            <div className="page-wrapper">
                {/* <button className="back-button-l" onClick={handleBack}>
                    ← Back
                </button> */}
                <div className="leaderboard-container">
                    <div className="loading">Loading leaderboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!showLeaderboard) {
        return (
            <div className="leaderboard-container">
                <div className="not-available">
                    <h2>Leaderboard Coming Soon</h2>
                    <p>The leaderboard will be available after the contest ends.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            {/* <button className="back-button-l" onClick={handleBack}>
                ← Back
            </button> */}
            <div className="leaderboard-container">
                <motion.div 
                    className="leaderboard-header"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="header-content">
                        <img src={Logo} alt="Technothlon Logo" className="techno-logo-leaderboard" />
                        <span className="presents-text">Presents</span>
                        <h1>Contest Leaderboard</h1>
                    </div>
                </motion.div>

                {/* <div className="search-container">
                    <input
                        type="text"
                        placeholder="🔍 Search by name..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="search-input"
                    />
                </div> */}

                <div className="leaderboard-table-container">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>School</th>
                                <th>Question A</th>
                                <th>Question B</th>
                                <th>Question C</th>
                                <th>Total Score</th>
                                {/* <th>Time Spent</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {getCurrentPageData().map((entry, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <td className="rank">{getRankDisplay((currentPage - 1) * rowsPerPage + index + 1)}</td>
                                    <td className="name">{entry.name}</td>
                                    <td className="school">{entry.school}</td>
                                    <td className="question-status">
                                        {getQuestionStatus(
                                            entry.questionA.status, 
                                            entry.questionA.time, 
                                            entry.questionA.score
                                        )}
                                    </td>
                                    <td className="question-status">
                                        {getQuestionStatus(entry.questionB.status, entry.questionB.time, entry.questionB.score)}
                                    </td>
                                    <td className="question-status">
                                        {getQuestionStatus(entry.questionC.status, entry.questionC.time, entry.questionC.score)}
                                    </td>
                                    <td className="total-score">{entry.totalScore}</td>
                                    {/* <td className="total-time">{formatTime(entry.totalTime)}</td> */}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
