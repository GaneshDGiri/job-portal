import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const RecruiterProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    location: user?.location || '',
    position: user?.position || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || ''
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (profilePic) data.append('profilePic', profilePic);

    try {
        const res = await axios.put('http://localhost:5000/api/users/me', data, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert("✅ Company Profile Updated!");
        updateUser(res.data);
    } catch (err) { 
        alert("Update Failed: " + (err.response?.data?.msg || err.message)); 
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="card" style={{maxWidth:'800px', margin:'20px auto'}}>
        <div style={{textAlign:'center', marginBottom:'20px'}}>
             <div style={{width:'100px', height:'100px', borderRadius:'50%', background:'#fff1f2', margin:'0 auto', overflow:'hidden', border:'3px solid #ff0055'}}>
                 {user.profilePic ? (
                     <img src={`http://localhost:5000/${user.profilePic.replace(/\\/g, '/')}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                 ) : (
                     <span style={{fontSize:'3rem', lineHeight:'100px'}}>🏢</span>
                 )}
             </div>
             <h2 style={{color: '#ff0055'}}>{user.name}</h2>
             <p style={{color:'#666', fontWeight:'bold'}}>Recruiter / HR Manager</p>
        </div>

        <form onSubmit={handleUpdate} style={{display:'grid', gap:'15px'}}>
            
            {/* Personal Details */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div>
                    <label>Full Name</label>
                    <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} placeholder="Name" required />
                </div>
                <div>
                    <label>Email</label>
                    <input value={formData.email} disabled style={{background:'#eee', cursor:'not-allowed'}} />
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div>
                    <label>Mobile</label>
                    <input value={formData.mobile} onChange={e=>setFormData({...formData, mobile:e.target.value})} placeholder="Mobile" />
                </div>
                <div>
                    <label>Location</label>
                    <input value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} placeholder="Location" />
                </div>
            </div>
            
            {/* Company Details */}
            <div style={{background:'#fff1f2', padding:'15px', borderRadius:'8px', border:'1px solid #fecdd3'}}>
                <h4 style={{marginTop:0, color:'#9f1239'}}>Company Information</h4>
                
                <label>Your Job Position</label>
                <input value={formData.position} onChange={e=>setFormData({...formData, position:e.target.value})} placeholder="e.g. HR Manager, Talent Acquisition" style={{marginBottom:'10px'}} />
                
                <label>Company Name</label>
                <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} placeholder="e.g. TechCorp Solutions" style={{marginBottom:'10px'}} />
                
                <label>About Company</label>
                <textarea rows="4" value={formData.companyDescription} onChange={e=>setFormData({...formData, companyDescription:e.target.value})} placeholder="Brief description of your company..." />
            </div>

            <label>Update Profile Picture</label>
            <input type="file" onChange={e=>setProfilePic(e.target.files[0])} accept="image/*" />

            <button className="btn" style={{backgroundColor: '#ff0055'}} disabled={loading}>
                {loading ? 'Updating...' : '💾 Save Changes'}
            </button>
        </form>
    </div>
  );
};

export default RecruiterProfile;