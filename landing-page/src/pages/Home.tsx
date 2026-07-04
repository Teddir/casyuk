import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Download, Zap, Settings, ShieldCheck, Rocket, Activity, Star } from 'lucide-react';
import { NeoButton } from '../components/NeoButton';
import { FeatureCard } from '../components/FeatureCard';
import { StepCard } from '../components/StepCard';

export function Home() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const installVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      observer.observe(heroVideoRef.current);
    }
    if (installVideoRef.current) {
      installVideoRef.current.defaultMuted = true;
      installVideoRef.current.muted = true;
      observer.observe(installVideoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <>



      {/* Hero Section */}
      <main className="pattern-grid-faded hero-mask" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '160px 0 60px', overflow: 'hidden' }}>
        <div className="container flex-col-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="neo-box" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', fontWeight: '700', marginBottom: '24px', backgroundColor: 'var(--accent-yellow)', fontSize: '0.9rem', boxShadow: '3px 3px 0px var(--border-color)' }}>
              🚀 v0.0.14 Now Available for macOS, Windows & Linux
            </div>

            <h1 style={{ fontSize: '5rem', margin: 0, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
              Stop Ignoring Your <br />
              <span className="text-gradient">Battery.</span> Start Feeling It.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0', fontWeight: 500 }}
          >
            A next-generation emotional battery management system that uses dynamic video overlays to hijack your attention and save your hardware.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-col-mobile mobile-gap"
            style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}
          >
            <NeoButton href="#download" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <Download size={22} /> Download Free
            </NeoButton>
            <NeoButton href="#features" variant="secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <Zap size={22} /> View Features
            </NeoButton>
          </motion.div>
        </div>
      </main>

      {/* Showcase (Desktop App Preview) */}
      <section id="showcase" style={{ padding: '0 0 100px 0', marginTop: '-20px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="neo-box"
            style={{
              width: '100%',
              maxWidth: '1000px',
              aspectRatio: '16/9',
              backgroundColor: 'var(--card-bg)',
              padding: '0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Fake Mac Window Header */}
            <div style={{ padding: '12px 16px', backgroundColor: '#222', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-yellow)' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div>
              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>demo-video.mp4</span>
            </div>

            {/* Fake App Body */}
            <div style={{ flex: 1, display: 'flex', backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

              {/* Main Content (Video) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
                <video
                  ref={heroVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/demo-poster.jpg"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src="/demo-video-1080p.webm" type="video/webm" />
                  <source src="/demo-video-1080p.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: '40px 0', backgroundColor: 'var(--card-bg)', borderTop: '3px solid var(--border-color)', borderBottom: '3px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Built With Modern Tech Stack
          </p>
          <div
            data-mf-ticker="true"
            data-mf-ticker-speed="30"
            data-mf-ticker-direction="left"
            style={{ display: 'flex', gap: '48px', opacity: 0.7, overflow: 'hidden' }}
          >
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>🦀 RUST</h2>
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>⚛️ REACT 19</h2>
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>⚡ TAURI v2</h2>
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>🎨 NEO-BRUTALISM</h2>
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>🚀 VITE</h2>
            <h2 style={{ padding: '0 48px', margin: 0, fontSize: '2.5rem', whiteSpace: 'nowrap' }}>🌊 MOTIONFLOW</h2>
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Box) */}
      <section id="features" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-0.03em' }}>The <span style={{ backgroundColor: 'var(--accent-green)', padding: '0 8px' }}>"Wow"</span> Factor</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>CasYuk isn't just another battery monitor. It's a behavioral tool designed for power users.</p>
          </div>

          <motion.div
            className="bento-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              hidden: { opacity: 0 }
            }}
          >

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-span-2" style={{ height: '100%' }}>
              <FeatureCard
                title="Chroma-Key Engine"
                description="Replaces boring push notifications with transparent, high-fidelity green-screen video overlays that demand immediate action."
                icon={<Zap size={40} />}
                bgClass="var(--accent-purple)"
                className="bento-span-2 pattern-dots"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-span-1" style={{ height: '100%' }}>
              <FeatureCard
                title="Smart Charge Limiter"
                description="Automatically stops your battery charging at exactly 80% to preserve lithium-ion cell chemistry."
                icon={<ShieldCheck size={40} />}
                bgClass="var(--accent-orange)"
                className="pattern-cross"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-span-1" style={{ height: '100%' }}>
              <FeatureCard
                title="Granular Customization"
                description="Full control over your alert experience with independent toggles for system notifications, video audio, and custom sound alerts."
                icon={<Settings size={40} />}
                bgClass="var(--accent-blue)"
                className="pattern-diagonal"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-span-2" style={{ height: '100%' }}>
              <FeatureCard
                title="Insanely Fast"
                description="Powered by Tauri v2 and Rust with aggressive canvas downscaling and frame-throttling to minimize CPU/RAM overhead."
                icon={<Rocket size={40} />}
                bgClass="var(--accent-red)"
                className="bento-span-2 pattern-dots"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} style={{ gridColumn: '1 / -1', height: '100%' }}>
              <FeatureCard
                title="True Cross-Platform Telemetry"
                description="Native battery hardware access via macOS (IOKit), Windows (WMI), and Linux (UPower/Sysfs). No electron bloat, just pure native performance."
                icon={<Activity size={40} />}
                bgClass="var(--accent-yellow)"
                className="bento-span-2 pattern-diagonal"
              />
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-0.03em' }}>Capabilities</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>Deep native integrations across all operating systems. CasYuk speaks directly to your hardware.</p>
          </div>

          <motion.div
            className="bento-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              hidden: { opacity: 0 }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bento-span-2">
              <div className="neo-box pattern-dots" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', backgroundColor: 'var(--card-bg)', display: 'inline-block', padding: '4px 12px', border: '2px solid var(--border-color)', borderRadius: '4px' }}>macOS SMC Access</h3>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', backgroundColor: 'var(--card-bg)', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '4px' }}>Directly talks to the System Management Controller using `bclm` bindings to write 80% charge limits directly to NVRAM.</p>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bento-span-1">
              <div className="neo-box pattern-diagonal" style={{ padding: '32px', height: '100%', backgroundColor: 'var(--accent-blue)' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#000' }}>Windows WMI</h3>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#000' }}>Zero-overhead background polling using native WMI `CREATE_NO_WINDOW` execution. No flashing terminal popups.</p>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bento-span-1">
              <div className="neo-box pattern-cross" style={{ padding: '32px', height: '100%', backgroundColor: 'var(--accent-orange)' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#000' }}>Linux Sysfs</h3>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#000' }}>Reads raw values from `/sys/class/power_supply` safely without requiring excessive root permissions for standard monitoring.</p>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bento-span-2">
              <div className="neo-box" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--card-bg)' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Zero-Dependency Media</h3>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-muted)' }}>No VLC or external players required. Ships with a self-healing native webview capable of rendering 4K chroma-key transparency.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section id="workflow" style={{ padding: '100px 0', backgroundColor: 'var(--card-bg)', borderTop: '3px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-0.03em' }}>How it Works</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Three steps to perfect battery health.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <StepCard
              number="1"
              title="Set Your Thresholds"
              description="Define when you want to be warned (e.g. at 20% to plug in, or 80% to unplug)."
            />
            <StepCard
              number="2"
              title="Choose Your Emotion"
              description="Upload a green-screen video (like a screaming cat or a panic siren) that effectively grabs your attention."
            />
            <StepCard
              number="3"
              title="Get Interrupted Beautifully"
              description="CasYuk stays hidden in the tray, consuming almost zero RAM, until it's time to trigger the floating video overlay."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="neo-box" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: 'var(--accent-green)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={32} fill="#000" />)}
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontStyle: 'italic', lineHeight: 1.3 }}>
              "I used to constantly let my MacBook die during meetings. Now, a screaming cat tells me to plug it in. It works perfectly."
            </h2>
            <p style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase' }}>— Satisfied Power User</p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" style={{ padding: '100px 0', backgroundColor: '#000', color: '#fff', borderTop: '3px solid var(--border-color)' }}>
        <div className="container">
          <div className="flex-col-mobile" style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>

            {/* Left: Commands */}
            <div style={{ flex: 1, width: '100%' }}>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '24px', color: 'var(--accent-green)', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
                Ready to save your battery?
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '40px' }}>
                Install CasYuk in seconds. No dependencies required.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="neo-box" style={{ backgroundColor: '#111', borderColor: 'var(--accent-green)', color: '#fff', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>macOS / Ubuntu</h3>
                  <code style={{ display: 'block', backgroundColor: '#000', padding: '16px', borderRadius: '8px', color: 'var(--accent-green)', border: '2px solid #333', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                    curl -fsSL casyuk.com/install.sh | bash
                  </code>
                </div>

                <div className="neo-box" style={{ backgroundColor: '#111', borderColor: 'var(--accent-blue)', color: '#fff', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Windows</h3>
                  <code style={{ display: 'block', backgroundColor: '#000', padding: '16px', borderRadius: '8px', color: 'var(--accent-blue)', border: '2px solid #333', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                    iwr -useb casyuk.com/install.ps1 | iex
                  </code>
                </div>
              </div>
            </div>

            {/* Right: Video Installation Demo */}
            <div style={{ flex: 1, width: '100%' }}>
              <div className="neo-box" style={{ backgroundColor: '#111', borderColor: 'var(--border-color)', padding: 0, overflow: 'hidden', position: 'relative', aspectRatio: '16/10', display: 'flex', flexDirection: 'column' }}>
                {/* Fake Terminal Header */}
                <div style={{ padding: '12px 16px', backgroundColor: '#222', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-yellow)' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div>
                  <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>install-demo.mp4</span>
                </div>
                {/* Video Placeholder */}
                <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  <video
                    ref={installVideoRef}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/install-poster.jpg"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }}
                  >
                    <source src="/install-demo-1080p.webm" type="video/webm" />
                    <source src="/install-demo-1080p.mp4" type="video/mp4" />
                  </video>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
