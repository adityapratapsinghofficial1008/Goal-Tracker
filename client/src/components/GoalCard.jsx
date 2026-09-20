import React, { useState } from 'react';
import { Target, Calendar as CalendarIcon, CheckSquare, Square, Plus, Trash2, ChevronRight, ChevronDown, ChevronUp, Layers, List } from 'lucide-react';
import ArtDecoProgressBar from './ArtDecoProgressBar';
import ConfirmModal from './ConfirmModal';

function SubGoalItem({
  subGoal,
  goalId,
  activeTaskInputSubGoalId,
  setActiveTaskInputSubGoalId,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDate,
  setNewTaskDate,
  handleCreateTask,
  promptSubGoalDelete,
  onToggleTask,
  promptTaskDelete
}) {
  const [showTasks, setShowTasks] = useState(true);
  const taskCount = subGoal.tasks ? subGoal.tasks.length : 0;

  return (
    <div style={{
      background: 'rgba(9, 12, 16, 0.7)',
      borderLeft: '3px solid var(--gold-primary)',
      padding: '1rem',
      border: '1px solid rgba(229, 185, 95, 0.15)',
      borderLeftWidth: '4px'
    }}>
      {/* Sub Goal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Month: {subGoal.month} | Date: {subGoal.assignedDate || 'Unscheduled'}
          </span>
          <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'var(--font-accent)', margin: '2px 0 0 0' }}>
            {subGoal.title}
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', marginRight: '0.25rem' }}>
            {subGoal.progress || 0}%
          </span>
          <button
            onClick={() => setShowTasks(!showTasks)}
            className="btn-art-deco-outline"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={showTasks ? "Hide Tasks" : "Show Tasks"}
          >
            {showTasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showTasks ? 'Hide Tasks' : `Tasks (${taskCount})`}
          </button>
          <button
            onClick={() => setActiveTaskInputSubGoalId(activeTaskInputSubGoalId === subGoal._id ? null : subGoal._id)}
            className="btn-art-deco-outline"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
          >
            + Task
          </button>
          <button
            type="button"
            onClick={(e) => promptSubGoalDelete(e, subGoal)}
            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', opacity: 0.8, padding: '4px', display: 'flex', alignItems: 'center' }}
            title="Delete Sub-Goal"
          >
            <Trash2 size={15} style={{ pointerEvents: 'none' }} />
          </button>
        </div>
      </div>

      <ArtDecoProgressBar progress={subGoal.progress || 0} height="8px" showPercent={false} />

      {/* Sub Goal Task Add Form */}
      {activeTaskInputSubGoalId === subGoal._id && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(18,24,36,0.9)', border: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Task name (e.g. Design homepage layout)"
              className="art-deco-input"
              style={{ flex: 2, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
            <input
              type="date"
              className="art-deco-input"
              style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              value={newTaskDate}
              onChange={e => setNewTaskDate(e.target.value)}
            />
            <button onClick={() => handleCreateTask(subGoal._id)} className="btn-art-deco" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              Save Task
            </button>
          </div>
        </div>
      )}

      {/* Nested Micro Tasks List */}
      {showTasks && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(!subGoal.tasks || subGoal.tasks.length === 0) ? (
            <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
              No tasks added yet. Click "+ Task" above to add action items.
            </div>
          ) : (
            subGoal.tasks.map(task => (
              <div key={task._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: task.isCompleted ? 'rgba(26, 184, 139, 0.08)' : 'rgba(255,255,255,0.02)',
                padding: '0.4rem 0.6rem',
                border: '1px solid rgba(229, 185, 95, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task._id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.isCompleted ? '#1ab88b' : 'var(--text-muted)' }}
                  >
                    {task.isCompleted ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                  <span style={{
                    fontSize: '0.85rem',
                    color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: task.isCompleted ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--gold-dark)' }}>{task.date}</span>
                  <button
                    type="button"
                    onClick={(e) => promptTaskDelete(e, task)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', opacity: 0.8, padding: '4px', display: 'flex', alignItems: 'center' }}
                    title="Delete Task"
                  >
                    <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function GoalCard({ goal, onDeleteGoal, onAddSubGoal, onDeleteSubGoal, onAddTask, onToggleTask, onDeleteTask }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSubGoalInput, setShowSubGoalInput] = useState(false);
  const [newSubGoalTitle, setNewSubGoalTitle] = useState('');
  const [newSubGoalMonth, setNewSubGoalMonth] = useState(new Date().toISOString().substring(0, 7));
  const [newSubGoalDate, setNewSubGoalDate] = useState(new Date().toISOString().substring(0, 10));

  const [activeTaskInputSubGoalId, setActiveTaskInputSubGoalId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().substring(0, 10));

  // Custom Art Deco Deletion Modal State
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const closeConfirmModal = () => setConfirmConfig({ ...confirmConfig, isOpen: false });

  const handleCreateSubGoal = (e) => {
    e.preventDefault();
    if (!newSubGoalTitle.trim()) return;
    onAddSubGoal(goal._id, {
      title: newSubGoalTitle,
      month: newSubGoalMonth,
      assignedDate: newSubGoalDate
    });
    setNewSubGoalTitle('');
    setShowSubGoalInput(false);
  };

  const handleCreateTask = (subGoalId) => {
    if (!newTaskTitle.trim()) return;
    onAddTask(subGoalId, {
      title: newTaskTitle,
      date: newTaskDate,
      goalId: goal._id
    });
    setNewTaskTitle('');
    setActiveTaskInputSubGoalId(null);
  };

  const promptGoalDelete = (e) => {
    e.stopPropagation();
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Master Goal',
      message: `Are you sure you want to permanently delete "${goal.title}" along with all its sub-goals and tasks?`,
      onConfirm: () => {
        onDeleteGoal(goal._id);
        closeConfirmModal();
      }
    });
  };

  const promptSubGoalDelete = (e, subGoal) => {
    e.stopPropagation();
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Sub-Goal',
      message: `Are you sure you want to delete the sub-goal "${subGoal.title}" and its micro-tasks?`,
      onConfirm: () => {
        onDeleteSubGoal(subGoal._id);
        closeConfirmModal();
      }
    });
  };

  const promptTaskDelete = (e, task) => {
    e.stopPropagation();
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Action Task',
      message: `Are you sure you want to delete the task "${task.title}"?`,
      onConfirm: () => {
        onDeleteTask(task._id);
        closeConfirmModal();
      }
    });
  };

  const subGoalCount = goal.subgoals ? goal.subgoals.length : 0;

  return (
    <div className="art-deco-card" style={{ marginBottom: '2rem' }}>
      {/* Goal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: 'rgba(229, 185, 95, 0.15)',
              color: 'var(--gold-primary)',
              border: '1px solid var(--border-gold)',
              padding: '2px 8px',
              fontSize: '0.7rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-heading)'
            }}>
              {goal.category || 'Master Goal'}
            </span>

            <span style={{
              fontSize: '0.75rem',
              color: goal.status === 'Completed' ? '#1ab88b' : 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CalendarIcon size={12} /> Target: {goal.targetDate || 'No Date'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {goal.title}
          </h2>

          {goal.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {goal.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-art-deco-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={isExpanded ? "Hide Sub-Goals" : "Show Sub-Goals"}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Sub-Goals' : `Show Sub-Goals (${subGoalCount})`}
          </button>
          <button
            onClick={() => {
              if (!isExpanded) setIsExpanded(true);
              setShowSubGoalInput(!showSubGoalInput);
            }}
            className="btn-art-deco-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
          >
            <Plus size={14} /> Add Sub-Goal
          </button>
          <button
            type="button"
            onClick={promptGoalDelete}
            style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', opacity: 0.8, padding: '6px', display: 'flex', alignItems: 'center' }}
            title="Delete Goal"
          >
            <Trash2 size={18} style={{ pointerEvents: 'none' }} />
          </button>
        </div>
      </div>

      {/* Progress Bar for Master Goal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <ArtDecoProgressBar progress={goal.overallProgress || 0} label="Final Goal Progress" height="16px" />
      </div>

      {/* Add Sub-Goal Inline Form */}
      {showSubGoalInput && (
        <form onSubmit={handleCreateSubGoal} style={{
          background: 'rgba(11, 29, 25, 0.6)',
          border: '1px dashed var(--border-gold)',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px'
        }}>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
            Add New Sub-Goal to Month & Date
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              placeholder="Sub-Goal Title (e.g. Frontend Architecture)"
              className="art-deco-input"
              value={newSubGoalTitle}
              onChange={e => setNewSubGoalTitle(e.target.value)}
              required
            />
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assigned Date</label>
              <input
                type="date"
                className="art-deco-input"
                value={newSubGoalDate}
                onChange={e => {
                  setNewSubGoalDate(e.target.value);
                  setNewSubGoalMonth(e.target.value.substring(0, 7));
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assigned Month</label>
              <input
                type="month"
                className="art-deco-input"
                value={newSubGoalMonth}
                onChange={e => setNewSubGoalMonth(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowSubGoalInput(false)} className="btn-art-deco-outline" style={{ padding: '0.4rem 0.8rem' }}>Cancel</button>
            <button type="submit" className="btn-art-deco" style={{ padding: '0.4rem 1rem' }}>Create Sub-Goal</button>
          </div>
        </form>
      )}

      {/* Sub-Goals Hierarchy Tree */}
      {isExpanded && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} /> Sub-Goals & Micro Tasks ({subGoalCount})
            </h3>
          </div>

          {(!goal.subgoals || goal.subgoals.length === 0) ? (
            <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem', textAlign: 'center', border: '1px rgba(229,185,95,0.1) solid' }}>
              No sub-goals assigned yet. Click "Add Sub-Goal" above to break down this final goal into monthly/dated targets.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {goal.subgoals.map(subGoal => (
                <SubGoalItem
                  key={subGoal._id}
                  subGoal={subGoal}
                  goalId={goal._id}
                  activeTaskInputSubGoalId={activeTaskInputSubGoalId}
                  setActiveTaskInputSubGoalId={setActiveTaskInputSubGoalId}
                  newTaskTitle={newTaskTitle}
                  setNewTaskTitle={setNewTaskTitle}
                  newTaskDate={newTaskDate}
                  setNewTaskDate={setNewTaskDate}
                  handleCreateTask={handleCreateTask}
                  promptSubGoalDelete={promptSubGoalDelete}
                  onToggleTask={onToggleTask}
                  promptTaskDelete={promptTaskDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}


