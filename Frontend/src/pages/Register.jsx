import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const intendedRole = location.state?.role || 'seeker';
  const isRecruiter = intendedRole === 'employer';

  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: intendedRole 
  });
  const [showPassword, setShowPassword] = useState(false); //

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('✅ Registration Successful!');
      navigate('/login', { state: { role: intendedRole } });
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{maxWidth:'500px', marginTop:'50px'}}>
      <div className="card" style={{borderTop: isRecruiter ? '5px solid #ff0055' : '5px solid #007bff'}}>
        
        <h2 style={{textAlign:'center', color: isRecruiter ? '#ff0055' : '#007bff'}}>
          📝 {isRecruiter ? 'Recruiter Registration' : 'Job Seeker Registration'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input placeholder="Enter your name" onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
          
          <label>Email Address</label>
          <input type="email" placeholder="email@example.com" onChange={(e)=>setFormData({...formData, email:e.target.value})} required />
          
          <label>Password</label>
          {/* Password Wrapper with Eye Icon */}
          <div className="password-wrapper" style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} //
              placeholder="Create a password" 
              onChange={(e)=>setFormData({...formData, password:e.target.value})} 
              required 
              style={{ paddingRight: '45px', width: '100%', margin:0 }} 
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

          <div style={{marginTop:'20px', padding:'10px', background:'#f1f5f9', borderRadius:'5px', textAlign:'center'}}>
             Registering as: <strong>{isRecruiter ? 'Recruiter / Employer' : 'Job Seeker'}</strong>
          </div>

          <button className="btn" style={{marginTop:'20px', backgroundColor: isRecruiter ? '#ff0055' : '#007bff'}}>
            Create {isRecruiter ? 'Recruiter' : 'Seeker'} Account
          </button>
        </form>
        
        <p style={{textAlign:'center', marginTop:'15px'}}>
          Already have an account? <Link to="/login" state={{ role: intendedRole }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;