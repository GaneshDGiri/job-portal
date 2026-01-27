import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ keyword: '', location: '', type: '', workMode: '' });
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // App Form State
  const [appForm, setAppForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    mobile: '', 
    experience: '', 
    skills: '', 
    resume: null 
  });

  // Fetch Jobs (FIXED: Cleans empty filters)
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // 1. Remove keys with empty values so backend doesn't filter by ""
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) cleanFilters[key] = filters[key];
        });

        const res = await axios.get('http://localhost:5000/api/jobs', { params: cleanFilters });
        setJobs(res.data);
      } catch (err) { 
        console.error("Error fetching jobs:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchJobs();
  }, [filters]); // Re-run whenever filters change

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  // Handle Application
  const submitApplication = async (e) => {
      e.preventDefault();
      if (!user) return navigate('/login');
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('name', appForm.name);
      formData.append('email', appForm.email);
      formData.append('mobile', appForm.mobile);
      formData.append('location', user.location || ''); 
      formData.append('experience', appForm.experience);
      formData.append('skills', appForm.skills);
      if (appForm.resume) formData.append('resume', appForm.resume);

      try {
          await axios.post('http://localhost:5000/api/applications/apply', formData, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          alert("✅ Application Submitted!");
          setSelectedJob(null);
          setAppForm({ ...appForm, mobile: '', experience: '', skills: '', resume: null }); 
      } catch (err) {
          alert(err.response?.data?.msg || "Failed to apply");
      }
  };

  return (
    <div className="container">
      <div style={{marginBottom:'30px', textAlign:'center'}}>
        <h2 style={{fontSize:'2rem'}}>🔍 Explore Opportunities</h2>
        <p style={{color:'#666'}}>Find the perfect role for your skills.</p>
      </div>

      {/* FILTERS */}
      <div className="card filter-container">
        <input name="keyword" placeholder="🔍 Job Title or Keyword" onChange={handleFilter} />
        <input name="location" placeholder="📍 Location" onChange={handleFilter} />
        <select name="type" onChange={handleFilter}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
        </select>
        <select name="workMode" onChange={handleFilter}>
            <option value="">Any Mode</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* JOBS GRID */}
      {loading ? <p style={{textAlign:'center', color:'white'}}>Loading...</p> : (
        <div className="job-grid">
            {jobs.map(job => (
                <div key={job._id} className="job-card card" style={{cursor:'pointer'}} onClick={() => setSelectedJob(job)}>
                    <div>
                        <h3>{job.title}</h3>
                        <p style={{color:'#ff0055', fontWeight:'bold'}}>{job.company}</p>
                        <div style={{margin:'10px 0', display:'flex', gap:'5px', flexWrap:'wrap'}}>
                            <span className="job-tag">📍 {job.location}</span>
                            <span className="job-tag">💰 {job.salary}</span>
                            <span className="job-tag">🏠 {job.workMode}</span>
                        </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
                         <small style={{color:'#888'}}>⏳ Exp: {new Date(job.expiresAt).toLocaleDateString()}</small>
                         <button className="btn" style={{padding:'5px 10px', fontSize:'0.8rem', width:'auto', background:'transparent', border:'1px solid #ff0055', color:'#ff0055'}}>
                            View
                        </button>
                    </div>
                </div>
            ))}
            {jobs.length === 0 && <p style={{gridColumn:'1/-1', textAlign:'center', color:'white'}}>No jobs found. Try clearing filters.</p>}
        </div>
      )}

      {/* JOB MODAL */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedJob(null)}>×</button>
                
                <div className="modal-header">
                    <h2>{selectedJob.title}</h2>
                    <p className="modal-meta">{selectedJob.company} • {selectedJob.location} ({selectedJob.workMode})</p>
                </div>

                <div style={{marginBottom:'20px'}}>
                    <h4>Job Description</h4>
                    <p style={{whiteSpace:'pre-line', color:'#444'}}>{selectedJob.description}</p>
                </div>
                
                <div style={{marginBottom:'20px'}}>
                    <h4>Skills Required</h4>
                    <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginTop:'5px'}}>
                        {selectedJob.skillsRequired?.map((skill, i) => (
                            <span key={i} className="job-tag">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Apply Form */}
                {user?.role === 'employer' ? (
                     <div style={{background:'#fff3cd', padding:'15px', borderRadius:'8px', color:'#856404', textAlign:'center'}}>
                        Recruiters cannot apply.
                    </div>
                ) : (
                    <div style={{background:'#f8f9fa', padding:'20px', borderRadius:'8px'}}>
                        <h3 style={{marginBottom:'15px'}}>📝 Apply Now</h3>
                        <form onSubmit={submitApplication}>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                                <input value={appForm.name} onChange={e=>setAppForm({...appForm, name:e.target.value})} placeholder="Name" required />
                                <input value={appForm.email} onChange={e=>setAppForm({...appForm, email:e.target.value})} placeholder="Email" required />
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                                <input value={appForm.mobile} onChange={e=>setAppForm({...appForm, mobile:e.target.value})} placeholder="Mobile" required />
                                <input value={appForm.experience} onChange={e=>setAppForm({...appForm, experience:e.target.value})} placeholder="Experience" required />
                            </div>
                            <input value={appForm.skills} onChange={e=>setAppForm({...appForm, skills:e.target.value})} placeholder="Your Skills" required />
                            <input type="file" onChange={e=>setAppForm({...appForm, resume:e.target.files[0]})} required style={{background:'white'}} />
                            <button className="btn" style={{marginTop:'10px'}}>Submit Application 🚀</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default SearchJob;