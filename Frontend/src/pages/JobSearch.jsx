import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ keyword: '', location: '', type: '', workMode: '' });
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [appForm, setAppForm] = useState({ 
    name: user?.name || '', email: user?.email || '', mobile: '', location: '', experience: '', skills: '', resume: null 
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // FIXED: Remove empty filters so backend doesn't return 0 results
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
         if (filters[key]) cleanFilters[key] = filters[key];
      });

      const res = await axios.get('http://localhost:5000/api/jobs', { params: cleanFilters });
      setJobs(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [filters]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleAppChange = (e) => setAppForm({...appForm, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setAppForm({...appForm, resume: e.target.files[0] });

  const submitApplication = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if(!token) return alert("Please Login First");

      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      Object.keys(appForm).forEach(key => formData.append(key, appForm[key]));

      try {
          await axios.post('http://localhost:5000/api/applications/apply', formData, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          alert("Application Submitted! 🚀");
          setSelectedJob(null);
      } catch (err) {
          alert(err.response?.data?.msg || "Failed to apply");
      }
  };

  return (
    <div className="container" style={{display:'flex', gap:'20px', alignItems:'flex-start', flexWrap:'wrap'}}>
      <div style={{flex: 1, minWidth:'300px'}}>
        <div className="card" style={{marginBottom:'20px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input name="keyword" placeholder="Search Job Title..." onChange={handleFilter} style={{flex:1, minWidth:'150px'}} />
          <input name="location" placeholder="Location..." onChange={handleFilter} style={{flex:1, minWidth:'150px'}} />
          <select name="type" onChange={handleFilter} style={{flex:1}}>
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
          </select>
          <select name="workMode" onChange={handleFilter} style={{flex:1}}>
              <option value="">Any Mode</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option> {/* FIXED: No hyphen */}
              <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {loading ? <p style={{color:'white'}}>Loading jobs...</p> : (
          <div style={{display:'grid', gap:'15px'}}>
            {jobs.length === 0 && <p style={{color:'white'}}>No active jobs found.</p>}
            {jobs.map(job => (
               <div key={job._id} className="card" onClick={() => setSelectedJob(job)}
                    style={{cursor:'pointer', borderLeft: selectedJob?._id === job._id ? '5px solid #ff0055' : '5px solid transparent'}}>
                  <h3>{job.title}</h3>
                  <p style={{fontWeight:'bold', color:'#555'}}>{job.company}</p>
                  <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                      <span>📍 {job.location}</span><span>💰 {job.salary}</span>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div style={{flex: 1, minWidth:'300px', position:'sticky', top:'20px'}}>
          <div className="card">
            <button onClick={()=>setSelectedJob(null)} style={{float:'right', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
            <h2>{selectedJob.title}</h2>
            <p>{selectedJob.company}</p>
            <hr />
            <form onSubmit={submitApplication} style={{display:'grid', gap:'10px'}}>
               <input name="name" value={appForm.name} placeholder="Name" required onChange={handleAppChange} />
               <input name="email" value={appForm.email} placeholder="Email" required onChange={handleAppChange} />
               <input name="mobile" placeholder="Mobile" required onChange={handleAppChange} />
               <input name="skills" placeholder="Skills" required onChange={handleAppChange} />
               <input type="file" onChange={handleFileChange} required />
               <button className="btn">Submit Application 🚀</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;