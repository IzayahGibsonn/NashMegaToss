import React, { createContext, useState, useRef, useEffect } from 'react';

interface TimerContextType {
  timeLeft: number;
  running: boolean;
  start: () => void;
  reset: () => void;
  addSeconds: (n: number) => void;    
}

export const TimerContext = createContext<TimerContextType>({
  timeLeft: 0,
  running: false,
  start: () => {},
  reset: () => {},
  addSeconds: () => {},                
});

export const TimerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // countdown effect
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

  const start = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setTimeLeft(30);
    setRunning(true);
  };

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setTimeLeft(30);
    setRunning(false);
  };

  const addSeconds = (n: number) => {
    setTimeLeft(t => t + n);
  };

  return (
    <TimerContext.Provider value={{ timeLeft, running, start, reset, addSeconds }}>
      {children}
    </TimerContext.Provider>
  );
};
