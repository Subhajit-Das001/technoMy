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
         Instructions
      </button> 

      <div className={`chess-instr ${expanded ? "expanded" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
      
        <h2>PAWN GAMBIT INSTRUCTIONS</h2>
<p className="intro-line">
  <strong>This game was played in the mains event of Technothlon 2025-26 held in IIT Guwahati</strong>
</p>

<div className="instructions-content">
  <h3>🎮 How to Play</h3>
  <ul>
    <li><strong>Start Your Run:</strong> You begin the game controlling a single Black Pawn.</li>
    <li><strong>Your Move:</strong> Move your piece (Pawn, or later upgraded to Rook, Bishop, or Queen) according to standard chess rules.</li>
    <li><strong>Opponent Spawns:</strong> After your move, a new White piece appears randomly on an unoccupied square.</li>
    <li><strong>Opponent Movement:</strong> Existing White pieces will actively reposition to close the distance to your piece.</li>
    <li><strong>Earning XP:</strong> Accumulate Experience Points (XP) throughout the rounds by surviving turns, dodging attacks, and capturing opponent pieces.</li>
  </ul>

  <h3>⚡ Special Actions</h3>
  <ul>
    <li><strong>Upgrade Piece:</strong> As you progress, upgrade your starting Black Pawn into more powerful pieces to increase your mobility and survival chances.</li>
    <li><strong>Calculated Dodging:</strong> While you cannot place your piece in check after a move, you will often find yourself in "danger positions." Choose wisely when to take a calculated risk and when to dodge.</li>
  </ul>

  <h3>🏆 Victory Conditions</h3>
  <ul>
    <li><strong>Victory by Score:</strong> Accumulate the highest total XP over the course of the 4 rounds to win.</li>
    <li><strong>Tie-Breaking:</strong> If players have identical XP at the end of the game, the player with the highest amount of collected Gems receives the higher rank.</li>
    <li><strong>Game Over:</strong> If you lose all 5 of your lives within any single round, your run ends immediately.</li>
  </ul>

  <h3>📋 Game Rules</h3>
  <ul>
    <li><strong>Lives System:</strong> You start each of the 4 rounds with 5 lives. You lose 1 life if your piece is captured.</li>
    <li><strong>Round 1 - Recruit's Gauntlet:</strong> Familiarize yourself with the core mechanics and basic survival strategies.</li>
    <li><strong>Round 2 - Veteran's Crucible:</strong> The challenge intensifies with more frequent and aggressive opponent spawns.</li>
    <li><strong>Round 3 - Champion's Trial:</strong> Face a unique mystery crafted specifically for a champion's mind.</li>
    <li><strong>Round 4 - The Final Stand:</strong> A final stand awaits you, with a problem you must break through.</li>
  </ul>

  <h3>🎲 Strategic Tips</h3>
  <ul>
    <li>Plan your moves carefully — every move you make triggers both a new enemy spawn and enemy repositioning.</li>
    <li>Sometimes surviving means moving into a danger zone to set up a capture or a better dodge next turn.</li>
    <li>Protect your lives! Don't take unnecessary risks early in a round.</li>
    <li>Use your piece upgrades wisely to counter the aggressive swarms in later rounds.</li>
  </ul>

  <div className="important-note">
    <strong>⚠️ Important:</strong> Do not reload the page during gameplay as this will result in immediate disqualification!
    <strong> This game is supported only on PC.</strong>
  </div>
</div>
      </div>
    </>
  );
};

export default ChessMergeInstructions;