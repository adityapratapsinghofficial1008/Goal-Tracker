import React, { useState } from 'react';
import { X, Target, Calendar, Tag } from 'lucide-react';

export default function NewGoalModal({ isOpen, onClose, onCreateGoal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career & Tech');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().substring(0, 10));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateGoal({ title, description, category, targetDate });
    setTitle('');
    setDescription('');
    onClose();
  };

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
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="art-deco-card" style={{ maxWidth: '550px', width: '100%', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.75rem' }}>
          <h2 className="gold-text" style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} /> Create New Final Goal
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
              Final Master Goal Title *
            </label>
            <input
              type="text"
              className="art-deco-input"
              placeholder="e.g. Master Full Stack Web Development Architecture"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select className="art-deco-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Career & Tech">Career & Tech</option>
                <option value="Personal & Lifestyle">Personal & Lifestyle</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Financial & Business">Financial & Business</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
                Completion Target Date
              </label>
              <input
                type="date"
                className="art-deco-input"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
              Goal Vision & Scope Description
            </label>
            <textarea
              className="art-deco-textarea"
              rows={3}
              placeholder="Describe the high-level objective and criteria for complete success..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-art-deco-outline">Cancel</button>
            <button type="submit" className="btn-art-deco">Establish Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
