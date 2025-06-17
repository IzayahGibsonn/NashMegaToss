
import React, { useEffect, useState } from 'react';
import './styles/CounterOverlay.css';

interface CountdownOverlayProps {
  visible: boolean;
  onComplete: () => void;
  startSoundSrc?: string;
}

const STEPS = ['3', '2', '1', 'GO!'];
const STEP_DURATION = 1000; // ms

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ visible, onComplete, startSoundSrc }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      return;
    }

    const audio = startSoundSrc ? new Audio(startSoundSrc) : null;
    if (audio) audio.play().catch(console.error);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(interval);
          onComplete();
        }
        return next;
      });
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || stepIndex >= STEPS.length) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-text">
        {STEPS[stepIndex]}
      </div>
    </div>
  );
};

export default CountdownOverlay;