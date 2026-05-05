import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}>
            <LayoutDashboard />
          </div>
          <div>
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.totalTasks}</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
            <ListTodo />
          </div>
          <div>
            <div className="stat-label">To Do</div>
            <div className="stat-value">{stats.todoTasks}</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
            <Clock />
          </div>
          <div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgressTasks}</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
            <CheckCircle />
          </div>
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.doneTasks}</div>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>
            <AlertCircle />
          </div>
          <div>
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{stats.overdueTasks}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Recent Activity</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Go to the Projects tab to manage your tasks.</p>
      </div>
    </div>
  );
};

export default Dashboard;
