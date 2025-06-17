// src/components/TimerDisplay.tsx
import React from 'react';
import './styles/Timer.css';

interface TimerDisplayProps {
  timeLeft: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  return (
    <div className="timer">
      {timeLeft}
    </div>
  );
};

export default TimerDisplay;
