import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, PieChart as PieIcon, Award, CheckCircle } from 'lucide-react';

export default function AnalyticsView({ analyticsData, goals }) {
  const { activities = [], totalGoals = 0, completedGoals = 0, totalTasks = 0, completedTasks = 0, subGoalBreakdown = [] } = analyticsData || {};

  // Build GitHub Heatmap days (past 60 days)
  const today = new Date();
  const heatmapDays = [];
  const activityMap = {};

  activities.forEach(act => {
    activityMap[act.date] = act.count;
  });

  for (let i = 59; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().substring(0, 10);
    const count = activityMap[dateStr] || 0;
    heatmapDays.push({ date: dateStr, count });
  }

  // Helper color for heatmap grid cell
  const getHeatmapColor = (count) => {
    if (count === 0) return 'rgba(18, 24, 36, 0.9)';
    if (count === 1) return 'rgba(229, 185, 95, 0.3)';
    if (count === 2) return 'rgba(229, 185, 95, 0.6)';
    if (count === 3) return 'rgba(229, 185, 95, 0.85)';
    return '#fbe6a2'; // max gold glow
  };

  // Build Pie Chart Data for Sub-Goal completion ratio
  const pieData = [
    { name: 'Completed Sub-Goals', value: subGoalBreakdown.filter(s => s.status === 'Completed').length, color: '#1ab88b' },
    { name: 'In Progress Sub-Goals', value: subGoalBreakdown.filter(s => s.status === 'In Progress').length, color: '#e5b95f' },
    { name: 'Not Started', value: subGoalBreakdown.filter(s => s.status === 'Not Started').length, color: '#4a5568' }
  ].filter(item => item.value > 0);

  // Fallback if pieData empty
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'Completed Sub-Goals', value: 1, color: '#1ab88b' },
    { name: 'In Progress Sub-Goals', value: 2, color: '#e5b95f' },
    { name: 'Not Started', value: 1, color: '#4a5568' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="art-deco-card" style={{ borderLeft: '4px solid var(--gold-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Master Goals</div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', marginTop: '0.4rem' }}>
            {completedGoals} / {totalGoals}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', marginTop: '0.2rem' }}>Completed</div>
        </div>

        <div className="art-deco-card" style={{ borderLeft: '4px solid #1ab88b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Action Tasks</div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#1ab88b', marginTop: '0.4rem' }}>
            {completedTasks} / {totalTasks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#1ab88b', marginTop: '0.2rem' }}>Accomplished</div>
        </div>

        <div className="art-deco-card" style={{ borderLeft: '4px solid var(--gold-dark)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sub-Goals Breakdown</div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', marginTop: '0.4rem' }}>
            {subGoalBreakdown.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Targeted Sub-goals</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* GitHub-Like Activity Heatmap Grid */}
        <div className="art-deco-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} /> Contribution Heatmap (Past 60 Days)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Visual history grid of daily completed sub-goals and tasks towards final goal fulfillment.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '6px',
            background: 'rgba(9, 12, 16, 0.8)',
            padding: '1rem',
            border: '1px solid var(--border-gold)'
          }}>
            {heatmapDays.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.count} completed actions`}
                style={{
                  aspectRatio: '1',
                  background: getHeatmapColor(day.count),
                  border: '1px solid rgba(229,185,95,0.2)',
                  borderRadius: '2px',
                  boxShadow: day.count > 0 ? `0 0 ${day.count * 4}px rgba(229, 185, 95, 0.4)` : 'none'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Less</span>
            <span style={{ width: '12px', height: '12px', background: getHeatmapColor(0), border: '1px solid #333' }}></span>
            <span style={{ width: '12px', height: '12px', background: getHeatmapColor(1) }}></span>
            <span style={{ width: '12px', height: '12px', background: getHeatmapColor(2) }}></span>
            <span style={{ width: '12px', height: '12px', background: getHeatmapColor(3) }}></span>
            <span style={{ width: '12px', height: '12px', background: getHeatmapColor(4) }}></span>
            <span>More</span>
          </div>
        </div>

        {/* Pie Chart Sub-Goal Breakdown */}
        <div className="art-deco-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={18} /> Sub-Goal Completion Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Ratio of completed vs pending sub-goals required for final goal completion.
          </p>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--gold-primary)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#121824', border: '1px solid #e5b95f', color: '#f3eedd' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
