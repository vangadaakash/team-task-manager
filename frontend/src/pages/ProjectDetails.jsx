import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Clock, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    fetchProject();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/tasks/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', {
        title,
        description,
        dueDate,
        projectId: id,
        assigneeId: assigneeId || null
      });
      setShowTaskModal(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssigneeId('');
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating task');
    }
  };

  if (!project) return <div>Loading...</div>;

  const getTasksByStatus = (status) => project.tasks.filter(t => t.status === status);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={20} /> Add Task
          </button>
        )}
      </div>

      <div className="kanban-board">
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <div key={status} className="kanban-column">
            <div className="kanban-header">
              <span>{status.replace('_', ' ')}</span>
              <span className="badge badge-todo">{getTasksByStatus(status).length}</span>
            </div>
            
            {getTasksByStatus(status).map(task => (
              <div key={task.id} className="glass-panel task-card">
                <div className="task-title">{task.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {task.description}
                </div>
                
                {task.assignee && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                    Assigned to: {task.assignee.name}
                  </div>
                )}
                
                <div className="task-meta">
                  <span>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </span>
                  
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--glass-border)' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>Add Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>X</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Task Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Assign To</label>
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
