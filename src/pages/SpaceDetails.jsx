import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Clock, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockListings } from '../data/mockListings';
import './SpaceDetails.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    const found = mockListings.find(l => l.id === parseInt(id));
    if (found) setListing(found);
  }, [id]);

  if (!listing) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <h2 className="text-secondary">Listing not found</h2>
      </div>
    );
  }

  // Use a fallback if no images exist
  const heroImage = (listing.images && listing.images.length > 0) 
    ? listing.images[0].preview 
    : 'https://images.unsplash.com/photo-1590495914102-1f48edfa11c1?auto=format&fit=crop&q=80';

  return (
    <div className="space-details-page">
      <div className="back-nav">
        <button className="glass-btn secondary small" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
        </button>
      </div>

      {/* Hero Header */}
      <div className="hero-header glass-panel" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay"></div>
      </div>

      <div className="details-layout">
        {/* Main Content Column */}
        <div className="main-content">
          <div className="title-section">
            <h1 className="listing-title-large">{listing.title}</h1>
            <div className="location-rating-row">
              <span className="location-text">
                <MapPin size={16} className="mr-1" /> {listing.location}
              </span>
              <span className="rating-text">
                <Star size={16} className="star-icon mr-1" />
                {listing.rating > 0 ? listing.rating : 'New'} 
                <span className="text-secondary ml-1">({listing.reviews} reviews)</span>
              </span>
            </div>
          </div>

          <div className="tags-section">
            <div className="tag primary">{listing.type.toUpperCase()}</div>
            <div className="tag">{listing.vehicleSize.toUpperCase()} VEHICLE</div>
            {listing.features.covered && <div className="tag">Covered</div>}
            {listing.features.cctv && <div className="tag">CCTV</div>}
            {listing.features.gated && <div className="tag">Security Gate</div>}
            {listing.features.ev && <div className="tag">EV Charging</div>}
          </div>

          <div className="section-divider"></div>

          <div className="content-section">
            <h2>About this parking space</h2>
            <p className="text-secondary">
              A secure and convenient parking spot located perfectly for your needs. 
              Book this space to guarantee your spot and avoid circling the block. 
              {listing.features.cctv ? " The area is monitored 24/7." : ""}
            </p>
          </div>

          <div className="section-divider"></div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><CheckCircle2 size={24} /></div>
              <div className="feature-text">
                <h3>Capacity</h3>
                <p>{listing.capacity} {listing.capacity === 1 ? 'Space' : 'Spaces'}</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon"><Key size={24} /></div>
              <div className="feature-text">
                <h3>Access</h3>
                <p>{listing.accessType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><ShieldCheck size={24} /></div>
              <div className="feature-text">
                <h3>Allocation</h3>
                <p>{listing.allocationType === 'assigned' ? 'Assigned Space' : 'Park Anywhere'}</p>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="content-section">
            <h2>Approximate Location</h2>
            <p className="text-secondary mb-3">Exact parking instructions are provided after booking.</p>
            <div className="map-view-container glass-panel">
              <MapContainer center={[listing.lat, listing.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={[listing.lat, listing.lng]} pathOptions={{ fillColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }} radius={200} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Booking Card Sidebar */}
        <div className="sidebar">
          <div className="booking-card glass-panel sticky-card">
            <div className="booking-price-header">
              <div className="price-primary">
                <span className="amount">₹{listing.priceHourly || listing.priceDaily}</span>
                <span className="unit">/{listing.priceHourly ? 'hour' : 'day'}</span>
              </div>
              {listing.priceHourly && listing.priceDaily && (
                <div className="price-secondary text-secondary">
                  ₹{listing.priceDaily} / day
                </div>
              )}
            </div>

            <div className="booking-inputs">
              <div className="input-field">
                <label>Date</label>
                <input type="date" className="glass-input" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              
              <div className="time-row">
                <div className="input-field">
                  <label>Arrival</label>
                  <input type="time" className="glass-input" defaultValue="10:00" />
                </div>
                <div className="input-field">
                  <label>Departure</label>
                  <input type="time" className="glass-input" defaultValue="14:00" />
                </div>
              </div>
            </div>

            <button className="glass-btn primary check-btn">
              Check Availability
            </button>
            <p className="text-secondary mt-3 text-center" style={{fontSize: '0.8rem'}}>You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
