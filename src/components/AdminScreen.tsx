// AdminScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import Leaderboard from './Leaderboard';
import './styles/AdminScreen.css';    // <-- import the stylesheet

interface AdminScreenProps {
  /** called with 1–5 whenever that hoop goes in */
  onShotMade: (hoopIndex: number) => void;
}

const KEY_START = 'KeyY';
const SHOT_KEYS = [
  { code: 'KeyQ', label: '1', points: 5 },
  { code: 'KeyW', label: '2', points: 10 },
  { code: 'KeyE', label: '3', points: 15 },
  { code: 'KeyR', label: '4', points: 25 },
  { code: 'KeyT', label: '5', points: 50 },
] as const;


const AdminScreen: React.FC<AdminScreenProps> = ({ onShotMade }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setPressed({});
    setScore(0);
    setTimeLeft(30);
    setRunning(false);
  };

  // timer
  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalRef.current!);
  }, [running]);

  // shots + video callback
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // start on Digit0
      if (!running && e.code === KEY_START) {
        reset();
        setTimeout(() => setRunning(true), 0);
        return;
      }
      if (!running || timeLeft <= 0) return;

      const shot = SHOT_KEYS.find(k => k.code === e.code);
      if (!shot || pressed[e.code]) return;

      // fire the external callback
      const hoopIdx = parseInt(shot.label, 10);
      onShotMade(hoopIdx);

      // update pressed & scoring
      const next = { ...pressed, [e.code]: true };
      setPressed(next);
      const madeCount = Object.keys(next).length;

      if (madeCount === SHOT_KEYS.length) {
        window.clearInterval(intervalRef.current!);
        setScore(s => s + shot.points + timeLeft);
        setRunning(false);
      } else {
        setScore(s => s + shot.points);
        setTimeLeft(t => t + 30);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, pressed, timeLeft, onShotMade]);

  const gameEnded =
    !running &&
    (timeLeft === 0 || Object.keys(pressed).length === SHOT_KEYS.length);

  return (
    <div className="admin-screen">
      {/* top row: timer & score */}
      <div className="top-row">
        <div className="timer">⏱ {timeLeft}s</div>
        <div className="score">🏀 {score}</div>
      </div>

      {/* Leaderboard */}
      <Leaderboard finalScore={score} gameEnded={gameEnded} />

      {/* shot status wrapped in a card */}
      <div className="card shot-card">
        <div className="shot-status-row">
          {SHOT_KEYS.map(k => (
            <div key={k.code} className="shot-key">
              <div className="shot-label">{k.label}</div>
              <div className="shot-indicator">
                {pressed[k.code] ? '✅' : '❌'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* buttons row */}
      <div className="button-row two-buttons">
        <button
          className="control-button"
          onClick={() => {
            reset();
            setTimeout(() => setRunning(true), 0);
          }}
        >
          Start
        </button>
        <button className="control-button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default AdminScreen;
