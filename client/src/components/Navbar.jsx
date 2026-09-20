import React from 'react';
import { Calendar, BarChart3, Award, PlusCircle, Compass } from 'lucide-react';
import ChronosLogo from './ChronosLogo';

export default function Navbar({ activeTab, setActiveTab, onOpenNewGoalModal }) {
  return (
    <header className="navbar-container" style={{
      borderBottom: '1px solid var(--border-gold)',
      background: 'rgba(9, 12, 16, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Header with SVG Chronos Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('goals')}>
          <ChronosLogo size={42} showText={true} />
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(18, 24, 36, 0.6)', padding: '4px', border: '1px solid rgba(229,185,95,0.2)' }}>
          <button
            onClick={() => setActiveTab('goals')}
            className={activeTab === 'goals' ? 'btn-art-deco' : 'btn-art-deco-outline'}
            style={{ padding: '0.5rem 1rem' }}
          >
            <Compass size={16} /> Goals Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={activeTab === 'calendar' ? 'btn-art-deco' : 'btn-art-deco-outline'}
            style={{ padding: '0.5rem 1rem' }}
          >
            <Calendar size={16} /> Calendar & Month Matrix
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'btn-art-deco' : 'btn-art-deco-outline'}
            style={{ padding: '0.5rem 1rem' }}
          >
            <BarChart3 size={16} /> Analytics & Heatmap
          </button>
        </nav>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onOpenNewGoalModal} className="btn-art-deco">
            <PlusCircle size={16} /> New Final Goal
          </button>
        </div>
      </div>
    </header>
  );
}
