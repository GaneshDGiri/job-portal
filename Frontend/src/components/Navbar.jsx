import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  if (location.pathname === '/') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={styles.nav}>
      <h1 onClick={() => navigate('/home')} style={styles.logo}>
        Job Portal <span style={{color:'#ff0055'}}>Pro</span>
      </h1>
      
      <div style={styles.links}>
        {user ? (
          <>
            {/* --- ADDED THIS LINK --- */}
            <Link to="/jobs" style={styles.link}>🔍 Find Jobs</Link>
            
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 30px', background: '#1e293b', color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  logo: { margin: 0, cursor: 'pointer', fontSize:'1.5rem', fontWeight:'bold' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight:'500' },
  logoutBtn: { background: '#ff0055', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' }
};

export default Navbar;