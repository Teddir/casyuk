import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogs } from '../data/blogs';

export function BlogDetail() {
  const { slug } = useParams();
  const post = blogs.find(b => b.slug === slug);

  if (!post) {
    return (
      <div className="pattern-cross-faded hero-mask" style={{ padding: '180px 0 120px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Blog Post Not Found</h1>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'underline' }}>
          <ArrowLeft size={18} /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pattern-cross-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        <div style={{ marginBottom: '40px' }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none' }}>
            <ArrowLeft size={18} /> Back to Blog
          </Link>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
            <span style={{ color: post.color }}>{post.category}</span>
            <span style={{ color: 'var(--text-muted)' }}>{post.date}</span>
          </div>

          <h1 style={{ fontSize: '4rem', marginBottom: '32px', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            {post.title}
          </h1>
        </div>

        <div className="neo-box markdown-body" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '2.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1.2 }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '2rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1.3 }} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.5rem', marginTop: '24px', marginBottom: '16px', color: 'var(--text-main)' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '20px', color: 'var(--text-main)' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '20px', paddingLeft: '24px', color: 'var(--text-main)' }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '20px', paddingLeft: '24px', color: 'var(--text-main)' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: '8px' }} {...props} />,
              a: ({ node, ...props }) => <a style={{ color: 'var(--accent-blue)', textDecoration: 'underline', fontWeight: 600 }} {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote style={{ padding: '24px', borderLeft: '4px solid var(--accent-red)', backgroundColor: 'var(--primary-color)', fontStyle: 'italic', margin: '24px 0', fontSize: '1.3rem' }} {...props} />
              ),
              code: ({ node, inline, ...props }: any) => (
                inline ?
                  <code style={{ backgroundColor: 'var(--primary-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '1rem', color: 'var(--accent-red)' }} {...props} />
                  :
                  <code style={{ display: 'block', backgroundColor: '#000', color: 'var(--accent-green)', padding: '20px', borderRadius: '8px', overflowX: 'auto', fontSize: '1rem', border: '2px solid #333', marginBottom: '24px' }} {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

      </div>
    </div>
  );
}
