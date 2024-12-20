import React, { useState } from 'react';

const Button = ({ color, text, onClick }) => {
    
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: isHovered ? darkenColor(color) : color,
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: darkenColor(color), 
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const darkenColor = (color) => {
    const darkenPercentage = 20;

  // color components
  const red = parseInt(color.slice(-6, -4), 16);
  const green = parseInt(color.slice(-4, -2), 16);
  const blue = parseInt(color.slice(-2), 16);

  // Calculate the darkened color components
  const darkenedRed = Math.max(0, red - (red * darkenPercentage) / 100);
  const darkenedGreen = Math.max(0, green - (green * darkenPercentage) / 100);
  const darkenedBlue = Math.max(0, blue - (blue * darkenPercentage) / 100);
  return `rgba(${Math.round(darkenedRed)}, ${Math.round(darkenedGreen)}, ${Math.round(darkenedBlue)}, 0.8)`;

  
};

export default Button;
