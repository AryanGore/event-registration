import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <div className="container navbar">
        <Link to="/" className="nav-brand text-gradient">
          <Calendar size={24} color="#6366f1" />
          EventTix
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Events</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link flex items-center">
                <User size={18} style={{ marginRight: '4px' }} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                <LogIn size={16} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
