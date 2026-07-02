import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { emit } from '@tauri-apps/api/event';
import { Palette, RotateCcw, Save, Music } from 'lucide-react';
import { ProGateOverlay } from './ProGateOverlay';

interface CustomizationPanelProps {
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

export function CustomizationPanel({ isPro = false, onUpgradeClick }: CustomizationPanelProps) {
  const [store, setStore] = useState<any>(null);

  // Media State
  const [customVideoPath, setCustomVideoPath] = useState('');
  const [customAudioPath, setCustomAudioPath] = useState('');

  // Card State
  const [showGlassCard, setShowGlassCard] = useState(true);
  const [cardTitle, setCardTitle] = useState('WARNING!');
  const [cardMessage, setCardMessage] = useState('Battery level is critically low. Please plug in your charger immediately to prevent data loss.');

  // File Validation State
  const [videoFileError, setVideoFileError] = useState(false);
  const [audioFileError, setAudioFileError] = useState(false);

  useEffect(() => {
    async function initStore() {
      const s = await load('settings.json');
      setStore(s);

      const savedVid = await s.get<{ value: string }>('custom_video_path');
      const savedAud = await s.get<{ value: string }>('custom_audio_path');
      const savedShowCard = await s.get<{ value: boolean }>('show_glass_card');
      const savedTitle = await s.get<{ value: string }>('card_title');
      const savedMessage = await s.get<{ value: string }>('card_message');

      if (savedVid) setCustomVideoPath(savedVid.value);
      if (savedAud) setCustomAudioPath(savedAud.value);
      if (savedShowCard !== null && savedShowCard !== undefined) setShowGlassCard(savedShowCard.value);
      if (savedTitle) setCardTitle(savedTitle.value);
      if (savedMessage) setCardMessage(savedMessage.value);
    }
    initStore();
  }, []);

  // Validate Local Video File
  useEffect(() => {
    if (customVideoPath && !customVideoPath.startsWith('http')) {
      setVideoFileError(false);
      const video = document.createElement('video');
      video.src = convertFileSrc(customVideoPath);
      video.onerror = () => setVideoFileError(true);
    } else {
      setVideoFileError(false);
    }
  }, [customVideoPath]);

  // Validate Local Audio File
  useEffect(() => {
    if (customAudioPath && !customAudioPath.startsWith('http')) {
      setAudioFileError(false);
      const audio = document.createElement('audio');
      audio.src = convertFileSrc(customAudioPath);
      audio.onerror = () => setAudioFileError(true);
    } else {
      setAudioFileError(false);
    }
  }, [customAudioPath]);

  const handlePickVideo = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Video', extensions: ['mp4', 'mov', 'webm'] }]
    });
    if (selected && typeof selected === 'string') {
      setCustomVideoPath(selected);
    }
  };

  const handlePickAudio = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }]
    });
    if (selected && typeof selected === 'string') {
      setCustomAudioPath(selected);
    }
  };

  const handleSaveVideo = async () => {
    if (store) {
      if (customVideoPath) {
        await store.set('custom_video_path', { value: customVideoPath });
        // Sinkronisasi: hapus ID Video Bank agar tidak tumpang tindih
        await store.delete('custom_video_id');
      } else {
        await store.delete('custom_video_path');
      }
      await store.save();
      alert('Video customization saved!');
    }
  };

  const handleResetVideo = async () => {
    setCustomVideoPath('');
    if (store) {
      await store.delete('custom_video_path');
      await store.save();
    }
  };

  const handleSaveAudio = async () => {
    if (store) {
      if (customAudioPath) await store.set('custom_audio_path', { value: customAudioPath });
      else await store.delete('custom_audio_path');
      await store.save();
      alert('Audio customization saved!');
    }
  };

  const handleResetAudio = async () => {
    setCustomAudioPath('');
    if (store) {
      await store.delete('custom_audio_path');
      await store.save();
    }
  };

  const handleSaveCard = async () => {
    if (store) {
      await store.set('card_title', { value: cardTitle });
      await store.set('card_message', { value: cardMessage });
      await store.save();
      alert('Card customization saved!');
    }
  };

  const handleResetCard = async () => {
    setCardTitle('WARNING!');
    setCardMessage('Battery level is critically low. Please plug in your charger immediately to prevent data loss.');
    if (store) {
      await store.delete('card_title');
      await store.delete('card_message');
      await store.save();
    }
  };

  return (
    <div className="settings-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={28} /> Customization</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Personalize your emotional battery companion.</p>
        </div>
      </div>

      <div className="widgets-row">
        <div className="widget-card" style={{ gridColumn: '1 / -1' }}>
          <div className="widget-header">
            <h3>🎬 Custom Green-Screen Upload {!isPro && <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '8px' }}>LOCKED</span>}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleResetVideo} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-red)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={handleSaveVideo} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-green)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000' }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
          <div className="widget-content" style={{ position: 'relative', overflow: isPro ? 'auto' : 'hidden' }}>
            {!isPro && <ProGateOverlay onUpgradeClick={onUpgradeClick!} featureName="Custom Uploads" variant="badge" />}

            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Upload your own custom green-screen video to use as an alert. <br /> <strong style={{ color: 'var(--text-main)' }}>Note: Saving a custom video here will automatically override your active Video Bank selection.</strong></p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: isPro ? 1 : 0.4 }}>
              <input
                type="text"
                readOnly
                value={customVideoPath && !customVideoPath.startsWith('http') ? customVideoPath.split('/').pop() : 'No custom file selected'}
                style={{ flex: 1, padding: '0.8rem', fontWeight: 600, boxSizing: 'border-box', border: videoFileError ? '2px solid var(--accent-red)' : 'none', color: videoFileError ? 'var(--accent-red)' : 'inherit' }}
                title={customVideoPath || 'Custom Video'}
              />
              <button onClick={handlePickVideo} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-blue)', flexShrink: 0 }}>
                Browse Local File...
              </button>
            </div>
            {videoFileError && (
              <p style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⚠️ The selected file was moved or deleted! Please re-upload to fix this alert.
              </p>
            )}
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Audio Alert {!isPro && <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '8px' }}>LOCKED</span>}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleResetAudio} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-red)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={handleSaveAudio} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-green)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000' }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
          <div className="widget-content" style={{ position: 'relative', overflow: isPro ? 'auto' : 'hidden' }}>
            {!isPro && <ProGateOverlay onUpgradeClick={onUpgradeClick!} featureName="Custom Audio" variant="badge" />}

            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', opacity: isPro ? 1 : 0.4 }}>Select Custom Audio</label>
            <div className="neo-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem', background: 'var(--primary-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={48} color="var(--text-main)" />
              </div>
              {customAudioPath ? (
                <audio key={customAudioPath} controls src={convertFileSrc(customAudioPath)} style={{ width: '100%' }} />
              ) : (
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No custom audio selected</div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: isPro ? 1 : 0.4 }}>
              <input
                type="text"
                readOnly
                value={customAudioPath ? customAudioPath.split('/').pop() : 'None (Silent)'}
                style={{ flex: 1, padding: '0.8rem', fontWeight: 600, boxSizing: 'border-box', border: audioFileError ? '2px solid var(--accent-red)' : 'none', color: audioFileError ? 'var(--accent-red)' : 'inherit' }}
                title={customAudioPath || 'Silent'}
              />
              <button onClick={handlePickAudio} disabled={!isPro} className="text-btn" style={{ background: 'var(--accent-green)', flexShrink: 0 }}>
                Browse...
              </button>
            </div>
            {audioFileError && (
              <p style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⚠️ The selected audio file was moved or deleted! Please select a valid file.
              </p>
            )}
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Glassmorphism Card Content</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleResetCard} className="text-btn" style={{ background: 'var(--accent-red)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={handleSaveCard} className="text-btn" style={{ background: 'var(--accent-green)', padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000' }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
          <div className="widget-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Show Alert Card</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display text over the video</span>
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showGlassCard}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    setShowGlassCard(checked);
                    if (store) {
                      await store.set('show_glass_card', { value: checked });
                      await store.save();
                    }
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            <div style={{ opacity: showGlassCard ? 1 : 0.5, pointerEvents: showGlassCard ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Alert Title</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Alert Message</label>
                <textarea
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '0.8rem', fontWeight: 600, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div className="neo-card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                <h1 style={{ margin: '0 0 1rem 0', color: 'var(--accent-red)', fontSize: '2rem' }}>{cardTitle || 'Preview Title'}</h1>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
                  {cardMessage || 'Preview message...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="widgets-row" style={{ marginTop: '2.5rem' }}>
        <div className="widget-card" style={{ gridColumn: '1 / -1' }}>
          <div className="widget-header">
            <h3>Testing</h3>
          </div>
          <div className="widget-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Use these tools to manually trigger the pop-ups and test your chroma-key video settings.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => emit('test-alert-event', { percentage: 20, is_critical: false, is_test: true })}
                className="text-btn" style={{ background: 'var(--accent-orange)' }}>
                Test Low Battery Popup
              </button>

              <button onClick={() => emit('test-alert-event', { percentage: 5, is_critical: true, is_test: true })}
                className="text-btn" style={{ background: 'var(--accent-red)' }}>
                Test Critical Battery Popup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
