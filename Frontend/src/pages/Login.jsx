import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); //
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  const intendedRole = location.state?.role || 'seeker';
  const isRecruiter = intendedRole === 'employer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const user = res.data.user;

      if (user.role !== intendedRole) {
        alert(`⚠️ Access Denied! This is the ${isRecruiter ? 'Recruiter' : 'Seeker'} login page.`);
        return;
      }

      login(user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '80px'}}>
      <div className="card" style={{borderTop: isRecruiter ? '5px solid #ff0055' : '5px solid #007bff'}}>
        <h2 style={{textAlign:'center', color: isRecruiter ? '#ff0055' : '#007bff'}}>
          {isRecruiter ? '🏢 Recruiter Login' : '👨‍💻 Job Seeker Login'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <input 
            type="email" placeholder="Email" required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          {/* Password Wrapper with Eye Icon */}
          <div className="password-wrapper" style={{position: 'relative'}}>
            <input 
              type={showPassword ? "text" : "password"} //
              placeholder="Password" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{paddingRight: '45px', width: '100%', margin: 0}}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} //
              style={{
                position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                cursor: 'pointer', fontSize: '1.2rem', userSelect: 'none'
              }}
            >
              {showPassword ? "👁️" : "🙈"} {/* */}
            </span>
          </div>

          <button className="btn" style={{backgroundColor: isRecruiter ? '#ff0055' : '#007bff'}}>
            Login
          </button>
        </form>

        <p style={{textAlign:'center', marginTop:'15px'}}>
          No account? <Link to="/register" state={{ role: intendedRole }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;