import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { emit } from '@tauri-apps/api/event';
import { Palette, RotateCcw, Save, Music } from 'lucide-react';
import mascotVideo from '../assets/mascot/0629.mp4';

export function CustomizationPanel() {
  const [store, setStore] = useState<any>(null);
  
  // Media State
  const [customVideoPath, setCustomVideoPath] = useState('');
  const [customAudioPath, setCustomAudioPath] = useState('');
  
  // Card State
  const [showGlassCard, setShowGlassCard] = useState(true);
  const [cardTitle, setCardTitle] = useState('WARNING!');
  const [cardMessage, setCardMessage] = useState('Battery level is critically low. Please plug in your charger immediately to prevent data loss.');

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

  const handleSaveCustomization = async () => {
    if (store) {
      if (customVideoPath) await store.set('custom_video_path', { value: customVideoPath });
      else await store.delete('custom_video_path');
      
      if (customAudioPath) await store.set('custom_audio_path', { value: customAudioPath });
      else await store.delete('custom_audio_path');
      
      await store.set('show_glass_card', { value: showGlassCard });
      await store.set('card_title', { value: cardTitle });
      await store.set('card_message', { value: cardMessage });
      
      await store.save();
      alert('Customizations saved successfully!');
    }
  };

  const handleResetMedia = async () => {
    setCustomVideoPath('');
    setCustomAudioPath('');
    setShowGlassCard(true);
    setCardTitle('WARNING!');
    setCardMessage('Battery level is critically low. Please plug in your charger immediately to prevent data loss.');
    if (store) {
      await store.delete('custom_video_path');
      await store.delete('custom_audio_path');
      await store.delete('show_glass_card');
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleResetMedia} className="text-btn" style={{ background: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleSaveCustomization} className="text-btn" style={{ background: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Customization
          </button>
        </div>
      </div>
      
      <div className="widgets-row">
        <div className="widget-card">
          <div className="widget-header">
            <h3>Video Background</h3>
          </div>
          <div className="widget-content">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Default or Custom Video</label>
            <div className="neo-card" style={{ padding: '0.5rem', marginBottom: '1.5rem', background: '#000', display: 'flex', justifyContent: 'center', borderRadius: '12px' }}>
              <video 
                key={customVideoPath || 'default-vid'}
                src={customVideoPath ? convertFileSrc(customVideoPath) : mascotVideo} 
                autoPlay loop muted 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="text" 
                readOnly 
                value={customVideoPath ? customVideoPath.split('/').pop() : 'Default (0629.mp4)'} 
                style={{ flex: 1, padding: '0.8rem', fontWeight: 600, boxSizing: 'border-box' }} 
                title={customVideoPath || 'Default Video'}
              />
              <button onClick={handlePickVideo} className="text-btn" style={{ background: 'var(--accent-blue)', flexShrink: 0 }}>
                Browse...
              </button>
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Audio Alert</h3>
          </div>
          <div className="widget-content">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Custom Audio</label>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="text" 
                readOnly 
                value={customAudioPath ? customAudioPath.split('/').pop() : 'None (Silent)'} 
                style={{ flex: 1, padding: '0.8rem', fontWeight: 600, boxSizing: 'border-box' }} 
                title={customAudioPath || 'Silent'}
              />
              <button onClick={handlePickAudio} className="text-btn" style={{ background: 'var(--accent-green)', flexShrink: 0 }}>
                Browse...
              </button>
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Glassmorphism Card Content</h3>
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
                  onChange={(e) => setShowGlassCard(e.target.checked)} 
                  style={{ width: '24px', height: '24px', accentColor: 'var(--text-main)' }} 
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
            <h3>Developer / Debugging</h3>
          </div>
          <div className="widget-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Use these tools to manually trigger the pop-ups and test your chroma-key video settings.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => emit('test-alert-event', { percentage: 20, is_critical: false })} 
                className="text-btn" style={{ background: 'var(--accent-orange)' }}>
                Test Low Battery Popup
              </button>
              
              <button onClick={() => emit('test-alert-event', { percentage: 5, is_critical: true })} 
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
