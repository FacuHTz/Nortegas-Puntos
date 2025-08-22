import React from 'react';

const GarrafaIcon = ({ size = 24, className = "", color = "currentColor" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base de la garrafa */}
      <path 
        d="M6 20h12c1 0 2-1 2-2v-1H4v1c0 1 1 2 2 2z" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.3"
      />
      
      {/* Cuerpo principal cilíndrico */}
      <rect 
        x="5" 
        y="8" 
        width="14" 
        height="9" 
        rx="1" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.3"
      />
      
      {/* Cuello de la garrafa */}
      <rect 
        x="9" 
        y="6" 
        width="6" 
        height="2" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.3"
      />
      
      {/* Válvula superior */}
      <path 
        d="M10 6V4c0-0.5 0.5-1 1-1h2c0.5 0 1 0.5 1 1v2" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.4"
      />
      
      {/* Manija izquierda */}
      <path 
        d="M5 10c-1 0-2-0.5-2-1.5S4 7 5 7" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.4"
      />
      
      {/* Manija derecha */}
      <path 
        d="M19 10c1 0 2-0.5 2-1.5S20 7 19 7" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
        opacity="0.4"
      />
      
      {/* Línea divisoria del cuerpo */}
      <line 
        x1="6" 
        y1="13" 
        x2="18" 
        y2="13" 
        stroke={color} 
        strokeWidth="1" 
        opacity="0.2"
      />
    </svg>
  );
};

export default GarrafaIcon;

