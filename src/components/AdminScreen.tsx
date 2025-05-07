// src/components/AdminScreen.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import Leaderboard from './Leaderboard';
import TimerDisplay from './Timer';
import { TimerContext } from '../context/TimerContext';
import './styles/AdminScreen.css';

interface AdminScreenProps {
  onShotMade: (hoopIndex: number) => void;
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

// 1) your per‐shot sound files, in order
const SHOT_SOUNDS = [
  '/assets/sounds/shotSounds/shot1.mp3',
  '/assets/sounds/shotSounds/shot2.mp3',
  '/assets/sounds/shotSounds/shot3.mp3',
  '/assets/sounds/shotSounds/shot4.mp3',
  '/assets/sounds/shotSounds/shot5.mp3',
] as const;

const AdminScreen: React.FC<AdminScreenProps> = ({ onShotMade }) => {
  const [score, setScore] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});

  // pull from context
  const { timeLeft, running, start, reset, addSeconds } =
    useContext(TimerContext);

  const buzzerRef = useRef<HTMLAudioElement>(null);

  // play buzzer when clock hits zero
  useEffect(() => {
    if (timeLeft === 0) {
      buzzerRef.current?.play();
    }
  }, [timeLeft]);

  // keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // U always resets
      if (e.code === KEY_RESET) {
        reset();
        setPressed({});
        setScore(0);
        return;
      }

      // Y starts (if not running)
      if (!running && e.code === KEY_START) {
        reset();
        setPressed({});
        setScore(0);
        setTimeout(start, 0);
        return;
      }

      // no shots if game isn't active
      if (!running || timeLeft <= 0) return;

      // which shot key?
      const shot = SHOT_KEYS.find(k => k.code === e.code);
      if (!shot || pressed[e.code]) return;

      // trigger video
      onShotMade(parseInt(shot.label, 10));

      // mark it pressed & update score
      const next = { ...pressed, [e.code]: true };
      setPressed(next);
      const madeCount = Object.keys(next).length;

      // 2) play sequence sound
      const soundSrc = SHOT_SOUNDS[madeCount - 1];
      new Audio(soundSrc).play().catch(console.error);

      if (madeCount === SHOT_KEYS.length) {
        // final basket: include leftover time
        setScore(s => s + shot.points + timeLeft);
        reset();
      } else {
        setScore(s => s + shot.points);
        addSeconds(2);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, pressed, timeLeft, onShotMade, reset, start, addSeconds]);

  const gameEnded =
    !running &&
    (timeLeft === 0 || Object.keys(pressed).length === SHOT_KEYS.length);

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
              <div className="shot-indicator">
                {pressed[k.code] ? '✅' : '❌'}
              </div>
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
            setTimeout(start, 0);
          }}
        >
          Start
        </button>
        <button
          className="control-button"
          onClick={() => {
            reset();
            setPressed({});
            setScore(0);
          }}
        >
          Reset
        </button>
      </div>

      {/* buzzer sound when time runs out */}
      <audio
        ref={buzzerRef}
        src="/assets/sounds/buzzer.mp3"
        preload="auto"
      />
    </div>
  );
};

export default AdminScreen;
