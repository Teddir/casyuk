import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { blogs } from '../data/blogs';

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = blogs.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pattern-grid-faded hero-mask" style={{ padding: '160px 0 120px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        <div style={{ marginBottom: '60px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Blog & Thoughts</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Essays on engineering, design, and hardware longevity.</p>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                borderRadius: '8px',
                border: '2px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {filteredBlogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            No blogs found matching "{searchQuery}"
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {filteredBlogs.map((post, idx) => (
            <div key={idx} className="neo-box" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
                  <span style={{ color: post.color }}>{post.category}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', lineHeight: 1.2 }}>{post.title}</h3>
                <p style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '32px', flex: 1 }}>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-main)', textDecoration: 'underline' }}>
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
