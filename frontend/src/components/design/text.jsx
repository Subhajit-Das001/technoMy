import React from "react";
import bubbleStyles from "./text.modules.css";
const BubbleText = () => {
  return (
    <div className="bubble-text-wrapper">
      <h2 className="bubble-text">
        {"The Ultimate Test of Logic".split("").map((child, idx) => (
          <span className="hover-text" key={idx}>
            {child}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default BubbleText;