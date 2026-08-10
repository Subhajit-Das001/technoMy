import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdSearch } from 'react-icons/md'; // Removed trophy icon
import { FaGlobe, FaInstagram } from 'react-icons/fa';

// Assets
import iitg2 from '../../Assets/img/iitg2.png';
import techniche from '../../Assets/img/technicheb.png';
import logo1 from '../../Assets/img/logo2.png';
import ob from '../../Assets/img/ob.png';

import './result_table.css';

const ResultTable = () => {
  const [top25Juniors, setTop25Juniors] = useState([]);
  const [top25Hauts, setTop25Hauts] = useState([]);
  const [stateToppersJuniors, setStateToppersJuniors] = useState([]);
  const [stateToppersHauts, setStateToppersHauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('top25');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const baseURL = process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await axios.get(`${baseURL}uploadcsv/results-table`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setTop25Juniors(response.data.top25Juniors || []);
        setTop25Hauts(response.data.top25Hauts || []);
        setStateToppersJuniors(response.data.stateToppersJuniors || []);
        setStateToppersHauts(response.data.stateToppersHauts || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get rank emoji
  const getRankEmoji = (rank) => {
    const numRank = parseInt(rank);
    if (numRank === 1) return '🥇';
    if (numRank === 2) return '🥈';
    if (numRank === 3) return '🥉';
    return null;
  };

  // Helper to get rank class
  const getRankClass = (rank) => {
    const numRank = parseInt(rank);
    if (numRank === 1) return 'rank-1';
    if (numRank === 2) return 'rank-2';
    if (numRank === 3) return 'rank-3';
    return '';
  };

  const formatName = (name) => name || 'N/A';

  const filterData = (data) => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.name1 && item.name1.toLowerCase().includes(lowerSearch)) ||
      (item.name2 && item.name2.toLowerCase().includes(lowerSearch)) ||
      (item.rollNumber && item.rollNumber.toLowerCase().includes(lowerSearch)) ||
      (item.state && item.state.toLowerCase().includes(lowerSearch))
    );
  };

  const renderTableRows = (data) => {
    const filteredData = filterData(data);

    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="resulttable-no-data">
            {searchTerm ? 'No results found.' : 'No results available.'}
          </td>
        </tr>
      );
    }

    return filteredData.map((team, index) => {
      const rankEmoji = getRankEmoji(team.Rank);
      return (
        <tr key={team.rollNumber || index} className="resulttable-table-row">
          <td className="resulttable-rank-col">
             <span className={`rank-badge ${getRankClass(team.Rank)}`}>
               {rankEmoji ? <span className="rank-emoji">{rankEmoji}</span> : (team.Rank || '-')}
             </span>
          </td>
          <td className="resulttable-name-col">
              <div className="name-primary">{formatName(team.name1)}</div>
          </td>
          <td className="resulttable-name-col">
              <div className="name-secondary">{formatName(team.name2)}</div>
          </td>
          <td className="resulttable-roll-col">{team.rollNumber || 'N/A'}</td>
          <td className="resulttable-city-col">{team.state || 'N/A'}</td>
        </tr>
      );
    });
  };

  const renderStateSection  = (data, title) => {
    const filteredData = filterData(data);

    if (filteredData.length === 0) {
      return (
        <div className="resulttable-no-data-card">
          {searchTerm ? 'No matches found.' : 'No data available.'}
        </div>
      );
    }

    return (
      <div className="resulttable-city-column">
        <h3 className="category-header-text">{title} Toppers</h3>
        <div className="city-cards-container">
          {filteredData.map((topper, index) => {
             const rankEmoji = getRankEmoji(topper.Rank);
             return (
              <div key={topper.state || index} className="city-card">
  <div className="city-card-header">
    <span className="city-icon">📍</span>
    <span className="city-name">{topper.state || 'Unknown'}</span>
  </div>
                <div className="city-card-body">
                  <div className="team-names">
                    {formatName(topper.name1)} <span className="amp">&</span> {formatName(topper.name2)}
                  </div>
                  <div className="team-meta">
                    <span className="roll-pill">{topper.rollNumber}</span>
                    <span className="rank-pill">
                      {rankEmoji && <span className="rank-emoji-pill">{rankEmoji}</span>}
                      AIR {topper.Rank}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="wrapper-reg">
      {/* Header */}
      <div className="header-banner-reg">
        <div className="logo-container-reg">
          <img src={iitg2} alt="IIT Guwahati" className="institution-logo-reg" />
          <div className="ob-reg" style={{ backgroundImage: `url(${ob})` }}>
            <img 
              src={logo1} 
              alt="Technothlon" 
              className="main-logo-reg"
              onClick={handleLogoClick}
            />
          </div>
          <img src={techniche} alt="Techniche" className="partner-logo-reg" />
        </div>
      </div>

      <div className="containe">
        {/* Compact Header */}
        <div className="page-header-section-compact">
            <h1 className="official-results-title-compact">Technothlon 2026 Prelims Results</h1>
        </div>
    
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading Results...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3>Unable to load results</h3>
            <p>{error}</p>
            <button onClick={fetchResults}>Retry</button>
          </div>
        ) : (
          <div className="results-wrapper">
            
            {/* Toolbar: Search + Toggles */}
            <div className="results-toolbar">
  {/* Search */}
  <div className="search-wrapper">
    <MdSearch className="search-icon" />
    <input
      type="text"
      placeholder="Search Name, Roll Number, or State..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Actions */}
  <div className="toolbar-actions">
    <button
      onClick={() => navigate('/login')}
      className="check-result-btn"
    >
      Check Your Result
    </button>

    <div className="toggle-container">
      <button
        className={`toggle-btn ${activeTab === 'top25' ? 'active' : ''}`}
        onClick={() => setActiveTab('top25')}
      >
        Top 25 Teams
      </button>

      <button
        className={`toggle-btn ${activeTab === 'stateToppers' ? 'active' : ''}`}
        onClick={() => setActiveTab('stateToppers')}
      >
        State Toppers
      </button>
    </div>
  </div>
</div>

            {/* Tables / Grid */}
            <div className="content-area">
              {activeTab === 'top25' && (
                <div className="tables-grid">
                    {/* Juniors Table */}
                    <div className="table-card">
                        <div className="table-header-strip juniors-strip">
                            <h3>Juniors Category</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th style={{width: '12%'}}>Rank</th>
                                        <th style={{width: '24%'}}>Name 1</th>
                                        <th style={{width: '24%'}}>Name 2</th>
                                        <th style={{width: '20%'}}>Roll No.</th>
                                        <th style={{width: '20%'}}>State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows(top25Juniors)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Hauts Table */}
                    <div className="table-card">
                        <div className="table-header-strip hauts-strip">
                            <h3>Hauts Category</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th style={{width: '12%'}}>Rank</th>
                                        <th style={{width: '24%'}}>Name 1</th>
                                        <th style={{width: '24%'}}>Name 2</th>
                                        <th style={{width: '20%'}}>Roll No.</th>
                                        <th style={{width: '20%'}}>City</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows(top25Hauts)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'stateToppers' && (
                <div className="city-grid">
                    {renderStateSection(stateToppersJuniors, 'Juniors')}
                    {renderStateSection(stateToppersHauts, 'Hauts')}
                </div>
              )}
            </div>
            
            {/* <div className="timestamp-footer">
               Results last updated: {new Date().toLocaleDateString()}
            </div> */}
          </div>
        )}
      </div>

      <footer className="contact-footer-reg">
        <div className="contact-links-reg">
          <a href="mailto:technothlon@iitg.ac.in">
            <MdEmail className="footer-icon-reg" /> <span>technothlon@iitg.ac.in</span>
          </a>
          <a href="https://technothlon.techniche.org.in">
            <FaGlobe className="footer-icon-reg" /> <span>technothlon.techniche.org.in</span>
          </a>
          <a href="https://instagram.com/technothlon.iitg">
            <FaInstagram className="footer-icon-reg" /> <span>technothlon.iitg</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ResultTable;