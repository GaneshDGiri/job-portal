import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SeekerDashboard = ({ applications, fetchData }) => {
  
  const handleWithdraw = async (appId) => {
      if(!window.confirm("⚠️ Withdraw application?")) return;
      const token = localStorage.getItem('token');
      try {
          await axios.delete(`http://localhost:5000/api/applications/${appId}`, { headers: { Authorization: `Bearer ${token}` } });
          alert("✅ Withdrawn");
          fetchData(); 
      } catch (err) { alert("Error"); }
  };

  const formatInterviewDate = (dateString) => {
      if (!dateString) return { date: "TBD", time: "TBD" };
      const dateObj = new Date(dateString);
      return {
          date: dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
  };

  const getStatusBadge = (app) => {
      switch(app.status) {
          case 'Hired': return { bg:'#d1fae5', col:'#065f46', border:'#059669', label:'🎉 Selected' };
          case 'Rejected': return { bg:'#fee2e2', col:'#991b1b', border:'#dc2626', label:'❌ Rejected' };
          case 'Interview': return { bg:'#dbeafe', col:'#1e40af', border:'#2563eb', label:'📞 Interview' };
          default: return { bg:'#f3f4f6', col:'#374151', border:'#6b7280', label:'⏳ Applied' };
      }
  };

  return (
    <div>
        <h2 style={{color:'white', marginBottom:'20px'}}>📂 My Applications</h2>
        {applications.length === 0 && <p style={{color:'white'}}>No applications.</p>}

        <div style={{display:'grid', gap:'20px'}}>
            {applications.map(app => {
                const style = getStatusBadge(app);
                const job = app.job || { title: "Job Removed", company: "Unknown", location: "N/A" };
                const { date, time } = formatInterviewDate(app.interviewDate);

                return (
                    <div key={app._id} className="card" style={{borderLeft: `6px solid ${style.border}`}}>
                        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'20px'}}>
                            <div style={{flex:2}}>
                                <h3 style={{margin:'0 0 5px 0'}}>{job.title}</h3>
                                <h4 style={{margin:'0 0 10px 0', color:'#555'}}>🏢 {job.company}</h4>
                                <div style={{fontSize:'0.9rem', color:'#666'}}>
                                    <span>📍 {job.location}</span> • <span>💰 {job.salary}</span>
                                </div>
                                
                                {/* --- NEW: APPLIED DATE --- */}
                                <div style={{marginTop:'5px', fontSize:'0.85rem', color:'#444', fontStyle:'italic'}}>
                                    📅 Applied on: {new Date(app.appliedAt).toLocaleDateString()} at {new Date(app.appliedAt).toLocaleTimeString()}
                                </div>

                                {/* STATUS / INTERVIEW BOX */}
                                {app.status === 'Interview' ? (
                                    <div style={{marginTop:'15px', background:'#eff6ff', border:'1px solid #bfdbfe', padding:'15px', borderRadius:'8px'}}>
                                        <h4 style={{margin:'0 0 10px 0', color:'#1e40af'}}>📅 Interview Scheduled</h4>
                                        <div style={{display:'grid', gap:'5px', color:'#1e3a8a'}}>
                                            <div><strong>Date:</strong> {date}</div>
                                            <div><strong>Time:</strong> {time}</div>
                                            <div><strong>Interviewer:</strong> {app.interviewerName || "Hiring Team"}</div>
                                        </div>
                                        {app.interviewLink && <a href={app.interviewLink} target="_blank" rel="noreferrer"><button className="btn" style={{marginTop:'10px', background:'#2563eb', width:'100%'}}>🎥 Join Meet</button></a>}
                                    </div>
                                ) : (
                                    <div style={{marginTop:'15px', padding:'10px', background: style.bg, color: style.col, borderRadius:'6px', border:`1px solid ${style.border}`}}>
                                        <strong>Status:</strong> {app.status}
                                    </div>
                                )}
                            </div>

                            <div style={{textAlign:'right'}}>
                                <div style={{background: style.col, color: 'white', padding:'6px 15px', borderRadius:'20px', fontWeight:'bold', fontSize:'0.85rem', display:'inline-block'}}>{style.label}</div>
                                {app.status === 'Applied' && <button onClick={() => handleWithdraw(app._id)} style={{marginTop:'15px', background:'white', color:'#dc2626', border:'1px solid #dc2626', padding:'8px 15px', borderRadius:'5px', cursor:'pointer', display:'block', marginLeft:'auto'}}>🚫 Withdraw</button>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
export default SeekerDashboard;