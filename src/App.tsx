import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Features } from './pages/Features';
import { Documentation } from './pages/Documentation';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  }
});

function App() {
  const styles = useStyles();

  return (
    <Router>
      <div className={styles.root}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App