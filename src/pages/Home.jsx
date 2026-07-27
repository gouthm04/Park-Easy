import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Map, Shield, Clock, Star, ArrowRight, Quote, ChevronDown, ChevronUp, MapPin, CreditCard, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

const AnimatedCounter = ({ end, duration = 2.5, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formattedCount = Number(count).toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
  
  return <>{formattedCount}</>;
};

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    // Simulate loading for the skeleton effect
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { q: "How do refunds work?", a: "Refunds are automatically processed to your original payment method if you cancel 24 hours before your booking time." },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking directly from your dashboard up to 2 hours before the start time for a full refund." },
    { q: "Is my booking guaranteed?", a: "Absolutely. Once your payment is confirmed, the parking spot is reserved exclusively for you for the duration of your booking." },
    { q: "How do hosts receive payments?", a: "Hosts receive payouts securely via Stripe or PayPal on a weekly basis for all completed bookings." }
  ];

  const testimonials = [
    { name: "Rahul S.", text: "Booked parking in under 30 seconds. Saved me so much time before my meeting!", rating: 5 },
    { name: "Priya M.", text: "The app is beautifully designed and finding a spot in the busy downtown was a breeze.", rating: 5 },
    { name: "Amit K.", text: "I list my driveway on ParkEasy. The passive income is great and the platform handles everything.", rating: 5 }
  ];

  const featuredSpaces = [
    { id: 1, title: "Downtown Core Plaza", location: "123 Business Avenue, City Center", price: 150, rating: 4.9, reviews: 120, img: "placeholder-img-1" },
    { id: 2, title: "Tech Hub Underground", location: "45 Innovation Drive, North Block", price: 100, rating: 4.7, reviews: 85, img: "placeholder-img-2" },
    { id: 3, title: "Luxury Mall Premium Spot", location: "Grand Galleria VIP Entrance", price: 200, rating: 5.0, reviews: 200, img: "placeholder-img-3" }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUp}>
            Find the Perfect <br />
            <span className="text-accent-gradient">Parking Spot</span> in Seconds
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-subtitle">
            Don't waste time driving around. Book premium parking spaces in advance 
            with secure payments and real-time availability.
          </motion.p>
          
          <motion.div variants={fadeUp} className="search-bar-glass">
            <div className="search-input-group">
              <Map className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="search-input"
              />
            </div>
            <button className="glass-btn primary search-btn">
              <Search size={20} />
              <span>Search</span>
            </button>
          </motion.div>
          
          <motion.div variants={fadeUp} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter end={5000} duration={2.5} />+
              </span>
              <span className="stat-label">Spaces Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter end={10000} duration={2.5} />+
              </span>
              <span className="stat-label">Happy Drivers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                <AnimatedCounter end={4.9} decimals={1} duration={2.5} />/5
              </span>
              <span className="stat-label">Average Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>How It <span className="text-accent-gradient">Works</span></h2>
          <p className="text-secondary">Three simple steps to your perfect parking spot.</p>
        </motion.div>

        <motion.div 
          className="steps-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="step-card">
            <div className="step-icon-wrapper"><MapPin size={32} /></div>
            <h3>1. Find</h3>
            <p className="text-secondary">Search for parking near your destination.</p>
          </motion.div>
          
          <div className="step-connector"></div>
          
          <motion.div variants={fadeUp} className="step-card">
            <div className="step-icon-wrapper"><CreditCard size={32} /></div>
            <h3>2. Reserve</h3>
            <p className="text-secondary">Book instantly with secure payments.</p>
          </motion.div>
          
          <div className="step-connector"></div>
          
          <motion.div variants={fadeUp} className="step-card">
            <div className="step-icon-wrapper"><Car size={32} /></div>
            <h3>3. Park</h3>
            <p className="text-secondary">Arrive and park seamlessly.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>Why Choose <span className="text-accent-gradient">ParkEasy</span>?</h2>
          <p className="text-secondary">Experience seamless parking with our premium features designed for your convenience.</p>
        </motion.div>
        
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Shield className="feature-icon" size={28} />
            </div>
            <h3>Secure Bookings</h3>
            <p className="text-secondary">Your payments are fully encrypted and securely processed. Verified spaces only.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Clock className="feature-icon" size={28} />
            </div>
            <h3>Flexible Time</h3>
            <p className="text-secondary">Extend your parking duration with a simple tap from your phone. No stress.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Map className="feature-icon" size={28} />
            </div>
            <h3>Prime Locations</h3>
            <p className="text-secondary">Access to exclusive, high-demand parking spots right where you need them.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Spaces Section */}
      <section className="featured-spaces-section container">
        <motion.div 
          className="section-header flex-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div>
            <h2>Featured <span className="text-accent-gradient">Spots</span></h2>
            <p className="text-secondary">Top-rated parking locations available right now.</p>
          </div>
          <Link to="/search" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div 
          className="spaces-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {loading 
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={fadeUp} className="space-card glass-panel skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="space-details">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-line"></div>
                    <div className="space-footer">
                      <div className="skeleton-text skeleton-small"></div>
                      <div className="skeleton-btn"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            : featuredSpaces.map((space) => (
                <motion.div key={space.id} variants={fadeUp} className="space-card glass-panel">
                  <div className={`space-image ${space.img}`}>
                    <div className="price-tag glass-panel">₹{space.price}/hr</div>
                  </div>
                  <div className="space-details">
                    <h3>{space.title}</h3>
                    <p className="space-location text-secondary">
                      <Map size={16} /> {space.location}
                    </p>
                    <div className="space-footer">
                      <div className="rating">
                        <Star size={16} className="star-icon" fill="currentColor" />
                        <span>{space.rating} ({space.reviews} reviews)</span>
                      </div>
                      <button className="glass-btn primary small">Book Now</button>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>Loved by <span className="text-accent-gradient">Drivers</span></h2>
          <p className="text-secondary">Don't just take our word for it.</p>
        </motion.div>

        <motion.div 
          className="testimonials-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {testimonials.map((test, index) => (
            <motion.div key={index} variants={fadeUp} className="testimonial-card glass-panel">
              <Quote size={32} className="quote-icon" />
              <div className="rating-stars">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <Star key={i} size={16} className="star-icon" fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">"{test.text}"</p>
              <h4 className="testimonial-author">- {test.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>Frequently Asked <span className="text-accent-gradient">Questions</span></h2>
        </motion.div>

        <motion.div 
          className="faq-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={fadeUp} className="faq-item glass-panel">
              <button 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                {faq.q}
                {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="faq-answer-wrapper"
                  >
                    <p className="faq-answer text-secondary">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <motion.div 
          className="cta-box glass-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>Have an empty driveway or garage?</h2>
          <p>Turn your unused space into passive income. Join thousands of hosts earning with ParkEasy.</p>
          <Link to="/host/spaces/add" className="glass-btn primary large-btn cta-btn">
            List Your Space Today
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
