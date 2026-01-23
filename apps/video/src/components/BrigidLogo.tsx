import type React from 'react';

export const BrigidLogo: React.FC<{ size?: number }> = ({ size = 100 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Brigid Logo</title>
      <circle cx="50" cy="50" r="45" stroke="#38bdf8" strokeWidth="8" />
      <path 
        d="M30 50L45 65L70 35" 
        stroke="#38bdf8" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="50" cy="50" r="20" fill="#38bdf8" fillOpacity="0.2" />
    </svg>
  );
};
