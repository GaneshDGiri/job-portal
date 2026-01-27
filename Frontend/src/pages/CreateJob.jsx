import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  // FIXED: 'workMode' must be 'Onsite' (No hyphen) to match backend enum
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', salary: '', 
    workMode: 'Onsite', jobType: 'Full-time', 
    description: '', skills: '', expiresAt: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!formData.expiresAt) return alert("Please select an expiry date");

    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Job Posted Successfully!");
      navigate('/jobs'); // FIXED: Redirect to 'Search Jobs' to see it immediately
    } catch (err) {
      alert("Error posting job: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="card" style={{maxWidth:'800px', margin:'20px auto'}}>
        <h2 style={{color:'#ff0055', textAlign:'center'}}>📢 Post a New Job</h2>
        
        <form onSubmit={handleSubmit} style={{display:'grid', gap:'15px', marginTop:'20px'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div>
                    <label>Job Title</label>
                    <input name="title" placeholder="e.g. Senior React Developer" onChange={handleChange} required />
                </div>
                <div>
                    <label>Company Name</label>
                    <input name="company" placeholder="e.g. TechCorp" onChange={handleChange} required />
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div>
                    <label>Location</label>
                    <input name="location" placeholder="e.g. Bangalore / Remote" onChange={handleChange} required />
                </div>
                <div>
                    <label>Salary Range</label>
                    <input name="salary" placeholder="e.g. 12 LPA" onChange={handleChange} required />
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                <div>
                    <label>Work Mode</label>
                    {/* FIXED: Values strictly match Backend Schema */}
                    <select name="workMode" onChange={handleChange} style={{width:'100%', padding:'10px'}}>
                        <option value="Onsite">Onsite</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div>
                    <label>Job Type</label>
                    <select name="jobType" onChange={handleChange} style={{width:'100%', padding:'10px'}}>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        {/* Removed 'Part-time' because it was causing 500 Error */}
                    </select>
                </div>
                <div>
                    <label>Expiry Date</label>
                    <input type="date" name="expiresAt" onChange={handleChange} required />
                </div>
            </div>

            <div>
                <label>Required Skills (Comma separated)</label>
                <input name="skills" placeholder="React, Node.js, MongoDB" onChange={handleChange} required />
            </div>

            <div>
                <label>Job Description</label>
                <textarea name="description" rows="5" placeholder="Describe the role responsibilities..." onChange={handleChange} required />
            </div>

            <button className="btn" style={{marginTop:'10px'}}>🚀 Publish Job</button>
            <button type="button" onClick={()=>navigate('/dashboard')} style={{background:'none', border:'none', color:'#666', cursor:'pointer', marginTop:'10px'}}>Cancel</button>
        </form>
    </div>
  );
};

export default CreateJob;