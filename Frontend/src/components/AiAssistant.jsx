import React, { useState } from 'react';
import axios from 'axios';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const getAdvice = async () => {
    try {
      // Mock user skills for now
      const res = await axios.post('http://localhost:5000/api/ai/suggest', { userSkills: "React, Node.js" });
      setSuggestion(res.data.suggestions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{ borderRadius: '50%', width: '60px', height: '60px', fontSize: '30px', cursor: 'pointer', border: 'none', background: '#e94560', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          🤖
        </button>
      )}
      
      {isOpen && (
        <div className="card" style={{ width: '300px', border: '1px solid #ddd' }}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
             <h3>AI Assistant</h3>
             <button onClick={() => setIsOpen(false)} style={{background:'transparent', border:'none', cursor:'pointer'}}>✖️</button>
          </div>
          <p>Analyzing your profile...</p>
          <button className="btn" onClick={getAdvice} style={{width:'100%'}}>Get Career Advice</button>
          {suggestion && (
            <ul style={{marginTop: '10px', fontSize: '0.9em', paddingLeft: '20px'}}>
              {suggestion.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;