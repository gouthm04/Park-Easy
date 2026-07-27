import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'johndoe@example.com',
    password: 'SecurePassword123!'
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call the Django backend API
    console.log("Login submitted:", formData);
    // Simulate successful login and redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="auth-image-side" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80')` }}
        >
          <div className="auth-image-overlay">
            <h2>Welcome Back</h2>
            <p>Your seamless parking experience awaits. Log in to manage your bookings or list your space.</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <h2>Log In</h2>
          <p className="auth-subtitle">Enter your credentials to access your account.</p>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <Mail className="input-icon" size={20} />
            </div>
            
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                className="auth-input password-field"
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <Lock className="input-icon" size={20} />
              <button 
                type="button" 
                className="password-toggle-icon" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <a href="#" className="auth-link" style={{ fontSize: '0.9rem' }}>Forgot password?</a>
            </div>
            
            <button type="submit" className="glass-btn primary auth-submit-btn">
              <span>Log In</span>
              <ArrowRight size={20} />
            </button>
          </form>
          
          <div className="auth-divider">or</div>
          
          <button type="button" className="social-auth-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <p className="auth-link-text">
            Don't have an account? 
            <Link to="/register" className="auth-link">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
