import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import RecruiterDashboard from './RecruiterDashboard';
import SeekerDashboard from './SeekerDashboard';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(UserContext);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    if (!token) return; // Stop if no token

    // Determine correct API URL based on Role
    // 'employer' gets their posted jobs. 'seeker' gets their applications.
    const url = user.role === 'employer' 
      ? 'http://localhost:5000/api/jobs/my-jobs' 
      : 'http://localhost:5000/api/applications/my-applications';
    
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data);
    } catch(err) { 
      console.error("Fetch Data Error:", err); 
    } finally {
      setLoading(false);
    }
  };

  // 1. If no user logged in, show error (Safety check)
  if(!user) return <div style={{textAlign:'center', marginTop:'50px', color:'white'}}>Please Login</div>;

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
            <h2>📊 {user.role === 'employer' ? 'Recruiter Dashboard' : 'Seeker Dashboard'}</h2>
            <p style={{color:'#666', margin:0}}>Welcome back, {user.name}</p>
        </div>
        <span style={{background:'#e2e8f0', padding:'8px 15px', borderRadius:'20px', fontWeight:'bold', fontSize:'0.9rem', color:'#333'}}>
            Role: {user.role === 'employer' ? 'Job Creator / HR 🏢' : 'Job Seeker 👨‍💻'}
        </span>
      </div>

      {/* Loading State */}
      {loading ? (
        <p style={{textAlign:'center', color:'white', fontSize:'1.2rem'}}>Loading your data...</p>
      ) : (
        <>
          {/* Conditionally Render Correct Dashboard */}
          {user.role === 'employer' ? (
              <RecruiterDashboard user={user} jobs={data} fetchData={fetchData} />
          ) : (
              <SeekerDashboard user={user} applications={data} fetchData={fetchData} />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;