import React, { useState } from 'react';
import { Calendar, BarChart3, Award, PlusCircle, Compass, Database, HardDrive, Key } from 'lucide-react';
import ChronosLogo from './ChronosLogo';

export default function Navbar({ activeTab, setActiveTab, onOpenNewGoalModal, storageType, mongoUri, onSaveMongoUri }) {
  const [isUriModalOpen, setIsUriModalOpen] = useState(false);
  const [inputUri, setInputUri] = useState(mongoUri || '');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveMongoUri(inputUri.trim());
    setIsUriModalOpen(false);
  };

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
        {/* Brand Header */}
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

        {/* Action Buttons & Storage Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Storage Type Badge */}
          <button
            onClick={() => setIsUriModalOpen(true)}
            title="Click to configure custom MongoDB connection string"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              background: storageType === 'MongoDB' ? 'rgba(26, 184, 139, 0.15)' : 'rgba(229, 185, 95, 0.15)',
              border: `1px solid ${storageType === 'MongoDB' ? 'var(--emerald-bright)' : 'var(--gold-primary)'}`,
              color: storageType === 'MongoDB' ? 'var(--emerald-bright)' : 'var(--gold-light)',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 500
            }}
          >
            {storageType === 'MongoDB' ? <Database size={14} /> : <HardDrive size={14} />}
            <span>Storage: <strong>{storageType || 'LocalStorage'}</strong></span>
            <Key size={12} style={{ opacity: 0.7, marginLeft: '0.2rem' }} />
          </button>

          <button onClick={onOpenNewGoalModal} className="btn-art-deco">
            <PlusCircle size={16} /> New Final Goal
          </button>
        </div>
      </div>

      {/* MongoDB Connection Modal */}
      {isUriModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="art-deco-card" style={{ maxWidth: '500px', width: '90%', background: 'var(--bg-card-dark)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Database size={20} color="var(--gold-primary)" /> Configure Storage Engine
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem', lineHeight: '1.5' }}>
              Enter your personal <strong>MongoDB Connection String</strong> (e.g. <code>mongodb+srv://...</code>).
              If left blank, your goals will be safely stored in your browser's local storage engine.
            </p>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', marginBottom: '0.4rem' }}>
                  MongoDB Connection URI (Saved in Browser Storage)
                </label>
                <input
                  type="password"
                  value={inputUri}
                  onChange={(e) => setInputUri(e.target.value)}
                  placeholder="mongodb+srv://username:password@cluster.mongodb.net/dbname"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(9,12,16,0.8)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {inputUri && (
                  <button
                    type="button"
                    onClick={() => { setInputUri(''); onSaveMongoUri(''); setIsUriModalOpen(false); }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Clear & Use LocalStorage
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsUriModalOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-art-deco" style={{ padding: '0.5rem 1.2rem' }}>
                  Save Storage Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
