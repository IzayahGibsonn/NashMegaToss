// src/App.tsx (aka MainScreen)
import React, { useRef, useEffect, useContext } from 'react';
import AdminScreen from './components/AdminScreen';
import TimerDisplay from './components/Timer';
import { TimerContext } from './context/TimerContext';
import './App.css';

const TEST_VIDEO = '/assets/videos/ritz_video.mp4';

// now each TV can have its own `video` field
const TVs = [
  { label: 'TV 1', hoop: 1, video: TEST_VIDEO },
  { label: 'TV 2', hoop: 2, video: TEST_VIDEO },
  { label: 'TV 3', hoop: 3, video: TEST_VIDEO },
  { label: 'TV 4', hoop: 4, video: TEST_VIDEO },
  { label: 'TV 5', hoop: 5, video: TEST_VIDEO },
];

const MainScreen: React.FC = () => {
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const { timeLeft } = useContext(TimerContext);

  useEffect(() => {
    Object.values(videoRefs.current).forEach(vid => {
      if (!vid) return;
      vid.onended = () => {
        vid.pause();
        vid.currentTime = 0;
      };
    });
  }, []);

  const resetAllVideos = () => {
    Object.values(videoRefs.current).forEach(vid => {
      if (!vid) return;
      vid.pause();
      vid.currentTime = 0;
    });
  };
  
  
  const playVideo = (hoopIndex: number) => {
    const vid = videoRefs.current[hoopIndex];
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(console.error);
  };

  return (
    <div className="grid">
      {TVs.map(({ label, hoop, video }) => (
        <div key={hoop} className="cell" title={`${label} - Hoop ${hoop}`}>
          <TimerDisplay timeLeft={timeLeft} />

          <video
            ref={el => {
              videoRefs.current[hoop] = el;
            }}
            src={video}          
            muted
            preload="auto"
            className="video-bg"
          />
        </div>
      ))}

      <div className="cell admin-cell">
        <AdminScreen onShotMade={playVideo} onResetVideos={resetAllVideos} />
      </div>
    </div>
  );
};

export default MainScreen;
