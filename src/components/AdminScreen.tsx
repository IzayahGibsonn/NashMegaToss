// src/components/AdminScreen.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import Leaderboard from './Leaderboard';
import TimerDisplay from './Timer';
import { TimerContext } from '../context/TimerContext';
import './styles/AdminScreen.css';

interface AdminScreenProps {
  onShotMade: (hoopIndex: number) => void;
  onResetVideos: () => void;
}

const KEY_START = 'KeyY';
const KEY_RESET = 'KeyU';

const SHOT_KEYS = [
  { code: 'KeyQ', label: '1', points: 5 },
  { code: 'KeyW', label: '2', points: 10 },
  { code: 'KeyE', label: '3', points: 15 },
  { code: 'KeyR', label: '4', points: 25 },
  { code: 'KeyT', label: '5', points: 50 },
] as const;

const AdminScreen: React.FC<AdminScreenProps> = ({ onShotMade, onResetVideos }) => {
  const [score, setScore] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});

  const { timeLeft, running, start, reset, addSeconds } = useContext(TimerContext);

  const buzzerRef = useRef<HTMLAudioElement>(null);
  // single shot sound instance
  const shotSoundRef = useRef(new Audio('/assets/sounds/shotSounds/shotSound.mp3'));

  // play buzzer when clock hits zero
  useEffect(() => {
    if (timeLeft === 0) {
      buzzerRef.current?.play();
    }
  }, [timeLeft]);

  // keyboard & button logic
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === KEY_RESET) {
        reset();
        setPressed({});
        setScore(0);
        onResetVideos();
        return;
      }

      if (!running && e.code === KEY_START) {
        reset();
        setPressed({});
        setScore(0);
        onResetVideos();
        setTimeout(start, 0);
        return;
      }

      if (!running || timeLeft <= 0) return;

      const shot = SHOT_KEYS.find(k => k.code === e.code);
      if (!shot || pressed[e.code]) return;

      onShotMade(parseInt(shot.label, 10));

      // play the one shot sound
      const s = shotSoundRef.current;
      s.pause();
      s.currentTime = 0;
      s.play().catch(console.error);

      // update pressed & score
      const next = { ...pressed, [e.code]: true };
      setPressed(next);
      const madeCount = Object.keys(next).length;

      if (madeCount === SHOT_KEYS.length) {
        setScore(s => s + shot.points + timeLeft);
        reset();
      } else {
        setScore(s => s + shot.points);
        addSeconds(2);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, pressed, timeLeft, onShotMade, onResetVideos, reset, start, addSeconds]);

  const gameEnded = !running && (timeLeft === 0 || Object.keys(pressed).length === SHOT_KEYS.length);

  return (
    <div className="admin-screen">
      <div className="top-row">
        <TimerDisplay timeLeft={timeLeft} />
        <div className="score">🏀 {score}</div>
      </div>

      <Leaderboard finalScore={score} gameEnded={gameEnded} />

      <div className="card shot-card">
        <div className="shot-status-row">
          {SHOT_KEYS.map(k => (
            <div key={k.code} className="shot-key">
              <div className="shot-label">{k.label}</div>
              <div className="shot-indicator">{pressed[k.code] ? '✅' : '❌'}</div>
              <div className="shot-keybind">{k.code.replace('Key', '')}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="button-row two-buttons">
        <button
          className="control-button"
          onClick={() => {
            reset();
            setPressed({});
            setScore(0);
            onResetVideos();
            setTimeout(start, 0);
          }}
        >
          Start {'{'}{KEY_START.replace('Key', '')}{'}'}
        </button>
        <button
          className="control-button"
          onClick={() => {
            reset();
            setPressed({});
            setScore(0);
            onResetVideos();
          }}
        >
          Reset {'{'}{KEY_RESET.replace('Key', '')}{'}'}
        </button>
      </div>

      <audio ref={buzzerRef} src="/assets/sounds/buzzer.mp3" preload="auto" />
    </div>
  );
};

export default AdminScreen;
