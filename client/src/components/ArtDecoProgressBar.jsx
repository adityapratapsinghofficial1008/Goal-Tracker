import React from 'react';

export default function ArtDecoProgressBar({ progress = 0, height = '14px', label, showPercent = true }) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-accent)',
          letterSpacing: '1px'
        }}>
          {label && <span style={{ color: 'var(--text-main)', textTransform: 'uppercase' }}>{label}</span>}
          {showPercent && <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>{clamped}%</span>}
        </div>
      )}

      <div style={{
        width: '100%',
        height: height,
        background: '#090d14',
        border: '1px solid var(--border-gold)',
        padding: '2px',
        position: 'relative',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)'
      }}>
        <div style={{
          width: `${clamped}%`,
          height: '100%',
          background: 'var(--gold-metallic)',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 10px rgba(229, 185, 95, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Shimmer Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer 2s infinite'
          }} />
        </div>
      </div>
    </div>
  );
}
