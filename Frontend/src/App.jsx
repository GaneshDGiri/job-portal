import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// COMPONENTS
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// PAGES
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateJob from './pages/CreateJob';
import JobSearch from './pages/JobSearch'; // FIXED: Capitalized Import
import AiAssistant from './components/AiAssistant';

function App() {
  return (
    <UserProvider>
      <AiAssistant />
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* FIXED: Capitalized Component Name <JobSearch /> */}
        <Route path="/jobs" element={
            <PrivateRoute><JobSearch /></PrivateRoute>
        } />

        <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        
        <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
        } />
        
        <Route path="/create-job" element={
            <PrivateRoute><CreateJob /></PrivateRoute>
        } />
      </Routes>
    </UserProvider>
  );
}

export default App;