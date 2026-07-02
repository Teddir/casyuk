import { useEffect, useRef, useState } from 'react';
import mascotVideo from '../assets/mascot/0629.mp4';
import { load } from '@tauri-apps/plugin-store';
import { convertFileSrc } from '@tauri-apps/api/core';
import { AlertTriangle, BatteryWarning } from 'lucide-react';
import { getBankVideoSrc } from '../lib/videoBank';

interface AlertOverlayProps {
  percentage: number;
  isCritical: boolean;
  onDismiss: () => void;
  customVideoUrl?: string | null;
  customAudioUrl?: string | null;
  enableAudioAlert?: boolean;
  enableVideoAudio?: boolean;
}

export function AlertOverlay({ percentage, isCritical, onDismiss, customVideoUrl: _customVideoUrl, customAudioUrl: _customAudioUrl, enableAudioAlert = true, enableVideoAudio = true }: AlertOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Customization State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showGlassCard, setShowGlassCard] = useState(true);
  const [cardTitle, setCardTitle] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // Delay the appearance of the Glassmorphism card by 3 seconds
    const timer = setTimeout(() => {
      setCardVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const store = await load('settings.json');

        const savedVid = await store.get<{ value: string }>('custom_video_path');
        const savedId = await store.get<{ value: string }>('custom_video_id');
        const savedAud = await store.get<{ value: string }>('custom_audio_path');
        const savedShowCard = await store.get<{ value: boolean }>('show_glass_card');
        const savedTitle = await store.get<{ value: string }>('card_title');
        const savedMessage = await store.get<{ value: string }>('card_message');

        // Priority: 1. Custom Local File, 2. Bundled Video Bank ID, 3. Default Mascot
        if (savedVid?.value) {
          setVideoUrl(convertFileSrc(savedVid.value));
        } else if (savedId?.value) {
          const bankSrc = getBankVideoSrc(savedId.value);
          if (bankSrc) setVideoUrl(bankSrc);
        }

        if (savedAud?.value) {
          if (savedAud.value.startsWith('http')) {
            setAudioUrl(savedAud.value);
          } else {
            setAudioUrl(convertFileSrc(savedAud.value));
          }
        }
        if (savedShowCard !== null && savedShowCard !== undefined) setShowGlassCard(savedShowCard.value);
        if (savedTitle?.value) setCardTitle(savedTitle.value);
        if (savedMessage?.value) setCardMessage(savedMessage.value);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    fetchSettings();
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

  // Force video reload and play when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [videoUrl]);

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
          opacity: 0.9,
          objectFit: 'cover'
        }}
      />

      {/* Glassmorphism Card */}
      {showGlassCard && (
        <div
          className="glass-card"
          style={{
            position: 'relative',
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.7)',
            animation: 'none',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            pointerEvents: cardVisible ? 'auto' : 'none'
          }}
        >
          <h1 className="alert-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
            {cardTitle ? cardTitle : isCritical ? <><AlertTriangle size={36} /> CRITICAL BATTERY!</> : <><BatteryWarning size={36} /> Battery Low</>}
          </h1>
          <p className="alert-message" style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.95)', marginBottom: '0.5rem' }}>
            Your battery is at <strong style={{ fontSize: '1.8rem', color: isCritical ? '#ff3b30' : '#4cd964', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{percentage}%</strong>.
          </p>
          <p className="alert-submessage" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            {cardMessage || (isCritical
              ? 'Please plug in your charger immediately before your device dies!'
              : 'Consider plugging in your charger soon.')}
          </p>
          <button className="dismiss-btn glass-btn" onClick={onDismiss}>
            I understand
          </button>
        </div>
      )}
    </div>
  );
}
