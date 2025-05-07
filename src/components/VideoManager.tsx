import React, { useEffect, useRef } from 'react';

interface VideoManagerProps {
  /** 1 through 5 for each hoop, or null when nothing just happened */
  shotMade: number | null;
}

const VIDEO_SOURCES: Record<number, string> = {
  1: '/videos/hoop1.mp4',
  2: '/videos/hoop2.mp4',
  3: '/videos/hoop3.mp4',
  4: '/videos/hoop4.mp4',
  5: '/videos/hoop5.mp4',
};

const VideoManager: React.FC<VideoManagerProps> = ({ shotMade }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shotMade && videoRef.current) {
      // load and play the correct clip
      videoRef.current.src = VIDEO_SOURCES[shotMade];
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [shotMade]);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="background-video"
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* later you can overlay explosion or other effects here */}
    </div>
  );
};

export default VideoManager;
