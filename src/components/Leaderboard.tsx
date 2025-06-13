import React, { useState, useEffect } from 'react';
import './styles/Leaderboard.css';

interface LeaderboardProps {
  finalScore: number;
  gameEnded: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ finalScore, gameEnded }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (gameEnded && finalScore > highScore) {
      setHighScore(finalScore);
    }
  }, [gameEnded, finalScore, highScore]);

  return (
    <div className="leaderboard-card">
      <div className="score-section">
        <div className="label">Current Score</div>
        <div className="value">{finalScore}</div>
      </div>
      <div className="score-section">
        <div className="label">High Score</div>
        <div className="value">{highScore}</div>
      </div>
    </div>
  );
};

export default Leaderboard;
