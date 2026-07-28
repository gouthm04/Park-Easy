import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const isMinimal = location.pathname === '/host/spaces/add';

  if (isMinimal) {
    return (
      <footer className="footer-section" style={{ padding: '20px 0', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-footer-bottom)' }}>
        <div className="container flex-center">
          <div className="footer-bottom" style={{ border: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px' }}>
            <Link to="/terms" className="text-secondary" style={{ fontSize: '0.9rem' }}>Terms</Link>
            <Link to="/privacy" className="text-secondary" style={{ fontSize: '0.9rem' }}>Privacy</Link>
            <Link to="/help" className="text-secondary" style={{ fontSize: '0.9rem' }}>Help</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        
        <div className="footer-brand">
          <Link to="/" className="navbar-logo footer-logo">
            <MapPin className="logo-icon" size={28} />
            <span className="logo-text text-accent-gradient">ParkEasy</span>
          </Link>
          <p className="text-secondary footer-description">
            The smartest way to find, book, and manage your parking spaces. 
            Join the revolution of hassle-free parking today.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="#" className="social-icon"><Github size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <Link to="/search">Find Parking</Link>
            <Link to="/host/spaces/add">List a Space</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/faq">FAQs</Link>
            <Link to="/help">Help Center</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="text-secondary">
          &copy; {new Date().getFullYear()} ParkEasy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
