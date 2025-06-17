// src/components/AdminScreen.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import Leaderboard from './Leaderboard';
import { TimerContext } from '../context/TimerContext';
import './styles/AdminScreen.css';

interface AdminScreenProps {
  onShotMade: (hoopIndex: number) => void;
  onResetVideos: () => void;
  onStart: () => void;
}

// Enter starts, '0' resets
const KEY_START = 'Enter';
const KEY_RESET = 'Digit0';
const SHOT_KEYS = [
  { code: 'Numpad1', label: '1', points: 5 },
  { code: 'Numpad2', label: '2', points: 10 },
  { code: 'Numpad3', label: '3', points: 15 },
  { code: 'Numpad4', label: '4', points: 25 },
  { code: 'Numpad5', label: '5', points: 50 },
  { code: 'Digit1',  label: '1', points: 5 },
  { code: 'Digit2',  label: '2', points: 10 },
  { code: 'Digit3',  label: '3', points: 15 },
  { code: 'Digit4',  label: '4', points: 25 },
  { code: 'Digit5',  label: '5', points: 50 },
] as const;

// extract the 5 unique labels
const UNIQUE_LABELS = Array.from(new Set(SHOT_KEYS.map(k => k.label)));

const AdminScreen: React.FC<AdminScreenProps> = ({
  onShotMade,
  onResetVideos,
  onStart,
}) => {
  const [points, setPoints] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const { timeLeft, running, reset, addSeconds } = useContext(TimerContext);

  const buzzerRef = useRef<HTMLAudioElement>(null);
  const shotSoundRef = useRef(new Audio('/assets/sounds/shotSounds/shotSound.mp3'));

  // helper to reset game state
  const resetAll = () => {
    reset();
    setPressed({});
    setPoints(0);
    onResetVideos();
  };

  // buzzer when time hits zero
  useEffect(() => {
    if (timeLeft === 0) buzzerRef.current?.play();
  }, [timeLeft]);

  // keyboard handling
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log(
        `[AdminScreen] keydown → code="${e.code}", running=${running}, timeLeft=${timeLeft}`
      );

      if (e.code === KEY_RESET) {
        resetAll();
        return;
      }

      if (!running && e.code === KEY_START) {
        console.log('[AdminScreen] Starting game…');
        resetAll();
        onStart();
        return;
      }

      // ignore if not running or time’s up
      if (!running || timeLeft <= 0) return;

      // find which shot
      const shot = SHOT_KEYS.find(k => k.code === e.code);
      if (!shot || pressed[shot.label]) return;

      onShotMade(Number(shot.label));

      // play shot sound
      const s = shotSoundRef.current;
      s.pause(); s.currentTime = 0;
      s.play().catch(console.error);

      // mark label pressed
      setPressed(prev => {
        const updated = { ...prev, [shot.label]: true };
        const count = Object.keys(updated).length;

        if (count === UNIQUE_LABELS.length) {
          // final shot: add points + remaining time
          setPoints(prevPts => prevPts + shot.points + timeLeft);
          reset();
        } else {
          // normal shot: add points + bonus seconds
          setPoints(prevPts => prevPts + shot.points);
          addSeconds(2);
        }
        return updated;
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, pressed, timeLeft, onShotMade, resetAll, reset, addSeconds, onStart]);

  const shotsMade = Object.keys(pressed).length;
  const gameEnded = !running && (timeLeft === 0 || shotsMade === UNIQUE_LABELS.length);

  return (
    <div className="admin-screen">
      <Leaderboard finalScore={points} gameEnded={gameEnded} />
      <audio ref={buzzerRef} src="/assets/sounds/buzzer.mp3" preload="auto" />
    </div>
  );
};

export default AdminScreen;
