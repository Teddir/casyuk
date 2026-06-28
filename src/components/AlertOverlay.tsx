import { useEffect, useRef } from 'react';
import mascotVideo from '../assets/mascot/0629.mp4';

interface AlertOverlayProps {
  percentage: number;
  isCritical: boolean;
  onDismiss: () => void;
  customVideoUrl?: string | null;
  customAudioUrl?: string | null;
}

export function AlertOverlay({ percentage, isCritical, onDismiss, customVideoUrl, customAudioUrl }: AlertOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas size to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const processFrame = () => {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const length = frame.data.length;

      // Chroma Key logic (Green Screen Removal)
      for (let i = 0; i < length; i += 4) {
        const r = frame.data[i + 0];
        const g = frame.data[i + 1];
        const b = frame.data[i + 2];

        // If pixel is green-dominant, make it transparent
        if (g > 100 && r < g * 0.8 && b < g * 0.8) {
          frame.data[i + 3] = 0; // Alpha channel = 0 (Transparent)
        }
      }
      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', handlePlay);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    // If it's already playing
    if (!video.paused) {
      handlePlay();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('play', handlePlay);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Force video reload and play when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [customVideoUrl]);

  return (
    <div className={`alert-overlay`} style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'transparent',
      overflow: 'hidden'
    }}>
      {/* Hidden Original Video */}
      <video
        ref={videoRef}
        src={customVideoUrl || mascotVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />

      {/* Background Audio */}
      {customAudioUrl && (
        <audio src={customAudioUrl} autoPlay loop style={{ display: 'none' }} />
      )}

      {/* Processed Chroma Key Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.9
        }}
      />

      {/* Glassmorphism Card */}
      <div className="glass-card" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="alert-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          {isCritical ? '⚠️ CRITICAL BATTERY!' : '🔋 Battery Low'}
        </h1>
        <p className="alert-message" style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.95)', marginBottom: '0.5rem' }}>
          Your battery is at <strong style={{ fontSize: '1.8rem', color: isCritical ? '#ff3b30' : '#4cd964', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{percentage}%</strong>.
        </p>
        <p className="alert-submessage" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          {isCritical
            ? 'Please plug in your charger immediately before your device dies!'
            : 'Consider plugging in your charger soon.'}
        </p>
        <button className="dismiss-btn glass-btn" onClick={onDismiss}>
          I understand
        </button>
      </div>
    </div>
  );
}
