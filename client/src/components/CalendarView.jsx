import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';

export default function CalendarView({ goals, onToggleTask }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Extract all sub-goals & tasks mapped by date
  const tasksByDate = {};
  const subGoalsByDate = {};

  goals.forEach(goal => {
    if (goal.subgoals) {
      goal.subgoals.forEach(sg => {
        if (sg.assignedDate) {
          if (!subGoalsByDate[sg.assignedDate]) subGoalsByDate[sg.assignedDate] = [];
          subGoalsByDate[sg.assignedDate].push({ ...sg, goalTitle: goal.title });
        }
        if (sg.tasks) {
          sg.tasks.forEach(t => {
            if (t.date) {
              if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
              tasksByDate[t.date].push({ ...t, subGoalTitle: sg.title, goalTitle: goal.title });
            }
          });
        }
      });
    }
  });

  // Build calendar matrix
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const cloneDay = day;
      const hasSubGoals = subGoalsByDate[formattedDate] && subGoalsByDate[formattedDate].length > 0;
      const hasTasks = tasksByDate[formattedDate] && tasksByDate[formattedDate].length > 0;
      const isSelected = selectedDate === formattedDate;

      days.push(
        <div
          key={formattedDate}
          onClick={() => setSelectedDate(formattedDate)}
          style={{
            minHeight: '80px',
            background: isSelected ? 'rgba(229, 185, 95, 0.15)' : !isSameMonth(day, monthStart) ? 'rgba(9, 12, 16, 0.4)' : 'rgba(18, 24, 36, 0.6)',
            border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(229, 185, 95, 0.1)',
            padding: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-heading)',
            color: !isSameMonth(day, monthStart) ? 'var(--text-muted)' : isSelected ? 'var(--gold-light)' : 'var(--text-main)',
            fontWeight: isSelected ? 'bold' : 'normal'
          }}>
            {format(day, 'd')}
          </div>

          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {hasSubGoals && (
              <span style={{ fontSize: '0.65rem', background: 'rgba(229, 185, 95, 0.2)', color: 'var(--gold-primary)', padding: '1px 4px', borderLeft: '2px solid var(--gold-primary)' }}>
                {subGoalsByDate[formattedDate].length} Sub-Goal
              </span>
            )}
            {hasTasks && (
              <span style={{ fontSize: '0.65rem', background: 'rgba(26, 184, 139, 0.2)', color: '#1ab88b', padding: '1px 4px', borderLeft: '2px solid #1ab88b' }}>
                {tasksByDate[formattedDate].length} Task(s)
              </span>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days}
      </div>
    );
    days = [];
  }

  const selectedDateTasks = tasksByDate[selectedDate] || [];
  const selectedDateSubGoals = subGoalsByDate[selectedDate] || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      {/* Calendar Matrix Panel */}
      <div className="art-deco-card">
        {/* Header navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="gold-text" style={{ fontSize: '1.2rem', margin: 0 }}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={prevMonth} className="btn-art-deco-outline" style={{ padding: '0.4rem 0.8rem' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="btn-art-deco-outline" style={{ padding: '0.4rem 0.8rem' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px', fontFamily: 'var(--font-heading)', color: 'var(--gold-dark)', fontSize: '0.8rem' }}>
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        {/* Month grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {rows}
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <div className="art-deco-card">
        <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} /> Schedule for {selectedDate}
        </h3>

        {/* Sub Goals for Date */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
            Sub-Goals Assigned to Date ({selectedDateSubGoals.length})
          </h4>
          {selectedDateSubGoals.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No sub-goals assigned directly to this day.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedDateSubGoals.map(sg => (
                <div key={sg._id} style={{ background: 'rgba(229,185,95,0.08)', borderLeft: '3px solid var(--gold-primary)', padding: '0.6rem 0.8rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--gold-dark)' }}>Goal: {sg.goalTitle}</span>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>{sg.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Micro Tasks for Date */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: '#1ab88b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
            Daily Tasks & Action Items ({selectedDateTasks.length})
          </h4>
          {selectedDateTasks.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No tasks assigned for this date.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedDateTasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => onToggleTask(task._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: task.isCompleted ? 'rgba(26, 184, 139, 0.1)' : 'rgba(18, 24, 36, 0.8)',
                    border: '1px solid rgba(229,185,95,0.2)',
                    padding: '0.6rem 0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{task.goalTitle} &rsaquo; {task.subGoalTitle}</span>
                    <div style={{
                      color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      fontSize: '0.9rem'
                    }}>
                      {task.title}
                    </div>
                  </div>

                  <div>
                    {task.isCompleted ? <CheckCircle2 color="#1ab88b" size={20} /> : <Circle color="var(--text-muted)" size={20} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
