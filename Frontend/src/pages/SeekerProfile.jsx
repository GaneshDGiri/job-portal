import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const SeekerProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ats1');

  // --- STATE ---
  const [basicInfo, setBasicInfo] = useState({
    name: user.name || '',
    mobile: user.mobile || '',
    location: user.location || '',
    bio: user.bio || '',
    skillLanguages: user.skills?.languages?.join(', ') || '',
    skillTools: user.skills?.tools?.join(', ') || '',
    skillDatabases: user.skills?.databases?.join(', ') || ''
  });

  const [educationList, setEducationList] = useState(user.education || []);
  const [workList, setWorkList] = useState(user.workExperience || []);
  const [projectList, setProjectList] = useState(user.projects || []);
  const [certList, setCertList] = useState(user.certifications || []);
  const [customList, setCustomList] = useState(user.customDetails || []);
  const [addDetails, setAddDetails] = useState(user.additionalDetails || { hometown: '', dob: '', gender: '' });

  const [files, setFiles] = useState({ profilePic: null, resume: null });

  // --- HANDLERS ---
  const addEducation = () => setEducationList([...educationList, { degree: '', institute: '', year: '' }]);
  const removeEducation = (i) => setEducationList(educationList.filter((_, idx) => idx !== i));
  const updateEducation = (i, field, val) => { const newArr = [...educationList]; newArr[i][field] = val; setEducationList(newArr); };

  const addWork = () => setWorkList([...workList, { role: '', company: '', duration: '', description: '' }]);
  const removeWork = (i) => setWorkList(workList.filter((_, idx) => idx !== i));
  const updateWork = (i, field, val) => { const newArr = [...workList]; newArr[i][field] = val; setWorkList(newArr); };

  const addProject = () => setProjectList([...projectList, { title: '', description: '', link: '' }]);
  const removeProject = (i) => setProjectList(projectList.filter((_, idx) => idx !== i));
  const updateProject = (i, field, val) => { const newArr = [...projectList]; newArr[i][field] = val; setProjectList(newArr); };

  const addCert = () => setCertList([...certList, { name: '', issuer: '', credentialId: '' }]);
  const removeCert = (i) => setCertList(certList.filter((_, idx) => idx !== i));
  const updateCert = (i, field, val) => { const newArr = [...certList]; newArr[i][field] = val; setCertList(newArr); };

  const addCustom = () => setCustomList([...customList, { title: '', value: '' }]);
  const removeCustom = (i) => setCustomList(customList.filter((_, idx) => idx !== i));
  const updateCustom = (i, field, val) => { const newArr = [...customList]; newArr[i][field] = val; setCustomList(newArr); };

  // --- SAVE UPDATE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(basicInfo).forEach(key => data.append(key, basicInfo[key]));

    data.append('education', JSON.stringify(educationList));
    data.append('workExperience', JSON.stringify(workList));
    data.append('projects', JSON.stringify(projectList));
    data.append('certifications', JSON.stringify(certList));
    data.append('customDetails', JSON.stringify(customList));
    data.append('additionalDetails', JSON.stringify(addDetails));

    if (files.profilePic) data.append('profilePic', files.profilePic);
    if (files.resume) data.append('resume', files.resume);

    try {
      const res = await axios.put('http://localhost:5000/api/users/me', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("✅ Profile Updated Successfully!");
      setIsEditing(false);
      updateUser(res.data);
    } catch (err) { alert("Update Failed"); }
  };

  // =====================================================================
  //  TEMPLATE COMPONENTS
  // =====================================================================
  const SectionHeader = ({ title, style }) => (
    <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '10px', textTransform: 'uppercase', fontSize: '1rem', fontWeight: 'bold', ...style }}>{title}</h3>
  );

  const ProjectLink = ({ link }) => (
    link ? <a href={link} target="_blank" rel="noreferrer" style={{ color: 'blue', fontSize: '0.9rem', textDecoration: 'underline', marginLeft: '5px' }}>Link</a> : null
  );

  // --- ATS 1: STANDARD TIMES ---
  const Ats1 = () => (
    <div style={{ fontFamily: '"Times New Roman", serif', lineHeight: '1.4', color: '#000' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, textTransform: 'uppercase' }}>{basicInfo.name}</h1>
        <p>{basicInfo.location} | {basicInfo.mobile} | {user.email}</p>
      </div>

      {basicInfo.bio && <div style={{ marginBottom: '15px' }}><SectionHeader title="Summary" /><p>{basicInfo.bio}</p></div>}

      <div style={{ marginBottom: '15px' }}>
        <SectionHeader title="Skills" />
        <div><strong>Languages:</strong> {basicInfo.skillLanguages}</div>
        <div><strong>Tools:</strong> {basicInfo.skillTools}</div>
        <div><strong>Databases:</strong> {basicInfo.skillDatabases}</div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SectionHeader title="Experience" />
        {workList.map((w, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{w.company}</strong><span>{w.duration}</span></div>
            <div style={{ fontStyle: 'italic' }}>{w.role}</div>
            <div>{w.description}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SectionHeader title="Education" />
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree}</strong>
              <span>{e.year}</span>
            </div>
            <div>{e.institute}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SectionHeader title="Projects" />
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- ATS 2: CLEAN ARIAL ---
  const Ats2 = () => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.5' }}>
      <div style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
        <h1 style={{ margin: 0 }}>{basicInfo.name}</h1>
        <p>{user.email} • {basicInfo.mobile} • {basicInfo.location}</p>
      </div>

      {basicInfo.bio && <div style={{ marginBottom: '15px' }}><strong>SUMMARY:</strong> {basicInfo.bio}</div>}

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ background: '#eee', padding: '5px' }}>SKILLS</h4>
        <div><strong>Languages:</strong> {basicInfo.skillLanguages}</div>
        <div><strong>Tools:</strong> {basicInfo.skillTools}</div>
        <div><strong>Databases:</strong> {basicInfo.skillDatabases}</div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ background: '#eee', padding: '5px' }}>EXPERIENCE</h4>
        {workList.map((w, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{w.role}</strong> at <strong>{w.company}</strong> ({w.duration})
            <p style={{ margin: '2px 0' }}>{w.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ background: '#eee', padding: '5px' }}>EDUCATION</h4>
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree}</strong>
              <span>{e.year}</span>
            </div>
            <div>{e.institute}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ background: '#eee', padding: '5px' }}>PROJECTS</h4>
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- ATS 3: COMPACT CALIBRI ---
  const Ats3 = () => (
    <div style={{ fontFamily: 'Calibri, sans-serif', color: 'black', lineHeight: '1.3' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>{basicInfo.name}</h2>
        <p>{basicInfo.location} • {basicInfo.mobile} • {user.email}</p>
      </div>
      <hr />

      {basicInfo.bio && <p><strong>Summary:</strong> {basicInfo.bio}</p>}

      <h3 style={{ fontSize: '1rem', textDecoration: 'underline', marginTop: '10px' }}>SKILLS</h3>
      <div>• <strong>Languages:</strong> {basicInfo.skillLanguages}</div>
      <div>• <strong>Tools:</strong> {basicInfo.skillTools}</div>
      <div>• <strong>Databases:</strong> {basicInfo.skillDatabases}</div>

      <h3 style={{ fontSize: '1rem', textDecoration: 'underline', marginTop: '10px' }}>EXPERIENCE</h3>
      {workList.map((w, i) => (
        <div key={i} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{w.company}</strong><span>{w.duration}</span></div>
          <div><em>{w.role}</em></div>
          <div>{w.description}</div>
        </div>
      ))}

      <h3 style={{ fontSize: '1rem', textDecoration: 'underline', marginTop: '10px' }}>EDUCATION</h3>
      {educationList.map((e, i) => (
        <div key={i} style={{ marginBottom: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{e.degree}</strong> <span>{e.year}</span>
          </div>
          <div>{e.institute}</div>
        </div>
      ))}

      <h3 style={{ fontSize: '1rem', textDecoration: 'underline', marginTop: '10px' }}>PROJECTS</h3>
      {projectList.map((p, i) => (
        <div key={i} style={{ marginBottom: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{p.title}</strong>
            <ProjectLink link={p.link} />
          </div>
          <div>{p.description}</div>
        </div>
      ))}
    </div>
  );

  // --- ATS 4: CORPORATE ---
  const Ats4 = () => (
    <div style={{ fontFamily: 'Georgia, serif', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>{basicInfo.name}</h1>
        <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>{user.email}<br />{basicInfo.mobile}<br />{basicInfo.location}</div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #ddd' }}>Summary</h3>
        <p>{basicInfo.bio}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #ddd' }}>Skills</h3>
        <p><strong>Languages:</strong> {basicInfo.skillLanguages}</p>
        <p><strong>Tools:</strong> {basicInfo.skillTools}</p>
        <p><strong>Databases:</strong> {basicInfo.skillDatabases}</p>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h3 style={{ borderBottom: '1px solid #ddd' }}>Experience</h3>
        {workList.map((w, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{w.company}</strong> | {w.role} | {w.duration}
            <p>{w.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px' }}>
        <h3 style={{ borderBottom: '1px solid #ddd' }}>Education</h3>
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree}</strong>
              <span>{e.year}</span>
            </div>
            <div>{e.institute}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px' }}>
        <h3 style={{ borderBottom: '1px solid #ddd' }}>Projects</h3>
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- ATS 5: MINIMALIST ---
  const Ats5 = () => (
    <div style={{ fontFamily: 'Verdana, sans-serif', fontSize: '0.9rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{basicInfo.name}</h1>
      <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '20px' }}>{user.email} | {basicInfo.mobile}</p>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>SUMMARY</strong>
        <p>{basicInfo.bio}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>SKILLS</strong>
        <div>Language: {basicInfo.skillLanguages}</div>
        <div>Tools: {basicInfo.skillTools}</div>
        <div>Databases: {basicInfo.skillDatabases}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>EXPERIENCE</strong>
        {workList.map((w, i) => (<div key={i} style={{ marginBottom: '10px' }}><strong>{w.company}</strong> ({w.duration})<br />{w.description}</div>))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>EDUCATION</strong>
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{e.degree}</span>
              <span>{e.year}</span>
            </div>
            <div style={{ fontStyle: 'italic' }}>{e.institute}</div>
          </div>
        ))}
      </div>
      <div>
        <strong style={{ display: 'block', marginBottom: '5px' }}>PROJECTS</strong>
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MOD1: BLUE COLUMN ---
  const Mod1 = () => (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100%' }}>
      <div style={{ width: '30%', background: '#3b82f6', color: 'white', padding: '20px' }}>
        <h2>{basicInfo.name}</h2>
        <p>{user.email}</p>
        <p>{basicInfo.mobile}</p>
        <hr style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '20px 0' }} />

        <h4>SKILLS</h4>
        <p><strong>Langs:</strong><br />{basicInfo.skillLanguages}</p>
        <p><strong>Tools:</strong><br />{basicInfo.skillTools}</p>
        <p><strong>DBs:</strong><br />{basicInfo.skillDatabases}</p>

        <h4 style={{ marginTop: '20px' }}>EDUCATION</h4>
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold' }}>{e.degree}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{e.institute}</span>
              <span>{e.year}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: '70%', padding: '20px' }}>
        <h3 style={{ color: '#3b82f6', borderBottom: '2px solid #3b82f6' }}>PROFILE</h3>
        <p>{basicInfo.bio}</p>

        <h3 style={{ color: '#3b82f6', borderBottom: '2px solid #3b82f6', marginTop: '20px' }}>EXPERIENCE</h3>
        {workList.map((w, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '1.1rem' }}>{w.role}</strong>
            <div style={{ color: '#666' }}>{w.company} | {w.duration}</div>
            <p>{w.description}</p>
          </div>
        ))}

        <h3 style={{ color: '#3b82f6', borderBottom: '2px solid #3b82f6', marginTop: '20px' }}>PROJECTS</h3>
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MOD2: DARK HEADER ---
  const Mod2 = () => (
    <div style={{ fontFamily: 'Helvetica, sans-serif' }}>
      <div style={{ background: '#2d3748', color: 'white', padding: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, letterSpacing: '2px' }}>{basicInfo.name}</h1>
        <p style={{ color: '#cbd5e1' }}>{basicInfo.location}</p>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <strong>SUMMARY:</strong> {basicInfo.bio}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2d3748' }}>EDUCATION</h3>
            {educationList.map((e, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{e.degree}</span>
                  <span>{e.year}</span>
                </div>
                <div>{e.institute}</div>
              </div>
            ))}

            <h3 style={{ color: '#2d3748' }}>EXPERIENCE</h3>
            {workList.map((w, i) => (<div key={i}><strong>{w.company}</strong><br />{w.role}<br /><small>{w.duration}</small></div>))}
          </div>
          <div>
            <h3 style={{ color: '#2d3748' }}>SKILLS</h3>
            <div style={{ marginBottom: '5px' }}><strong>Langs:</strong> {basicInfo.skillLanguages}</div>
            <div style={{ marginBottom: '5px' }}><strong>Tools:</strong> {basicInfo.skillTools}</div>
            <div><strong>Databases:</strong> {basicInfo.skillDatabases}</div>
          </div>
        </div>
        <h3 style={{ color: '#2d3748', marginTop: '20px' }}>PROJECTS</h3>
        {projectList.map((p, i) => (
          <div key={i} style={{ background: '#f8fafc', padding: '10px', marginBottom: '10px', borderLeft: '4px solid #2d3748' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MOD3: ELEGANT RED ---
  const Mod3 = () => (
    <div style={{ fontFamily: 'Garamond, serif' }}>
      <h1 style={{ color: '#991b1b', borderBottom: '2px solid #991b1b' }}>{basicInfo.name}</h1>
      <p style={{ textAlign: 'right', fontStyle: 'italic' }}>{user.email} | {basicInfo.mobile}</p>

      <h3 style={{ background: '#fee2e2', padding: '5px' }}>Summary</h3>
      <p>{basicInfo.bio}</p>

      <h3 style={{ background: '#fee2e2', padding: '5px' }}>Skills</h3>
      <p><strong>Languages:</strong> {basicInfo.skillLanguages}</p>
      <p><strong>Tools:</strong> {basicInfo.skillTools}</p>
      <p><strong>Databases:</strong> {basicInfo.skillDatabases}</p>

      <h3 style={{ background: '#fee2e2', padding: '5px' }}>Experience</h3>
      {workList.map((w, i) => (<div key={i} style={{ marginBottom: '10px' }}><strong>{w.company}</strong> - {w.role}<p>{w.description}</p></div>))}

      <h3 style={{ background: '#fee2e2', padding: '5px' }}>Education</h3>
      {educationList.map((e, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            {e.degree} <span>{e.year}</span>
          </div>
          <div>{e.institute}</div>
        </div>
      ))}

      <h3 style={{ background: '#fee2e2', padding: '5px' }}>Projects</h3>
      {projectList.map((p, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            {p.title} <ProjectLink link={p.link} />
          </div>
          <div>{p.description}</div>
        </div>
      ))}
    </div>
  );

  // --- MOD4: GREEN BORDER ---
  const Mod4 = () => (
    <div style={{ fontFamily: 'Trebuchet MS, sans-serif', borderLeft: '10px solid #059669', paddingLeft: '20px' }}>
      <h1 style={{ color: '#059669', textTransform: 'uppercase' }}>{basicInfo.name}</h1>
      <p style={{ color: '#666' }}>{basicInfo.location}</p>
      <p><strong>Summary:</strong> {basicInfo.bio}</p>

      <div style={{ marginTop: '20px' }}>
        <strong style={{ color: '#059669' }}>SKILLS</strong>
        <p><strong>Languages:</strong> {basicInfo.skillLanguages}</p>
        <p><strong>Tools:</strong> {basicInfo.skillTools}</p>
        <p><strong>Databases:</strong> {basicInfo.skillDatabases}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <strong style={{ color: '#059669' }}>EXPERIENCE</strong>
        {workList.map((w, i) => (<div key={i} style={{ marginBottom: '10px' }}><strong>{w.company}</strong> ({w.duration})<br />{w.description}</div>))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <strong style={{ color: '#059669' }}>EDUCATION</strong>
        {educationList.map((e, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              {e.degree} <span>{e.year}</span>
            </div>
            <div>{e.institute}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong style={{ color: '#059669' }}>PROJECTS</strong>
        {projectList.map((p, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              {p.title} <ProjectLink link={p.link} />
            </div>
            <div>{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MOD5: DARK MODE ---
  const Mod5 = () => (
    <div style={{ fontFamily: 'Futura, sans-serif', color: '#333' }}>
      <div style={{ background: '#111', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>{basicInfo.name}</h1>
        <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>{user.email}<br />{basicInfo.mobile}</div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}><strong>SUMMARY:</strong> {basicInfo.bio}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div>
            <h3>EXPERIENCE</h3>
            {workList.map((w, i) => (<div key={i} style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{w.company}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>{w.role} | {w.duration}</div>
              <p>{w.description}</p>
            </div>))}

            <h3>PROJECTS</h3>
            {projectList.map((p, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
                  {p.title} <ProjectLink link={p.link} />
                </div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>{p.description}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f3f4f6', padding: '15px' }}>
            <h3>SKILLS</h3>
            <p><strong>Langs:</strong><br />{basicInfo.skillLanguages}</p>
            <p><strong>Tools:</strong><br />{basicInfo.skillTools}</p>
            <p><strong>DBs:</strong><br />{basicInfo.skillDatabases}</p>

            <h3 style={{ marginTop: '20px' }}>EDUCATION</h3>
            {educationList.map((e, i) => (
              <div key={i} style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  {e.degree} <span>{e.year}</span>
                </div>
                <div>{e.institute}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDERER ---
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'ats1': return <Ats1 />;
      case 'ats2': return <Ats2 />;
      case 'ats3': return <Ats3 />;
      case 'ats4': return <Ats4 />;
      case 'ats5': return <Ats5 />;
      case 'mod1': return <Mod1 />;
      case 'mod2': return <Mod2 />;
      case 'mod3': return <Mod3 />;
      case 'mod4': return <Mod4 />;
      case 'mod5': return <Mod5 />;
      default: return <Ats1 />;
    }
  };

  // --- PRINT STYLES ---
  const printStyles = `
    @media print {
      @page { margin: 0; size: auto; }
      body { margin: 0; padding: 0; }
      body * { visibility: hidden; }
      #resume-print-area, #resume-print-area * { visibility: visible; }
      #resume-print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        background: white;
      }
      /* Hide buttons in the modal if they get caught */
      button { display: none !important; }
    }
  `;

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

      {/* 1. INJECT THE CSS STYLES HERE */}
      <style>{printStyles}</style>

      {/* PREVIEW MODAL */}
      {showResume && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div style={{ background: 'white', maxWidth: '850px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '15px', background: '#f1f5f9', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <strong>Template:</strong>
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} style={{ padding: '5px' }}>
                <optgroup label="ATS Friendly">
                  <option value="ats1">ATS Standard</option>
                  <option value="ats2">ATS Clean</option>
                  <option value="ats3">ATS Compact</option>
                  <option value="ats4">ATS Corporate</option>
                  <option value="ats5">ATS Minimalist</option>
                </optgroup>
                <optgroup label="Modern">
                  <option value="mod1">Modern Blue</option>
                  <option value="mod2">Modern Dark Header</option>
                  <option value="mod3">Modern Red</option>
                  <option value="mod4">Modern Green</option>
                  <option value="mod5">Modern Dark Mode</option>
                </optgroup>
              </select>
              <div style={{ flex: 1 }}></div>
              <button onClick={() => window.print()} style={{ background: 'black', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer' }}>🖨️ Print</button>
              <button onClick={() => setShowResume(false)} style={{ background: 'red', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>

            {/* 2. ADD THE ID HERE: "resume-print-area" */}
            <div id="resume-print-area" style={{ padding: '40px', minHeight: '1100px' }}>
              {renderTemplate()}
            </div>

          </div>
        </div>
      )}

      {/* LEFT INFO CARD */}
      <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: '300px', height: 'fit-content' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 15px', overflow: 'hidden', border: '4px solid white' }}>
          {user.profilePic ? <img src={`http://localhost:5000/${user.profilePic.replace(/\\/g, '/')}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" /> : <span style={{ fontSize: '3rem', lineHeight: '120px' }}>👤</span>}
        </div>
        <h2>{basicInfo.name}</h2>
        <button onClick={() => setShowResume(true)} className="btn" style={{ marginTop: '15px', width: '100%', background: '#2563eb' }}>📄 View Resume (10 Templates)</button>

        <div style={{ marginTop: '25px', background: '#fffbeb', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
          <h4>Additional Details</h4>
          

          {customList.map((item, i) => (
            <p key={i}><strong>{item.title}:</strong> {item.value}</p>
          ))}
          <hr style={{ margin: '10px 0', borderColor: '#ddd' }} />
          <h5 style={{ margin: '0 0 5px 0' }}>📜 Certifications</h5>
          {certList.length > 0 ? certList.map((cert, i) => (
            <div key={i} style={{ fontSize: '0.9rem', marginBottom: '5px' }}>• {cert.name}</div>
          )) : <small>No certifications added</small>}
        </div>
      </div>

      {/* RIGHT EDIT FORM */}
      <div className="card" style={{ flex: 2, minWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>📝 Edit Profile</h3><button onClick={() => setIsEditing(!isEditing)} style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}>{isEditing ? "Stop Editing" : "Edit"}</button></div>

        <form onSubmit={handleUpdate}>
          <fieldset disabled={!isEditing} style={{ border: 'none', padding: 0, display: 'grid', gap: '20px' }}>

            {/* BASIC INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input value={basicInfo.name} onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })} placeholder="Name" />
              <input value={basicInfo.mobile} onChange={e => setBasicInfo({ ...basicInfo, mobile: e.target.value })} placeholder="Mobile" />
            </div>
            <input value={basicInfo.location} onChange={e => setBasicInfo({ ...basicInfo, location: e.target.value })} placeholder="Location" />
            <textarea value={basicInfo.bio} onChange={e => setBasicInfo({ ...basicInfo, bio: e.target.value })} placeholder="Professional Summary" rows="3" />

            {/* WORK EXPERIENCE */}
            <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px' }}>
              <h4>💼 Work Experience</h4>
              {workList.map((w, i) => (
                <div key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <input placeholder="Role / Job Title" value={w.role} onChange={e => updateWork(i, 'role', e.target.value)} style={{ flex: 1, fontWeight: 'bold' }} />
                    <input placeholder="Company Name" value={w.company} onChange={e => updateWork(i, 'company', e.target.value)} style={{ flex: 1 }} />
                  </div>
                  <input placeholder="Duration (e.g. 2020 - Present)" value={w.duration} onChange={e => updateWork(i, 'duration', e.target.value)} style={{ marginBottom: '5px', width: '100%' }} />
                  <textarea placeholder="Job Description" value={w.description} onChange={e => updateWork(i, 'description', e.target.value)} style={{ width: '100%' }} rows="2" />
                  <button type="button" onClick={() => removeWork(i)} style={{ background: 'red', color: 'white', border: 'none', marginTop: '5px', fontSize: '0.8rem' }}>Remove Job</button>
                </div>
              ))}
              <button type="button" onClick={addWork} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>+ Add Job</button>
            </div>

            {/* EDUCATION */}
            <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px' }}>
              <h4>🎓 Education</h4>
              {educationList.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <input placeholder="Degree" value={e.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                  <input placeholder="Institute" value={e.institute} onChange={e => updateEducation(i, 'institute', e.target.value)} />
                  <input placeholder="Year" value={e.year} onChange={e => updateEducation(i, 'year', e.target.value)} style={{ width: '80px' }} />
                  <button type="button" onClick={() => removeEducation(i)} style={{ background: 'red', color: 'white', border: 'none' }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addEducation} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>+ Add Education</button>
            </div>

            {/* PROJECTS */}
            <div style={{ background: '#fff7ed', padding: '15px', borderRadius: '8px' }}>
              <h4>🚀 Projects</h4>
              {projectList.map((p, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <input placeholder="Title" value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} style={{ width: '100%' }} />
                  <textarea placeholder="Desc" value={p.description} onChange={e => updateProject(i, 'description', e.target.value)} style={{ width: '100%' }} />
                  <input placeholder="Link" value={p.link} onChange={e => updateProject(i, 'link', e.target.value)} style={{ width: '100%' }} />
                  <button type="button" onClick={() => removeProject(i)} style={{ background: 'red', color: 'white', border: 'none' }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addProject} style={{ background: '#f97316', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>+ Add Project</button>
            </div>

            {/* SKILLS */}
            <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
              <h4>🛠 Skills</h4>
              <input value={basicInfo.skillLanguages} onChange={e => setBasicInfo({ ...basicInfo, skillLanguages: e.target.value })} placeholder="Languages" style={{ marginBottom: '5px', width: '100%' }} />
              <input value={basicInfo.skillTools} onChange={e => setBasicInfo({ ...basicInfo, skillTools: e.target.value })} placeholder="Tools" style={{ width: '100%', marginBottom: '5px' }} />
              <input value={basicInfo.skillDatabases} onChange={e => setBasicInfo({ ...basicInfo, skillDatabases: e.target.value })} placeholder="Databases" style={{ width: '100%' }} />
            </div>

            {/* CUSTOM FIELDS (Hobbies) */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h4>Others</h4>
              {customList.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                  <input placeholder="Title" value={item.title} onChange={e => updateCustom(index, 'title', e.target.value)} />
                  <input placeholder="Value" value={item.value} onChange={e => updateCustom(index, 'value', e.target.value)} />
                  <button type="button" onClick={() => removeCustom(index)} style={{ background: 'red', color: 'white', border: 'none' }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addCustom} style={{ background: '#555', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>+ Add More</button>
            </div>

            {/* CERTS */}
            <div style={{ background: '#fdf4ff', padding: '15px', borderRadius: '8px' }}>
              <h4>Certifications</h4>
              {certList.map((cert, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '5px', marginBottom: '5px' }}>
                  <input placeholder="Name" value={cert.name} onChange={e => updateCert(index, 'name', e.target.value)} />
                  <input placeholder="Issuer" value={cert.issuer} onChange={e => updateCert(index, 'issuer', e.target.value)} />
                  <input placeholder="Cred ID" value={cert.credentialId} onChange={e => updateCert(index, 'credentialId', e.target.value)} />
                  <button type="button" onClick={() => removeCert(index)} style={{ background: 'red', color: 'white', border: 'none' }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addCert} style={{ background: '#d946ef', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>+ Add Cert</button>
            </div>

            {/* PROFILE PIC */}
            {isEditing && (
              <div style={{ marginTop: '10px' }}>
                <label>Update Profile Picture:</label>
                <input type="file" onChange={e => setFiles({ ...files, profilePic: e.target.files[0] })} />
              </div>
            )}

            {/* SAVE BUTTON */}
            {isEditing && (
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    background: '#16a34a', // Green
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={e => e.target.style.background = '#15803d'}
                  onMouseOut={e => e.target.style.background = '#16a34a'}
                >
                  💾 SAVE PROFILE INFORMATION
                </button>
              </div>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfile;
