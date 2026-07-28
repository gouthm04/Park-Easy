import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, CreditCard, ChevronRight, Navigation, Plus, Map, Sun } from 'lucide-react';
import './Dashboard.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Dashboard = () => {
  // Dummy data
  const user = { name: "John Doe" };
  const hasActiveBooking = true;
  // Dummy state for whether the user has listings
  const isHost = true;
  
  const recentActivity = [
    { id: 1, title: "Tech Hub Underground", date: "Oct 12, 2026", time: "2:00 PM - 5:00 PM", status: "Completed", amount: "₹300" },
    { id: 2, title: "Central Mall Parking", date: "Oct 10, 2026", time: "1:00 PM - 3:00 PM", status: "Completed", amount: "₹200" },
    { id: 3, title: "Airport Long Term", date: "Oct 05, 2026", time: "8:00 AM - 8:00 PM", status: "Cancelled", amount: "Refunded" },
  ];

  return (
    <div className="dashboard-container">
      <motion.div 
        className="dashboard-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div>
          <h1>Welcome back, {user.name}</h1>
          <p>Here is what's happening with your parking today.</p>
        </div>
        <div className="quick-actions">
          <div className="weather-widget">
            <Sun size={20} style={{ color: '#fbbf24' }} />
            <div>
              <span style={{ fontWeight: 600, marginRight: '8px' }}>29°C</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sunny</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Perfect for parking</div>
            </div>
          </div>
          
          <Link to="/search" className="glass-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: 'fit-content' }}>
            <SearchIcon size={18} /> Find Parking
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="dashboard-stats"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="section-divider-title" style={{ gridColumn: '1 / -1' }}>
          <h2>Driver Overview</h2>
          <div className="title-underline"></div>
        </div>
        <motion.div variants={fadeUp} className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h4>Active Bookings</h4>
            <h2>1</h2>
          </div>
        </motion.div>
        
        <motion.div variants={fadeUp} className="stat-card">
          <div className="stat-icon-wrapper green">
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Spent</h4>
            <h2>₹1,250</h2>
          </div>
        </motion.div>
        
        <motion.div variants={fadeUp} className="stat-card">
          <div className="stat-icon-wrapper purple">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <h4>Saved Spots</h4>
            <h2>4</h2>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-grid">
        <div className="dashboard-main-col">
          <div className="dashboard-section-title">
            <h3>Current Booking</h3>
          </div>
          
          {hasActiveBooking ? (
            <motion.div 
              className="active-booking-card glass-panel"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div 
                className="active-image" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80')` }}
              >
                <div className="live-badge">
                  <div className="live-dot"></div> Live
                </div>
              </div>
              <div className="active-details">
                <div>
                  <h3>Downtown Core Plaza</h3>
                  <p className="active-location"><MapPin size={16} /> 123 Business Avenue, Level B2, Spot #42</p>
                  
                  <div className="time-container">
                    <div className="time-block">
                      <span className="time-label">Start Time</span>
                      <span className="time-value">14:00</span>
                    </div>
                    <div className="time-block">
                      <span className="time-label">End Time</span>
                      <span className="time-value">17:00</span>
                    </div>
                    <div className="time-block">
                      <span className="time-label">Remaining</span>
                      <span className="time-value" style={{ color: '#10b981' }}>2h 15m</span>
                    </div>
                  </div>
                </div>
                
                <div className="active-actions">
                  <button className="glass-btn primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Clock size={18} /> Extend Time
                  </button>
                  <button className="glass-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Navigation size={18} /> Navigate
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <Map size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Active Bookings</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You don't have any parking spots booked right now.</p>
              <Link to="/search" className="glass-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Book a Spot
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-side-col">
          <div className="dashboard-section-title">
            <h3>Recent Activity</h3>
            <span className="view-all-text">View All</span>
          </div>
          
          <motion.div 
            className="recent-list"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {recentActivity.map((activity) => (
              <motion.div key={activity.id} variants={fadeUp} className="recent-item">
                <div className="recent-info">
                  <div className="recent-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="recent-text">
                    <h4>{activity.title}</h4>
                    <p>{activity.date} • {activity.amount}</p>
                  </div>
                </div>
                <div className={`recent-status status-${activity.status.toLowerCase()}`}>
                  {activity.status}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Host Overview Section */}
      <motion.div 
        className="host-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        style={{ marginTop: '4rem' }}
      >
        <div className="section-divider-title">
          <h2>Host Overview</h2>
          <div className="title-underline"></div>
        </div>

        {isHost ? (
          <div className="dashboard-stats" style={{ marginTop: '2rem' }}>
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon-wrapper purple">
                <MapPin size={24} />
              </div>
              <div className="stat-info">
                <h4>Listings</h4>
                <h2>2</h2>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon-wrapper green">
                <CreditCard size={24} />
              </div>
              <div className="stat-info">
                <h4>Today's Earnings</h4>
                <h2>₹650</h2>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon-wrapper blue">
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <h4>Occupancy</h4>
                <h2>82%</h2>
              </div>
            </motion.div>

            <Link to="/host/listings" className="glass-btn primary" style={{ gridColumn: '1 / -1', justifySelf: 'start', padding: '1rem 2rem', marginTop: '1rem' }}>
              Manage Listings <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }} />
            </Link>
          </div>
        ) : (
          <motion.div variants={fadeUp} className="host-empty-state glass-panel" style={{ marginTop: '2rem', padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="stat-icon-wrapper purple" style={{ margin: '0 auto 1.5rem auto', width: '80px', height: '80px' }}>
              <Plus size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No active listings.</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>Start earning today by renting out your unused driveway or garage.</p>
            <Link to="/host/spaces/add" className="glass-btn primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              List Your Space
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Simple SearchIcon wrapper since we didn't import Search from lucide-react above
const SearchIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default Dashboard;
