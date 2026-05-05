import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team projects.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      <div className="stats-grid">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <div className="glass-panel stat-card" style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {project.description?.substring(0, 60) || 'No description'}...
                </p>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-in-progress">{project.tasks?.length || 0} Tasks</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div style={{ color: 'var(--text-secondary)' }}>No projects found.</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>Create Project</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>X</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Project Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
