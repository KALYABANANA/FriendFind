import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, UsersRound, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" width="28" alt="logo" /> FriendFind
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          Users
        </NavLink>
        <NavLink to="/subjects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          Subjects
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UsersRound size={20} />
          Groups
        </NavLink>
      </nav>
      
      <div className="nav-links" style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
        <button onClick={onLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#EF4444' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
