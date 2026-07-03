import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass?: string;
  className?: string;
}

export function FeatureCard({ title, description, icon, bgClass, className = '' }: FeatureCardProps) {
  return (
    <div 
      className={`neo-box flex-col-mobile ${className}`} 
      style={{ 
        height: '100%',
        padding: '32px', 
        backgroundColor: bgClass || 'var(--card-bg)',
        display: 'flex',
        flexDirection: className.includes('span-2') ? 'row' : 'column',
        gap: className.includes('span-2') ? '32px' : '0',
        alignItems: className.includes('span-2') ? 'center' : 'stretch',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ marginBottom: className.includes('span-2') ? '0' : '20px' }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: '250px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{title}</h3>
        <p style={{ fontWeight: 500, fontSize: className.includes('span-2') ? '1.1rem' : '1rem' }}>{description}</p>
      </div>
    </div>
  );
}
