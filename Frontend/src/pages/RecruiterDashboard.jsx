import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecruiterDashboard = ({ jobs, fetchData }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', interviewer: '', link: '' });

  // 1. DELETE JOB FUNCTION
  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation(); // Prevent clicking the card behind the button
    
    if(!window.confirm("⚠️ Are you sure you want to delete this job? This cannot be undone.")) return;

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Job Deleted Successfully!");
        
        // Refresh the list
        if (fetchData) fetchData(); 
        
        // If the deleted job was selected, deselect it
        if (selectedJobId === jobId) {
            setSelectedJobId(null);
            setApplicants([]);
        }
    } catch (err) {
        alert("❌ Failed to delete job: " + (err.response?.data?.msg || err.message));
    }
  };

  // FETCH APPLICANTS
  const viewApplicants = async (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setLoadingApps(true);
    setApplicants([]);
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        setApplicants(res.data);
    } catch (err) { alert("Error fetching applicants"); } 
    finally { setLoadingApps(false); }
  };

  // OPEN SCHEDULE MODAL
  const openScheduleModal = (app) => {
      setCurrentAppId(app._id);
      setScheduleData({
          date: app.interviewDate ? app.interviewDate.split('T')[0] : '',
          time: app.interviewDate ? new Date(app.interviewDate).toTimeString().slice(0,5) : '',
          interviewer: app.interviewerName || '',
          link: app.interviewLink || ''
      });
      setShowModal(true);
  };

  // GENERATE LINK
  const generateLink = () => {
      const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6);
      setScheduleData({ ...scheduleData, link: `https://meet.google.com/${code}` });
  };

  // SUBMIT SCHEDULE (SAVE/SEND)
  const submitSchedule = async (type) => {
      const token = localStorage.getItem('token');
      const dateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);
      const payload = {
          type: type, 
          interviewDate: dateTime,
          interviewLink: scheduleData.link,
          interviewerName: scheduleData.interviewer,
          status: type === 'send' ? 'Interview' : undefined
      };

      try {
          const res = await axios.put(`http://localhost:5000/api/applications/${currentAppId}/status`, payload, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setApplicants(applicants.map(app => app._id === currentAppId ? { ...app, ...res.data.application } : app));
          alert(type === 'send' ? "✅ Sent to Applicant!" : "💾 Saved as Draft.");
          setShowModal(false);
      } catch (err) { alert("Action Failed"); }
  };

  // UPDATE STATUS
  const updateStatus = async (appId, newStatus) => {
      const token = localStorage.getItem('token');
      try {
          await axios.put(`http://localhost:5000/api/applications/${appId}/status`, 
            { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } }
          );
          setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      } catch (err) { alert("Failed"); }
  };

  // DELETE APPLICATION
  const deleteApplication = async (appId) => {
      if(!window.confirm("Permanently delete this application?")) return;
      const token = localStorage.getItem('token');
      try {
          await axios.delete(`http://localhost:5000/api/applications/${appId}`, { headers: { Authorization: `Bearer ${token}` } });
          setApplicants(applicants.filter(app => app._id !== appId));
      } catch (err) { alert("Delete failed"); }
  };

  return (
    <div style={{display:'flex', gap:'20px', flexWrap:'wrap', alignItems:'flex-start'}}>
      {/* LEFT: JOBS LIST */}
      <div style={{flex:1, minWidth:'300px'}}>
         <h3 style={{color:'white'}}>📋 Jobs</h3>
         <Link to="/create-job"><button className="btn" style={{marginBottom:'15px'}}>+ New Job</button></Link>
         
         <div style={{display:'grid', gap:'10px'}}>
             {jobs.map(job => (
                 <div key={job._id} className="card" onClick={()=>viewApplicants(job._id, job.title)} 
                      style={{
                          cursor:'pointer', 
                          borderLeft: selectedJobId===job._id ? '5px solid #ff0055' : '5px solid transparent',
                          position: 'relative' // Needed for absolute positioning of delete button
                      }}>
                     
                     {/* DELETE JOB BUTTON */}
                     <button 
                        onClick={(e) => handleDeleteJob(job._id, e)}
                        title="Delete Job"
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: '#fee2e2', color: '#b91c1c', border: '1px solid #b91c1c',
                            borderRadius: '50%', width: '24px', height: '24px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontWeight: 'bold'
                        }}
                     >
                        ×
                     </button>

                     <h4 style={{marginRight: '25px'}}>{job.title}</h4>
                     <small style={{color:'#666'}}>{job.location} | {new Date(job.expiresAt).toLocaleDateString()}</small>
                 </div>
             ))}
             {jobs.length === 0 && <p style={{color:'#ccc'}}>No jobs posted yet.</p>}
         </div>
      </div>

      {/* RIGHT: APPLICANTS VIEW */}
      <div style={{flex:2, minWidth:'400px'}}>
         {selectedJobId ? (
             <div className="card" style={{borderTop:'4px solid #ff0055', minHeight:'500px'}}>
                 <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h3>Applicants for: {selectedJobTitle}</h3>
                    <button onClick={()=>setSelectedJobId(null)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
                 </div>
                 
                 {loadingApps && <p>Loading...</p>}
                 {applicants.length === 0 && !loadingApps && <p>No applicants yet.</p>}
                 
                 {applicants.map(app => (
                     <div key={app._id} style={{border:'1px solid #eee', borderRadius:'8px', padding:'15px', marginBottom:'15px'}}>
                         <div style={{display:'flex', justifyContent:'space-between'}}>
                            <div>
                                <h4>{app.name}</h4>
                                <p style={{margin:'2px 0', fontSize:'0.85rem', color:'#555'}}>{app.email} | {app.mobile}</p>
                                <p style={{fontSize:'0.8rem', color:'#888', marginTop:'5px'}}>
                                    📅 Applied: {new Date(app.appliedAt).toLocaleString()}
                                </p>
                            </div>
                            {app.resume && <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noreferrer" style={{color:'blue', fontSize:'0.9rem'}}>📄 View Resume</a>}
                         </div>

                         {/* APPLICANT ACTIONS */}
                         <div style={{marginTop:'10px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
                             <button onClick={()=>openScheduleModal(app)} style={{background:'#dbeafe', color:'#1e40af', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>📅 Schedule Interview</button>
                             <button onClick={()=>updateStatus(app._id, 'Hired')} style={{background:'#dcfce7', color:'#15803d', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>✅ Select</button>
                             <button onClick={()=>updateStatus(app._id, 'Rejected')} style={{background:'#fee2e2', color:'#b91c1c', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>❌ Reject</button>
                             <button onClick={()=>deleteApplication(app._id)} style={{background:'#333', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>🗑 Delete App</button>
                         </div>
                         <div style={{marginTop:'5px', fontSize:'0.85rem'}}>Status: <strong>{app.status}</strong></div>
                     </div>
                 ))}
             </div>
         ) : <h3 style={{color:'white', textAlign:'center', marginTop:'100px'}}>Select a job to view applicants</h3>}
      </div>

      {/* SCHEDULE MODAL */}
      {showModal && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
              <div style={{background:'white', padding:'30px', borderRadius:'10px', width:'400px'}}>
                  <h3>📅 Schedule Interview</h3>
                  <label>Date:</label><input type="date" value={scheduleData.date} onChange={e=>setScheduleData({...scheduleData, date:e.target.value})} style={{width:'100%'}} />
                  <label>Time:</label><input type="time" value={scheduleData.time} onChange={e=>setScheduleData({...scheduleData, time:e.target.value})} style={{width:'100%'}} />
                  <label>Interviewer:</label><input value={scheduleData.interviewer} onChange={e=>setScheduleData({...scheduleData, interviewer:e.target.value})} style={{width:'100%'}} />
                  <label>Link:</label>
                  <div style={{display:'flex'}}><input value={scheduleData.link} onChange={e=>setScheduleData({...scheduleData, link:e.target.value})} style={{flex:1}} /><button onClick={generateLink}>Gen</button></div>
                  <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                      <button onClick={()=>submitSchedule('save')} style={{flex:1}}>💾 Save Draft</button>
                      <button onClick={()=>submitSchedule('send')} style={{flex:1, background:'blue', color:'white'}}>🚀 Send</button>
                  </div>
                  <button onClick={()=>setShowModal(false)} style={{marginTop:'10px', width:'100%', background:'none', color:'red', border:'none'}}>Cancel</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;