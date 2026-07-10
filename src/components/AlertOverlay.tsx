import { useEffect, useRef, useState } from 'react';
import mascotVideo from '../assets/mascot/0629.mp4';
import { AlertTriangle, BatteryWarning } from 'lucide-react';

interface AlertOverlayProps {
  percentage: number;
  isCritical: boolean;
  onDismiss: () => void;
  customVideoUrl?: string | null;
  customAudioUrl?: string | null;
  enableAudioAlert?: boolean;
  enableVideoAudio?: boolean;
  showGlassCard?: boolean;
}

export function AlertOverlay({ percentage, isCritical, onDismiss, customVideoUrl: _customVideoUrl, customAudioUrl: _customAudioUrl, enableAudioAlert = true, enableVideoAudio = true, showGlassCard = true }: AlertOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // We rely entirely on the props passed from AlertWindow to prevent stuttering/double fetching.
  const [videoUrl, setVideoUrl] = useState<string | null>(_customVideoUrl || null);
  const [audioUrl, setAudioUrl] = useState<string | null>(_customAudioUrl || null);
  const cardTitle = '';
  const cardMessage = '';
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // Delay the appearance of the Alert card by 5 seconds
    const timer = setTimeout(() => {
      setCardVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    const FPS = 24; // Cinematic 24fps cap cuts CPU load by 60% compared to 60fps
    const fpsInterval = 1000 / FPS;

    const processFrame = (time: number) => {
      // Always request next frame
      animationFrameId = requestAnimationFrame(processFrame);

      if (video.paused || video.ended) return;

      // Throttle frame rate
      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      // Downscale by 2x (processes 4x fewer pixels) for extreme performance gain
      const targetWidth = Math.floor(video.videoWidth / 2);
      const targetHeight = Math.floor(video.videoHeight / 2);

      if (video.videoWidth > 0 && canvas.width !== targetWidth) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      if (canvas.width === 0) return;

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        const length = data.length;

        // Chroma Key logic (Green Screen Removal)
        for (let i = 0; i < length; i += 4) {
          const r = data[i + 0];
          const g = data[i + 1];
          const b = data[i + 2];

          // If pixel is green-dominant, make it transparent
          if (g > 100 && r < g * 0.8 && b < g * 0.8) {
            data[i + 3] = 0; // Alpha channel = 0 (Transparent)
          }
        }
        ctx.putImageData(frame, 0, 0);
      } catch (err: any) {
        console.error(`Canvas Error: ${err.message}`);
        cancelAnimationFrame(animationFrameId);
        return;
      }
    };

    const handlePlay = () => {
      cancelAnimationFrame(animationFrameId);
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', handlePlay);

    // If it's already playing
    if (!video.paused) {
      handlePlay();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('play', handlePlay);
    };
  }, []);

  // Auto-play is handled by the video tag attribute.
  // We removed video.load() because it aborts the initial buffering and causes a stutter/lag on start.
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(e => console.error("Auto-play prevented", e));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoUrl, onDismiss]);

  return (
    <div 
      className={`alert-overlay`} 
      onClick={() => {
        if (!showGlassCard) onDismiss();
      }}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        cursor: !showGlassCard ? 'pointer' : 'default'
      }}
    >
      {/* Hidden Original Video */}
      <video
        ref={videoRef}
        src={videoUrl || mascotVideo}
        autoPlay
        loop
        muted={!enableVideoAudio}
        playsInline
        style={{ display: 'none' }}
        onError={() => {
          if (videoUrl && videoUrl !== mascotVideo) {
            console.error("Failed to load custom video, falling back to default mascot");
            setVideoUrl(null); // Will fallback to mascotVideo via the src prop
          }
        }}
      />

      {/* Background Audio */}
      {enableAudioAlert && audioUrl && (
        <audio
          src={audioUrl}
          autoPlay
          loop
          style={{ display: 'none' }}
          onError={() => {
            console.error("Failed to load custom audio, falling back to silent");
            setAudioUrl(null);
          }}
        />
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
          objectFit: 'cover'
        }}
      />

      {/* Neo-Brutalist Card */}
      {showGlassCard && (
        <div
          className="neo-card"
          style={{
            position: 'relative',
            zIndex: 100,
            backgroundColor: isCritical ? 'var(--accent-red)' : 'var(--accent-yellow)',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '450px',
            width: '90%',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            pointerEvents: cardVisible ? 'auto' : 'none',
            border: '4px solid var(--border-color)',
            boxShadow: '8px 8px 0px var(--border-color)',
            borderRadius: '16px'
          }}
        >
          <h1 className="alert-title" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
            {cardTitle ? cardTitle : isCritical ? <><AlertTriangle size={36} strokeWidth={3} /> CRITICAL!</> : <><BatteryWarning size={36} strokeWidth={3} /> LOW BATTERY</>}
          </h1>
          <p className="alert-message" style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '1rem' }}>
            Capacity is at <strong style={{ fontSize: '1.8rem', backgroundColor: 'var(--text-main)', color: isCritical ? 'var(--accent-red)' : 'var(--accent-yellow)', padding: '2px 12px', borderRadius: '4px', border: '2px solid var(--border-color)' }}>{percentage}%</strong>
          </p>
          <p className="alert-submessage" style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            {cardMessage || (isCritical
              ? 'Plug in your charger immediately before your device dies!'
              : 'Consider plugging in your charger soon.')}
          </p>
          <button
            className="text-btn"
            style={{
              fontSize: '1.1rem',
              padding: '0.8rem 2.5rem',
              backgroundColor: 'var(--text-main)',
              color: 'var(--card-bg)',
              border: '2px solid var(--border-color)',
              boxShadow: '4px 4px 0px var(--border-color)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onClick={onDismiss}
          >
            I UNDERSTAND
          </button>
        </div>
      )}
    </div>
  );
}
