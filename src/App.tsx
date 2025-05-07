import React, { useRef, useEffect } from 'react';
import AdminScreen from './components/AdminScreen';
import './App.css';

const TVs = [
  { label: 'TV 1', hoop: 1 },
  { label: 'TV 2', hoop: 2 },
  { label: 'TV 3', hoop: 3 },
  { label: 'TV 4', hoop: 4 },
  { label: 'TV 5', hoop: 5 },
];

const TEST_VIDEO = '/assets/test.mp4';

const MainScreen: React.FC = () => {
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const playVideo = (hoopIndex: number) => {
    const vid = videoRefs.current[hoopIndex];
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(console.error);
  };

  useEffect(() => {
    Object.values(videoRefs.current).forEach(vid => {
      if (!vid) return;
      vid.onended = () => {
        vid.pause();
        vid.currentTime = 0;
      };
    });
  }, []);

  return (
    <div className="grid">
      {TVs.map(({ label, hoop }) => (
        <div key={hoop} className="cell" title={`${label} - Hoop ${hoop}`}>
          <video
            ref={el => { videoRefs.current[hoop] = el }}
            src={TEST_VIDEO}
            muted
            preload="auto"
            className="video-bg"
          />
        </div>
      ))}

      <div className="cell admin-cell">
        <AdminScreen onShotMade={playVideo} />
      </div>
    </div>
  );
};

export default MainScreen;
