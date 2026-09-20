import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GoalCard from './components/GoalCard';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import NewGoalModal from './components/NewGoalModal';
import ChronosLogo from './components/ChronosLogo';
import confetti from 'canvas-confetti';
import { Target, Compass } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Goals & Analytics
  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_BASE}/goals`);
      const data = await res.json();
      if (data.goals) {
        setGoals(data.goals);
      }

      const analyticsRes = await fetch(`${API_BASE}/analytics`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('API Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Create Goal
  const handleCreateGoal = async (goalData) => {
    try {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error('Create Goal error:', e);
    }
  };

  // Delete Goal
  const handleDeleteGoal = async (id) => {
    try {
      await fetch(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      console.error('Delete Goal error:', e);
    }
  };

  // Add SubGoal
  const handleAddSubGoal = async (goalId, subGoalData) => {
    try {
      const res = await fetch(`${API_BASE}/goals/${goalId}/subgoals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subGoalData)
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Add SubGoal error:', e);
    }
  };

  // Delete SubGoal
  const handleDeleteSubGoal = async (subGoalId) => {
    try {
      await fetch(`${API_BASE}/subgoals/${subGoalId}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      console.error('Delete SubGoal error:', e);
    }
  };

  // Add Task
  const handleAddTask = async (subGoalId, taskData) => {
    try {
      const res = await fetch(`${API_BASE}/subgoals/${subGoalId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Add Task error:', e);
    }
  };

  // Toggle Task Status (Done / In Progress)
  const handleToggleTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        // Trigger celebratory confetti on completion
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#e5b95f', '#fbe6a2', '#1ab88b']
        });
        fetchAllData();
      }
    } catch (e) {
      console.error('Toggle Task error:', e);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      console.error('Delete Task error:', e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewGoalModal={() => setIsModalOpen(true)}
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem', flex: 1 }}>

        {/* Tab Content Render */}
        {activeTab === 'goals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} /> Master Goals & Sub-Goal Trees ({goals.length})
              </h2>
            </div>

            {goals.length === 0 ? (
              <div className="art-deco-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <ChronosLogo size={80} showText={false} />
                </div>
                <h3 className="gold-text" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>CHRONOS GOAL TRACKER</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>Establish your master vision and break it down into structured monthly milestones and actionable daily tasks.</p>
                <button onClick={() => setIsModalOpen(true)} className="btn-art-deco">
                  + Create First Goal
                </button>
              </div>
            ) : (
              goals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onDeleteGoal={handleDeleteGoal}
                  onAddSubGoal={handleAddSubGoal}
                  onDeleteSubGoal={handleDeleteSubGoal}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView goals={goals} onToggleTask={handleToggleTask} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analyticsData={analytics} goals={goals} />
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{
        borderTop: '1px solid rgba(229, 185, 95, 0.15)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        background: 'rgba(9, 12, 16, 0.95)'
      }}>
        <ChronosLogo size={28} showText={true} />
      </footer>

      <NewGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />
    </div>
  );
}
