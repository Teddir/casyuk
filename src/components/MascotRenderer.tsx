import { useState, useEffect } from 'react';
import catNormal from '../assets/mascot/cat_normal.png';
import catLow from '../assets/mascot/cat_low.png';
import catCritical from '../assets/mascot/cat_critical.png';

interface MascotProps {
  percentage: number;
  lowThreshold: number;
  criticalThreshold: number;
  size?: number;
}

export function MascotRenderer({ percentage, lowThreshold, criticalThreshold, size = 150 }: MascotProps) {
  const [animationClass, setAnimationClass] = useState('mascot-breathe');

  // Determine state
  let state = 'normal';
  if (percentage <= criticalThreshold) {
    state = 'critical';
  } else if (percentage <= lowThreshold) {
    state = 'low';
  }

  // Map state to image and animation
  let currentImage = catNormal;
  if (state === 'critical') {
    currentImage = catCritical;
  } else if (state === 'low') {
    currentImage = catLow;
  }

  useEffect(() => {
    if (state === 'critical') {
      setAnimationClass('mascot-shake');
    } else if (state === 'low') {
      setAnimationClass('mascot-droop');
    } else {
      setAnimationClass('mascot-breathe');
    }
  }, [state]);

  return (
    <div style={{ 
      width: size, 
      height: size, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative'
    }}>
      <img 
        src={currentImage} 
        alt={`Cat mascot - ${state} state`} 
        className={animationClass}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.3))'
        }}
      />
    </div>
  );
}
