import React, { useState, useEffect } from 'react';
import technoLogo from '../../Assets/img/logo2.png';
import leftCurtain from '../../Assets/img/curtain.jpg';  // Add your curtain images
import rightCurtain from '../../Assets/img/curtain.jpg';

const TheaterCurtain = ({ startTime, endTime, contestTitle }) => {
  const [curtainOffset, setCurtainOffset] = useState(0); // Start closed (0)
  
  useEffect(() => {
    const updateCurtainPosition = () => {
      const now = new Date();
      const start = new Date(startTime);
      const sevenDaysBefore = new Date(start.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      if (now >= sevenDaysBefore && now <= start) {
        const totalTimeframe = start - sevenDaysBefore;
        const timeLeft = start - now;
        const progress = (totalTimeframe - timeLeft) / totalTimeframe;
        // Start from 0 and open up to 70%
        const offset = progress * 70;
        setCurtainOffset(Math.min(70, offset));
      } else if (now > start) {
        // Contest has started - fully open curtains
        setCurtainOffset(100);
      } 
    };

    updateCurtainPosition();
    const interval = setInterval(updateCurtainPosition, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="theater-curtain">
      <div className="stage">
        <img 
          src={technoLogo} 
          alt="Technothlon Logo" 
          className="techno-logo"
        />
        <h1 className="contest-title">{contestTitle}</h1>
        
        <div className="curtain-container">
          {/* Left Curtain */}
          <div 
            className="curtain curtain-left"
            style={{
              transform: `translateX(-${curtainOffset}%)`,
              backgroundImage: `url(${leftCurtain})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center'
            }}
          />
          
          {/* Right Curtain */}
          <div 
            className="curtain curtain-right"
            style={{
              transform: `translateX(${curtainOffset}%)`,
              backgroundImage: `url(${rightCurtain})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TheaterCurtain;