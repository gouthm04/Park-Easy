import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit2, Calendar, Star, MoreHorizontal, Eye, Trash2, X } from 'lucide-react';
import { mockListings as initialListings } from '../data/mockListings';
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
  const navigate = useNavigate();
  const [listings, setListings] = useState(initialListings);
  
  // State for Dropdown Menu
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // State for Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Close dropdown when clicking outside (simple hack: close on any action)
  const closeDropdown = () => setActiveDropdown(null);

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setDeleteModalOpen(true);
    closeDropdown();
  };

  const confirmDelete = () => {
    setListings(prev => prev.filter(l => l.id !== listingToDelete.id));
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/host/spaces/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/space/${id}`);
  };

  return (
    <div className="host-listings-container" onClick={closeDropdown}>
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
            <div className="listing-image" style={listing.images && listing.images.length > 0 ? { backgroundImage: `url(${listing.images[0].preview})` } : {}}>
              {(!listing.images || listing.images.length === 0) && (
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
                  <button className="glass-btn secondary flex-1" title="Continue Editing" onClick={() => handleEdit(listing.id)}>
                    <Edit2 size={16} /> Continue Editing
                  </button>
                  <button className="glass-btn secondary flex-1" title="Preview Listing" onClick={() => handleView(listing.id)}>
                    <Eye size={16} /> Preview
                  </button>
                  
                  <div className="overflow-menu-wrapper" style={{ position: 'relative' }}>
                    <button className="glass-btn icon-only" title="More Options" onClick={(e) => toggleDropdown(listing.id, e)}>
                      <MoreHorizontal size={18} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === listing.id && (
                        <motion.div 
                          className="dropdown-menu glass-panel"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="dropdown-item danger" onClick={() => handleDeleteClick(listing)}>
                            <Trash2 size={16} /> Delete Space
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="listing-actions">
                  <button className="glass-btn secondary flex-1" title="Edit Space" onClick={() => handleEdit(listing.id)}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="glass-btn secondary flex-1" title="Manage Bookings">
                    <Calendar size={16} /> Bookings
                  </button>

                  <div className="overflow-menu-wrapper" style={{ position: 'relative' }}>
                    <button className="glass-btn icon-only" title="More Options" onClick={(e) => toggleDropdown(listing.id, e)}>
                      <MoreHorizontal size={18} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === listing.id && (
                        <motion.div 
                          className="dropdown-menu glass-panel"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="dropdown-item" onClick={() => handleView(listing.id)}>
                            <Eye size={16} /> View as Driver
                          </div>
                          <div className="dropdown-divider"></div>
                          <div className="dropdown-item danger" onClick={() => handleDeleteClick(listing)}>
                            <Trash2 size={16} /> Delete Space
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && listingToDelete && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className="modal-close" onClick={cancelDelete}><X size={20} /></button>
              <h2 className="modal-title text-accent-gradient">Delete this space?</h2>
              <p className="modal-body text-secondary">
                <strong>"{listingToDelete.title}"</strong> will be permanently removed from your listings.
                <br/><br/>
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="glass-btn secondary" onClick={cancelDelete}>Cancel</button>
                <button className="glass-btn danger-btn" onClick={confirmDelete}>Delete Space</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostListings;
