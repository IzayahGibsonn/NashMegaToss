import React, { useRef, useEffect, useContext, useState } from 'react';
import AdminScreen from './components/AdminScreen';
import TimerDisplay from './components/Timer';
import CountdownOverlay from './components/CounterOverlay';
import { TimerContext } from './context/TimerContext';
import './App.css';

const HOOP_VIDEO = '/assets/videos/ritz_2500.mp4';
const SCORE_VIDEO = '/assets/videos/score_video.mp4';

const TVs = [
  { label: 'TV 1', hoop: 1, video: HOOP_VIDEO },
  { label: 'TV 2', hoop: 2, video: HOOP_VIDEO },
  { label: 'TV 3', hoop: 3, video: HOOP_VIDEO },
  { label: 'TV 4', hoop: 4, video: HOOP_VIDEO },
  { label: 'TV 5', hoop: 5, video: HOOP_VIDEO },
];

const MainScreen: React.FC = () => {
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const { timeLeft, start } = useContext(TimerContext);
  const [showCountdown, setShowCountdown] = useState(false);

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

  const handleStart = () => setShowCountdown(true);

  const onCountdownComplete = () => {
    setShowCountdown(false);
    start();
  };

  return (
    <div className="grid">
      {TVs.map(({ label, hoop, video }) => (
        <div key={hoop} className="cell" title={`${label} - Hoop ${hoop}`}>
          {/* per-cell countdown */}
          <CountdownOverlay
            visible={showCountdown}
            startSoundSrc="/assets/sounds/start_clock.mp3"
            onComplete={onCountdownComplete}
          />

          <TimerDisplay timeLeft={timeLeft} />

          <video
            ref={el => { videoRefs.current[hoop] = el; }}
            src={video}
            muted
            preload="auto"
            className="video-bg"
          />
        </div>
      ))}

      <div className="cell admin-cell">
        {/* admin cell also gets its own countdown */}
        <CountdownOverlay
          visible={showCountdown}
          startSoundSrc="/assets/sounds/start_clock.mp3"
          onComplete={onCountdownComplete}
        />

        <video
          src={SCORE_VIDEO}
          muted
          loop
          autoPlay
          className="video-bg"
        />
        <div className="cell-overlay">
          <AdminScreen
            onShotMade={playVideo}
            onResetVideos={resetAllVideos}
            onStart={handleStart}
          />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
