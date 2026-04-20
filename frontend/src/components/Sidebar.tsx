import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, LogOut, Ticket } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Ticket size={32} color="var(--primary)" />
        <h2>CorpDesk</h2>
      </div>
      
      <div className="user-info">
        <p className="user-name">{user?.name}</p>
        <span className="user-role">{user?.role}</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/create-ticket" className={location.pathname === '/create-ticket' ? 'active' : ''}>
              <PlusCircle size={20} />
              New Ticket
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
