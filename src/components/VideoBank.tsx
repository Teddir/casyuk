import { useState, useEffect, useRef } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { Play, Pause } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { VIDEO_PACKS } from '../lib/videoBank';
import { ProGateOverlay } from './ProGateOverlay';

const trackEvent = async (name: string, props?: Record<string, string | number | boolean>) => {
  try {
    await invoke('plugin:aptabase|track_event', { name, props });
  } catch (err) {
    console.error('Aptabase error:', err);
  }
};

// Helper component to process greenscreen for preview
function ChromaKeyVideo({ src, isSelected }: { src: string, isSelected: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;

    const processFrame = () => {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const length = frame.data.length;

        for (let i = 0; i < length; i += 4) {
          const r = frame.data[i + 0];
          const g = frame.data[i + 1];
          const b = frame.data[i + 2];
          if (g > 100 && r < g * 0.8 && b < g * 0.8) {
            frame.data[i + 3] = 0;
          }
        }
        ctx.putImageData(frame, 0, 0);
      } catch (err) {
        console.error(err);
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 140;
      processFrame();
    };
    
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 140;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < frame.data.length; i += 4) {
          const g = frame.data[i + 1], r = frame.data[i + 0], b = frame.data[i + 2];
          if (g > 100 && r < g * 0.8 && b < g * 0.8) frame.data[i + 3] = 0;
        }
        ctx.putImageData(frame, 0, 0);
      } catch (e) {}
    });

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '140px', background: 'var(--bg-card)', overflow: 'hidden' }}>
      <video ref={videoRef} src={src} loop muted playsInline style={{ display: 'none' }} />
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: 'block',
          opacity: isSelected ? 1 : 0.7 
        }} 
      />
      <button 
        onClick={togglePlay}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
          width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',
          color: 'white', cursor: 'pointer', opacity: isPlaying ? 0 : 1, transition: 'opacity 0.2s'
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
}

interface VideoBankProps {
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

export function VideoBank({ isPro = false, onUpgradeClick }: VideoBankProps) {
  const [store, setStore] = useState<any>(null);
  const [activeVideoId, setActiveVideoId] = useState('default');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function initStore() {
      const s = await load('settings.json');
      setStore(s);
      
      const savedId = await s.get<{ value: string }>('custom_video_id');
      const savedPath = await s.get<{ value: string }>('custom_video_path');
      
      if (savedPath && savedPath.value) {
        setActiveVideoId('custom_local_file');
      } else if (savedId && savedId.value) {
        setActiveVideoId(savedId.value);
      }
    }
    initStore();
    trackEvent('screen_view', { name: 'VideoBank' });
  }, []);

  const handleSaveSelection = async (vidId: string) => {
    setActiveVideoId(vidId);
    if (store) {
      // Clear any custom file path because we are using a Bank Video
      await store.delete('custom_video_path');
      await store.set('custom_video_id', { value: vidId });
      await store.save();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      
      trackEvent('video_selected', { video_id: vidId, pack: 'pro_bundled' });
    }
  };

  return (
    <div className="settings-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎬 Video Bank
            {!isPro && <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>LOCKED</span>}
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Choose an emotional response for your battery alerts.</p>
        </div>
        <div>
          {isSaved && <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>✓ Saved!</span>}
        </div>
      </div>

      <div style={{ position: 'relative', overflow: isPro ? 'auto' : 'hidden' }}>
        {!isPro && <ProGateOverlay onUpgradeClick={onUpgradeClick!} featureName="Full Video Bank" variant="card" showContestBanner={true} />}
        <div style={{ opacity: isPro ? 1 : 0.4, pointerEvents: isPro ? 'auto' : 'none' }}>
          {VIDEO_PACKS.map((pack) => (
            <div key={pack.packName} className="widget-card" style={{ marginBottom: '2rem' }}>
              <div className="widget-header">
                <h3>{pack.packName}</h3>
              </div>
              <div className="widget-content">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                  gap: '1.5rem',
                }}>
                  {pack.videos.map(vid => {
                    const isSelected = activeVideoId === vid.id;
                    return (
                      <div 
                        key={vid.id}
                        onClick={() => isPro && handleSaveSelection(vid.id)}
                        style={{ 
                          cursor: isPro ? 'pointer' : 'default',
                          borderRadius: '12px', 
                          border: isSelected ? '4px solid var(--accent-green)' : '4px solid transparent',
                          overflow: 'hidden',
                          background: '#000',
                          position: 'relative',
                          boxShadow: isSelected ? '0 0 15px rgba(52, 211, 153, 0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ChromaKeyVideo src={vid.src} isSelected={isSelected} />
                        <div style={{ padding: '0.8rem', background: isSelected ? 'var(--accent-green)' : 'var(--primary-color)', color: isSelected ? '#000' : 'var(--text-main)', textAlign: 'center', fontWeight: 'bold' }}>
                          {vid.name}
                        </div>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-green)', color: '#000', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            Active
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
