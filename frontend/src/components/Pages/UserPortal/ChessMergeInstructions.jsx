import React, { useState } from "react";
import "./ChessMergeInstructions.css";

const ChessMergeInstructions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleClose = (e) => {
    e.stopPropagation(); 
    setExpanded(false);
  };

  return (
    <>
      <button className="instruction-btn" onClick={handleExpand}>
        Show Instructions
      </button>

      <div className={`chess-instr ${expanded ? "expanded" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
      
        <h2>CHESS MERGE INSTRUCTIONS</h2>
        
        <div className="instructions-content">
          <h3>🎮 How to Play</h3>
          <ul>
            <li><strong>Select a Piece:</strong> Click on any of your pieces to select it. The selected piece will have a <span className="highlight-red">black background</span>.</li>
            <li><strong>Move Pieces:</strong> After selecting a piece, click on a destination square to move it there.</li>
            <li><strong>Merge Pieces:</strong> When two identical pieces collide, they merge into a higher-value piece.</li>
            <li><strong>Piece Hierarchy:</strong> Pawn → Rook → Knight → Bishop → Queen</li>
          </ul>

          <h3>⚡ Special Actions</h3>
          <ul>
            <li><strong>Promote:</strong> Select a piece and click the "Promote" button to upgrade it to the next level (only up to Rook).</li>
            <li><strong>Swap Mode:</strong> Click "Swap Mode" to swap positions of two of your pieces:
            <ul>
    <li>First, click on the first piece you want to swap; the selected piece will have a black background.</li>
    <li>Then, click on the second piece to select it; the second piece will not be highlighted with a black background.</li>
    <li>Both pieces must belong to the current player.</li>
    <li>After selecting both pieces, click on the 'Swap' button to swap their positions.</li>
    <li>After swapping, the selection will reset automatically, and you can start the next move.</li>
</ul>

            </li>
          </ul>

          <h3>🏆 Victory Conditions</h3>
          <ul>
            <li><strong>Victory by Queen:</strong> First player to successfully merge pieces to form a Queen wins!</li>
            <li><strong>Victory by Timer:</strong> When the timer runs out, the game ends and the opponent wins.</li>
            <li><strong>Tie-Breaking:</strong> If multiple players achieve victory by Queen, the one with fewer moves wins.</li>
          </ul>

          {/* <h3>🎯 Game Controls</h3>
          <ul>
            <li><strong>Black Background:</strong> Currently selected piece</li>
            <li><strong>Blue Background:</strong> First piece selected in swap mode</li>
            <li><strong>Hover Effects:</strong> Pieces and squares highlight when you hover over them</li>
            <li><strong>Timer:</strong> Game has a time limit - watch the countdown!</li>
            <li><strong>Move Counter:</strong> Tracks the number of moves for each player</li>
          </ul> */}

          <h3>📋 Game Rules</h3>
          <ul>
            <li>Players alternate turns (White starts first)</li>
            <li>You can only move your own pieces</li>
            <li>Traditional chess movement rules apply</li>
            <li>When timer runs out, the current player loses</li>
            {/* <li>Each move counts towards your total move count</li> */}
            {/* <li>Promoting and swapping also count as moves</li> */}
          </ul>

          <h3>🎲 Strategic Tips</h3>
          <ul>
            <li>Plan your merges carefully - identical pieces must collide to merge</li>
            <li>Use the Promote button strategically to build up your pieces</li>
            <li>Swap pieces to create better positioning for merges</li>
            <li>Watch the timer and make efficient moves</li>
            <li>Remember: only up to Rook promotion is allowed with the Promote button</li>
          </ul>

          <div className="important-note">
            <strong>⚠️ Important:</strong> Do not reload the page during gameplay as this will result in immediate disqualification!
            <strong>This game is supported only on PC.</strong>
            </div>
        </div>
      </div>
    </>
  );
};

export default ChessMergeInstructions;