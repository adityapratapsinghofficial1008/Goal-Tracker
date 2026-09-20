import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete Item' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 10, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="art-deco-card" style={{ maxWidth: '450px', width: '100%', padding: '1.75rem', border: '1px solid #e74c3c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(231, 76, 60, 0.3)', paddingBottom: '0.6rem' }}>
          <h3 style={{ color: '#e74c3c', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#e74c3c" /> {title || 'Confirm Action'}
          </h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} className="btn-art-deco-outline" style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-art-deco"
            style={{
              background: 'linear-gradient(135deg, #e74c3c 0%, #922b21 100%)',
              borderColor: '#e74c3c',
              color: '#ffffff',
              padding: '0.5rem 1.2rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
