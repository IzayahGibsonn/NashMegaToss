// src/components/AdminScreen.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import Leaderboard from './Leaderboard';
import { TimerContext } from '../context/TimerContext';
import './styles/AdminScreen.css';

interface AdminScreenProps {
  onShotMade: (hoopIndex: number) => void;
  onResetVideos: () => void;
}

const KEY_START = 'NumpadEnter';
const KEY_RESET = 'Numpad0';

const SHOT_KEYS = [
  { code: 'Numpad1', label: '1', points: 5 },
  { code: 'Numpad2', label: '2', points: 10 },
  { code: 'Numpad3', label: '3', points: 15 },
  { code: 'Numpad4', label: '4', points: 25 },
  { code: 'Numpad5', label: '5', points: 50 },
] as const;

const AdminScreen: React.FC<AdminScreenProps> = ({ onShotMade, onResetVideos }) => {
  const [points, setPoints] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const { timeLeft, running, start, reset, addSeconds } = useContext(TimerContext);

  const buzzerRef = useRef<HTMLAudioElement>(null);
  const shotSoundRef = useRef(new Audio('/assets/sounds/shotSounds/shotSound.mp3'));

  // buzzer on zero
  useEffect(() => {
    if (timeLeft === 0) buzzerRef.current?.play();
  }, [timeLeft]);

  // main key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Reset
      if (e.code === KEY_RESET) {
        reset();
        setPressed({});
        setPoints(0);
        onResetVideos();
        return;
      }
      // Start
      if (!running && e.code === KEY_START) {
        reset();
        setPressed({});
        setPoints(0);
        onResetVideos();
        setTimeout(start, 0);
        return;
      }
      // During game
      if (!running || timeLeft <= 0) return;

      const shot = SHOT_KEYS.find(k => k.code === e.code);
      if (!shot || pressed[e.code]) return;

      onShotMade(Number(shot.label));
      // play shot sound
      const s = shotSoundRef.current;
      s.pause(); s.currentTime = 0; s.play().catch(console.error);

      // update pressed + points
      setPressed(prev => {
        const updated = { ...prev, [e.code]: true };
        const madeCount = Object.keys(updated).length;

        if (madeCount === SHOT_KEYS.length) {
          // final shot: add shot points + remaining time
          setPoints(prevPts => prevPts + shot.points + timeLeft);
          reset();
        } else {
          // not final: add shot points and bonus seconds
          setPoints(prevPts => prevPts + shot.points);
          addSeconds(2);
        }

        return updated;
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, pressed, timeLeft, onShotMade, onResetVideos, reset, start, addSeconds]);

  // gameEnded flips true when time=0 or all shots done
  const gameEnded = !running && (timeLeft === 0 || Object.keys(pressed).length === SHOT_KEYS.length);

  return (
    <div className="admin-screen">
      <Leaderboard finalScore={points} gameEnded={gameEnded} />
      <div className="card shot-card">
        {/* <div className="shot-status-row">
          {SHOT_KEYS.map(k => (
            <div key={k.code} className="shot-key">
              <div className="shot-label">{k.label}</div>
              <div className="shot-indicator">{pressed[k.code] ? '✅' : '❌'}</div>
            </div>
          ))}
        </div> */}
      </div>
      <audio ref={buzzerRef} src="/assets/sounds/buzzer.mp3" preload="auto" />
    </div>
  );
};

export default AdminScreen;
