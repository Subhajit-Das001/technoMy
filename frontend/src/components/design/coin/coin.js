import React from "react";
import "./coin.css";

const SpinningCoin = ({ imageSrc, altText = "Spinning Coin", size = 100 }) => {
  return (
    <div
      className="coin-container"
      style={{ width: size, height: size }}
    >
      <div className="coin">
        <img src={imageSrc} alt={altText} />
      </div>
    </div>
  );
};

export default SpinningCoin;
