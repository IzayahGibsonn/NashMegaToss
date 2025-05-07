import React, { useState, useEffect } from 'react';
import './styles/Leaderboard.css';

interface LeaderboardProps {
  finalScore: number;
  gameEnded: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ finalScore, gameEnded }) => {
  const [highScore, setHighScore] = useState(0);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (gameEnded && finalScore > highScore) {
      setHighScore(finalScore);
    }
  }, [gameEnded, finalScore, highScore]);

  const handleSetHighScore = () => {
    const num = parseInt(manualInput, 10);
    if (!isNaN(num) && num >= 0) {
      setHighScore(num);
      setManualInput('');
    }
  };

  return (
    <div className="leaderboard-card">
      <div className="leaderboard-header">High Score</div>
      <div className="leaderboard-score">{highScore}</div>
      <div className="leaderboard-input-row">
        <input
          type="number"
          value={manualInput}
          onChange={e => setManualInput(e.target.value)}
          placeholder="Score"
          className="leaderboard-input"
        />
        <button
          onClick={handleSetHighScore}
          className="leaderboard-button"
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
