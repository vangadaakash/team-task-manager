import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, LayoutList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LayoutList size={28} color="var(--accent-primary)" />
        Taskify
      </div>

      <nav className="nav-links">
        <NavLink 
          to="/" 
          className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FolderKanban size={20} />
          Projects
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
        <div style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem' }}>Role: {user?.role}</div>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
