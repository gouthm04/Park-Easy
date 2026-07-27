import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, LogIn, Menu, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <MapPin className="logo-icon" size={28} />
          <span className="logo-text text-accent-gradient">ParkEasy</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Find Parking</Link>
          <Link to="/host" className="nav-link">Become a Host</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
        
        <div className="navbar-actions">
          <button 
            className="glass-btn theme-toggle" 
            onClick={toggleTheme}
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to="/login" className="glass-btn login-btn">
            <LogIn size={18} />
            <span>Login</span>
          </Link>
          <Link to="/register" className="glass-btn primary register-btn">
            <User size={18} />
            <span>Sign Up</span>
          </Link>
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
