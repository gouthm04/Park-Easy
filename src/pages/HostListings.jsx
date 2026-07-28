import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit2, Calendar, Star, MoreHorizontal, Eye } from 'lucide-react';
import './HostListings.css';

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

const HostListings = () => {
  // Dummy data based on the new capacity and inventory model
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Spacious Driveway near Downtown",
      type: "Driveway",
      vehicleSize: "Standard",
      location: "123 Business Avenue, Block A",
      capacity: 1,
      occupied: 0, // Mock for availability
      allocationType: "unassigned",
      priceHourly: 30,
      priceDaily: 300,
      status: "Active",
      rating: 4.8,
      reviews: 24,
      image: null // Removed image to demonstrate fallback
    },
    {
      id: 2,
      title: "Secure Underground Garage",
      type: "Garage",
      vehicleSize: "SUV / Minivan",
      location: "DLF City Complex, Basement 2",
      capacity: 4,
      occupied: 1, // Mock for availability
      allocationType: "assigned",
      priceHourly: 50,
      priceDaily: 450,
      status: "Active",
      rating: 4.9,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Empty Lot - Airport Long Term",
      type: "Parking Lot",
      vehicleSize: "Oversized",
      location: "Terminal 2 Outer Ring",
      capacity: 10,
      occupied: 0,
      allocationType: "unassigned",
      priceHourly: null,
      priceDaily: 800,
      status: "Draft",
      rating: 0,
      reviews: 0,
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80"
    }
  ]);

  return (
    <div className="host-listings-container">
      <div className="host-listings-header">
        <div>
          <h1 className="text-accent-gradient">My Spaces</h1>
          <p className="text-secondary">Manage your parking inventory, pricing, and availability.</p>
        </div>
        <Link to="/host/spaces/add" className="glass-btn primary">
          <Plus size={18} /> List a New Space
        </Link>
      </div>

      <motion.div 
        className="listings-grid"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {listings.map(listing => (
          <motion.div key={listing.id} className="listing-card glass-panel" variants={fadeUp}>
            <div className="listing-image" style={listing.image ? { backgroundImage: `url(${listing.image})` } : {}}>
              {!listing.image && (
                <div className="listing-image-fallback">
                  <MapPin size={40} className="fallback-icon" />
                  <div className="fallback-text">No Cover Photo</div>
                </div>
              )}
              <div className={`status-badge ${listing.status.toLowerCase()}`} style={{ zIndex: 2 }}>
                <div className="status-dot"></div> {listing.status}
              </div>
            </div>
            
            <div className="listing-content">
              <div className="listing-type-badge">
                {listing.type.toUpperCase()} • {listing.vehicleSize.toUpperCase()}
              </div>
              <h3 className="listing-title">{listing.title}</h3>
              <div className="listing-location text-secondary">
                <MapPin size={14} className="mr-1" />
                {listing.location}
              </div>

              <div className="inventory-summary">
                <div className="inventory-item">
                  <span className="inventory-label">Capacity</span>
                  <span className="inventory-value">{listing.capacity} {listing.capacity === 1 ? 'Space' : 'Spaces'}</span>
                </div>
                <div className="inventory-divider"></div>
                <div className="inventory-item">
                  <span className="inventory-label">Available Now</span>
                  <span className="inventory-value" style={{ color: 'var(--accent-primary)' }}>
                    {listing.capacity - listing.occupied} / {listing.capacity}
                  </span>
                </div>
              </div>
              
              <div className="allocation-note text-secondary">
                {listing.allocationType === 'assigned' ? 'Assigned spaces' : 'Unassigned parking'}
              </div>

              <div className="listing-price-row">
                <div className="listing-price">
                  <span className="price-val">{listing.priceHourly ? `₹${listing.priceHourly}` : '—'}</span>
                  <span className="price-unit">/hr</span>
                </div>
                <div className="listing-price-divider">•</div>
                <div className="listing-price">
                  <span className="price-val">{listing.priceDaily ? `₹${listing.priceDaily}` : '—'}</span>
                  <span className="price-unit">/day</span>
                </div>
                
                {listing.status !== 'Draft' && (
                  <div className="listing-rating ml-auto">
                    <Star size={14} className="star-icon" />
                    <span>{listing.rating > 0 ? listing.rating : 'New'}</span>
                    <span className="reviews-count">({listing.reviews})</span>
                  </div>
                )}
              </div>

              {listing.status === 'Draft' ? (
                <div className="listing-actions">
                  <button className="glass-btn secondary flex-1" title="Continue Editing">
                    <Edit2 size={16} /> Continue Editing
                  </button>
                  <button className="glass-btn secondary flex-1" title="Preview Listing">
                    <Eye size={16} /> Preview
                  </button>
                  <button className="glass-btn icon-only" title="More Options">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ) : (
                <div className="listing-actions">
                  <button className="glass-btn secondary flex-1" title="Edit Space">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="glass-btn secondary flex-1" title="Manage Bookings">
                    <Calendar size={16} /> Bookings
                  </button>
                  <button className="glass-btn icon-only" title="More Options">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HostListings;
