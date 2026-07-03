import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


export function Blog() {
  const posts = [
    {
      title: 'Why standard battery alerts are destroying your laptop.',
      date: 'July 14, 2026',
      category: 'Deep Dive',
      color: 'var(--accent-red)',
      excerpt: 'We tend to ignore small, gray notifications in the corner of our screens. That behavioral blindspot is costing power users hundreds of dollars in battery replacements.'
    },
    {
      title: 'How we built a 4K transparent video engine in Rust.',
      date: 'June 28, 2026',
      category: 'Engineering',
      color: 'var(--accent-purple)',
      excerpt: 'A technical breakdown of using Tauri v2 and raw canvas manipulation to render chroma-keyed videos over the desktop without melting the GPU.'
    },
    {
      title: 'The Psychology of Emotion in Software.',
      date: 'May 02, 2026',
      category: 'Design',
      color: 'var(--accent-blue)',
      excerpt: 'Replacing sterile push notifications with a screaming cat fundamentally changes how quickly users react. Here is the science behind it.'
    }
  ];

  return (
    <div className="pattern-grid-faded hero-mask" style={{ padding: '160px 0 120px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Blog & Thoughts</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Essays on engineering, design, and hardware longevity.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {posts.map((post, idx) => (
            <div key={idx} className="neo-box" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
                  <span style={{ color: post.color }}>{post.category}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', lineHeight: 1.2 }}>{post.title}</h3>
                <p style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '32px', flex: 1 }}>{post.excerpt}</p>
                <Link to="/blog/why-standard-battery-alerts-are-destroying-your-laptop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-main)', textDecoration: 'underline' }}>
                  Read Article <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
