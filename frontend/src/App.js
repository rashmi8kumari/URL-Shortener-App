import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './Components/Home';
import Stats from './Components/Stats';
import Register from './Components/Register';
import Login from './Components/Login';
import { getToken, removeToken } from './utils/auth'; // auth utils

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

// 🔹 Navbar Component with Logout button
function Navbar() {
  const token = getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div style={styles.navbar}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/stats" style={styles.link}>Stats</Link>
      {!token ? (
        <>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      )}
    </div>
  );
}

const styles = {
  navbar: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  logoutBtn: {
    padding: '5px 10px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default App;



