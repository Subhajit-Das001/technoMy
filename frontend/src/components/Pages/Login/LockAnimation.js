import React from "react";
import "./lg.css";

const LockAnimation = ({ roll, isUnlocked }) => {
  return (
    <div className="lock-container">
      <svg
        className="lock-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 348 358"
        fill="none"
      >
        {/* Lock Handle */}
        <path
          className={`lock-handle ${isUnlocked ? "unlocked" : ""}`}
          d="M325 335V174C325 90.605 257.395 23 174 23C90.605 23 23 90.605 23 174V335"
          stroke="#FA9D1D"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lock Body */}
        <rect
          x="3"
          y="270"
          width="378"
          height="260"
          rx="15"
          fill="#FA9D1D"
          stroke="#FA9D1D"
          strokeWidth="10"
        />
      </svg>

      {/* Lock Dials */}
      <div className="dials-wrapper">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="lock-dial">
            <div className="lock-number">
              {roll[index] || "0"} {/* Show roll number digits or default '0' */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LockAnimation;
