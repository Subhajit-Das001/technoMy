import React, { useState } from "react";
import "./ChessGamePage.css";
import ChessMergeInstructions from './ChessMergeInstructions'

const ChessGamePage = ({ onFullscreenToggle, isFullscreen }) => {
  const [isGameFullscreen, setIsGameFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    setIsGameFullscreen(!isGameFullscreen);
    if (onFullscreenToggle) {
      onFullscreenToggle(!isGameFullscreen);
    }
  };

  const handleBackToProfile = () => {
    setIsGameFullscreen(false);
    if (onFullscreenToggle) {
      onFullscreenToggle(false);
    }
  };

  return (
    <div className={`chess-game-container ${isGameFullscreen ? 'chess-fullscreen' : ''}`}>
      {/* Fullscreen Header - Only show when in fullscreen mode */}
      {isGameFullscreen && (
        <div className="chess-fullscreen-header">
          <button 
            className="back-to-profile-btn"
            onClick={handleBackToProfile}
          >
            ← Back to Profile
          </button>
          <h1 className="chess-title">
            Play Chess – Technothlon Edition ♟️
          </h1>
        </div>
      )}

      {/* Normal Header - Only show when not in fullscreen mode */}
      {!isGameFullscreen && (
        <div className="chess-normal-header">
          <h1 className="chess-title">
            Play Chess – Technothlon Edition ♟️
          </h1>
          <button 
            className="fullscreen-btn"
            onClick={handleFullscreenToggle}
          >
            🖥️ Fullscreen Mode
          </button>
          <div>
          <ChessMergeInstructions/>
        </div>
        </div>
      )}
      
      <div className="chess-iframe-wrapper">
        <iframe
          src="https://chess-crowned-2czv.vercel.app/"
          title="Chess Game"
          className="chess-iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ChessGamePage;