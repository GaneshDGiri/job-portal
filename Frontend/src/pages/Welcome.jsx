import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGo = () => {
    navigate('/home'); 
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* LOGO CIRCLE */}
        <div style={styles.logoCircle}>
            <span style={{fontSize:'4rem'}}>🚀</span>
        </div>
        
        {/* BRAND TITLE WITH SPACES */}
        <h1 style={styles.title}>
          Job Portal <span style={{color:'#ff0055'}}>Pro</span>
        </h1>
        
        <p style={styles.subtitle}>Find your dream job or the perfect candidate.</p>

        <button onClick={handleGo} style={styles.button}>
          GO ➔
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #000 100%)',
    color: 'white',
    textAlign: 'center'
  },
  content: {
    animation: 'fadeIn 1.5s ease-in-out'
  },
  logoCircle: {
    width: '120px',
    height: '120px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
    border: '2px solid rgba(255,255,255,0.2)',
    boxShadow: '0 0 30px rgba(0, 123, 255, 0.3)'
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 10px 0',
    letterSpacing: '2px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#cbd5e1',
    marginBottom: '40px'
  },
  button: {
    padding: '15px 40px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    background: '#ff0055',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.2s',
    boxShadow: '0 5px 15px rgba(255, 0, 85, 0.4)'
  }
};

export default Welcome;