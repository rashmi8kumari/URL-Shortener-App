import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import Stats from './Components/Stats';

function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/stats" style={styles.link}>Stats</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
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
};

export default App;


