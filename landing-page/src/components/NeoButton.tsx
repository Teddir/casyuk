import React from 'react';

interface NeoButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function NeoButton({ children, variant = 'primary', className = '', ...props }: NeoButtonProps) {
  return (
    <a 
      className={`neo-button ${variant === 'secondary' ? 'secondary' : ''} ${className}`} 
      {...props}
    >
      {children}
    </a>
  );
}
