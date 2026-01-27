import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={{fontSize:'3rem', marginBottom:'10px', fontWeight: '800'}}>
        Job Portal <span style={{color:'#ff0055'}}>Pro</span>
      </h1>
      
      <p style={{color:'#666', marginBottom:'50px', fontSize:'1.2rem'}}>
        The bridge between talent and opportunity. Choose your role below.
      </p>

      <div style={styles.grid}>
        
        {/* === OPTION 1: JOB SEEKER (Blue Theme) === */}
        <div style={styles.card}>
            <div style={styles.icon}>👨‍💻</div>
            <h2 style={{color: '#007bff'}}>I am a Job Seeker</h2>
            <p style={{color:'#666', marginBottom:'25px'}}>
              Browse jobs, upload your resume, and track your applications.
            </p>
            <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
                {/* Passing state role: 'seeker' */}
                <Link to="/login" state={{ role: 'seeker' }}>
                    <button style={styles.btnSeeker}>Login as Seeker</button>
                </Link>
                <Link to="/register" state={{ role: 'seeker' }}>
                    <button style={styles.btnSeekerOutline}>Register as Seeker</button>
                </Link>
            </div>
        </div>

        {/* === OPTION 2: RECRUITER (Pink Theme) === */}
        <div style={{...styles.card, borderTop: '5px solid #ff0055'}}>
            <div style={styles.icon}>🏢</div>
            <h2 style={{color: '#ff0055'}}>I am a Recruiter</h2>
            <p style={{color:'#666', marginBottom:'25px'}}>
              Post jobs, manage candidates, and hire the best talent.
            </p>
            <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
                {/* Passing state role: 'employer' */}
                <Link to="/login" state={{ role: 'employer' }}>
                    <button style={styles.btnRecruiter}>Login as Recruiter</button>
                </Link>
                <Link to="/register" state={{ role: 'employer' }}>
                    <button style={styles.btnRecruiterOutline}>Register as Recruiter</button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    grid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        maxWidth: '1000px',
        width: '100%'
    },
    card: {
        background: 'white',
        padding: '50px 30px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '5px solid #007bff'
    },
    icon: {
        fontSize: '4.5rem',
        marginBottom: '20px',
        background: '#f8f9fa',
        width: '100px',
        height: '100px',
        lineHeight: '100px',
        borderRadius: '50%',
        margin: '0 auto 20px auto'
    },
    btnSeeker: {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        transition: 'all 0.3s'
    },
    btnSeekerOutline: {
        background: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
        padding: '10px 18px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    btnRecruiter: {
        background: '#ff0055',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    btnRecruiterOutline: {
        background: 'transparent',
        color: '#ff0055',
        border: '2px solid #ff0055',
        padding: '10px 18px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    }
};

export default Home;