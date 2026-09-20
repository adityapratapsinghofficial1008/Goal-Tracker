import React from 'react';

export default function ChronosLogo({ size = 40, showText = true, layout = 'horizontal', className = '' }) {
  const iconMarkup = (
    <svg 
      viewBox="0 0 400 400" 
      width={size} 
      height={size} 
      className="chronos-logo-svg"
      style={{ filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.5))' }}
    >
      <defs>
        <linearGradient id="navGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF0B9"/>
          <stop offset="25%" stopColor="#DFAC42"/>
          <stop offset="50%" stopColor="#C68C27"/>
          <stop offset="75%" stopColor="#FCEBA2"/>
          <stop offset="100%" stopColor="#8B6508"/>
        </linearGradient>

        <linearGradient id="navGoldHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8860B"/>
          <stop offset="40%" stopColor="#FCEEA7"/>
          <stop offset="60%" stopColor="#FFFAD6"/>
          <stop offset="100%" stopColor="#D4AF37"/>
        </linearGradient>

        <linearGradient id="navGoldShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#996D1D"/>
          <stop offset="50%" stopColor="#543A0B"/>
          <stop offset="100%" stopColor="#2C1D04"/>
        </linearGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Outer Dial Rim */}
        <path d="M 75,240 A 140,140 0 1,1 315,230" 
              fill="none" stroke="url(#navGoldMetallic)" strokeWidth="14" strokeLinecap="round"/>

        {/* Clock Ticks */}
        <line x1="115" y1="110" x2="102" y2="96" stroke="url(#navGoldHighlight)" strokeWidth="6" strokeLinecap="round"/>
        <line x1="170" y1="75" x2="168" y2="55" stroke="url(#navGoldHighlight)" strokeWidth="6" strokeLinecap="round"/>
        <line x1="230" y1="75" x2="235" y2="56" stroke="url(#navGoldHighlight)" strokeWidth="6" strokeLinecap="round"/>
        <line x1="68" y1="180" x2="48" y2="178" stroke="url(#navGoldHighlight)" strokeWidth="6" strokeLinecap="round"/>

        <circle cx="238" cy="57" r="7" fill="url(#navGoldHighlight)"/>
        <circle cx="101" cy="95" r="5" fill="url(#navGoldHighlight)"/>

        {/* Gauge Ticks */}
        <path d="M 318,180 A 140,140 0 0,1 280,295" 
              fill="none" stroke="url(#navGoldMetallic)" strokeWidth="9" strokeLinecap="round" strokeDasharray="10 12"/>

        {/* Inner Concentric Dial Arc */}
        <path d="M 130,250 A 90,90 0 1,1 270,140" 
              fill="none" stroke="url(#navGoldHighlight)" strokeWidth="10" strokeLinecap="round"/>
        
        <path d="M 160,255 A 65,65 0 0,0 255,220" 
              fill="none" stroke="url(#navGoldMetallic)" strokeWidth="7" strokeLinecap="round"/>

        {/* Dynamic 3D Gold Arrow & Trend Lines */}
        <polygon points="70,290 100,290 165,155 140,155" fill="url(#navGoldHighlight)"/>
        <polygon points="100,290 118,270 165,155" fill="url(#navGoldShadow)"/>

        <polygon points="165,155 220,235 195,250 140,155" fill="url(#navGoldMetallic)"/>
        <polygon points="220,235 235,220 195,250" fill="url(#navGoldShadow)"/>

        <polygon points="195,250 300,95 325,108 220,235" fill="url(#navGoldHighlight)"/>
        <polygon points="220,235 300,95 280,90 195,250" fill="url(#navGoldShadow)"/>

        {/* Arrowhead */}
        <polygon points="270,120 345,60 315,125 298,105" fill="url(#navGoldHighlight)"/>
        <polygon points="345,60 325,145 315,125" fill="url(#navGoldShadow)"/>
        <polyline points="270,120 345,60 315,125" fill="none" stroke="#FFFAD6" strokeWidth="2"/>
      </g>
    </svg>
  );

  if (!showText) return iconMarkup;

  return (
    <div 
      className={`chronos-logo-wrapper ${className}`} 
      style={{ 
        display: 'inline-flex', 
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        alignItems: 'center', 
        gap: layout === 'vertical' ? '0.5rem' : '0.75rem',
        textDecoration: 'none'
      }}
    >
      {iconMarkup}
      <div style={{ textAlign: layout === 'vertical' ? 'center' : 'left', display: 'flex', flexDirection: 'column' }}>
        <span className="gold-text" style={{ 
          fontSize: layout === 'vertical' ? '1.8rem' : '1.35rem', 
          fontWeight: 900, 
          letterSpacing: '0.25em',
          fontFamily: "'Cinzel', 'Trajan Pro', 'Georgia', serif",
          lineHeight: 1
        }}>
          CHRONOS
        </span>
        <span style={{ 
          fontSize: layout === 'vertical' ? '0.75rem' : '0.65rem', 
          fontWeight: 700, 
          letterSpacing: '0.35em', 
          color: 'var(--gold-mid, #e5b95f)',
          marginTop: '3px',
          textTransform: 'uppercase'
        }}>
          GOAL TRACKER
        </span>
      </div>
    </div>
  );
}
