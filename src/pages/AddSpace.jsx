import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, CheckCircle2, ChevronRight, ChevronLeft, Search, X, ImagePlus, Minus, Plus, ShieldCheck, Key, UserCheck, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AddSpace.css';

// Fix Leaflet's default icon path issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddSpace = () => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'driveway',
    vehicleSize: 'standard',
    capacity: 1, // NEW
    allocationType: 'unassigned', // NEW: 'unassigned' | 'assigned'
    spots: [], // NEW: [{ id: 1, label: "Spot 1" }]
    accessType: 'none', // NEW: 'none', 'security_gate', 'keypad', 'meet_host'
    parkingInstructions: '', // NEW
    displayAddress: '', 
    priceHourly: '',
    priceDaily: '',
    features: {
      cctv: false,
      gated: false,
      ev: false,
      covered: false,
    },
    lat: 28.6139,
    lng: 77.2090,
  });

  const [photos, setPhotos] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (step === 4) {
      setCanSubmit(false);
      const timer = setTimeout(() => setCanSubmit(true), 800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // --- Capacity & Spots Logic ---
  const handleCapacityChange = (change) => {
    setFormData(prev => {
      const newCap = Math.max(1, prev.capacity + change);
      
      // Auto-adjust spots array if assigned
      let newSpots = [...prev.spots];
      if (newSpots.length < newCap) {
        for (let i = newSpots.length; i < newCap; i++) {
           newSpots.push({ id: i + 1, label: `Spot ${i + 1}` });
        }
      } else if (newSpots.length > newCap) {
        newSpots = newSpots.slice(0, newCap);
      }
      
      return { ...prev, capacity: newCap, spots: newSpots };
    });
  };

  const handleAllocationChange = (type) => {
    setFormData(prev => {
      let newSpots = [...prev.spots];
      if (type === 'assigned' && newSpots.length === 0) {
        for (let i = 0; i < prev.capacity; i++) {
           newSpots.push({ id: i + 1, label: `Spot ${i + 1}` });
        }
      }
      return { ...prev, allocationType: type, spots: newSpots };
    });
  };

  const handleSpotLabelChange = (index, value) => {
    setFormData(prev => {
      const newSpots = [...prev.spots];
      newSpots[index].label = value;
      return { ...prev, spots: newSpots };
    });
  };

  // --- Validation & Navigation ---
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.displayAddress.trim()) newErrors.displayAddress = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.allocationType === 'assigned') {
      const emptySpot = formData.spots.find(s => !s.label.trim());
      if (emptySpot) newErrors.spots = 'All assigned spots must have a label';
    }
    if (formData.accessType !== 'none' && !formData.parkingInstructions.trim()) {
      newErrors.parkingInstructions = 'Instructions are required for this access method';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => Math.min(prev + 1, 4));
    setErrors({});
  };

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent premature submission if Enter is pressed before the final step
    if (step < 4) {
      handleNext();
      return;
    }

    setSubmitStatus('submitting');
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Form successfully submitted:', formData, photos);
      setSubmitStatus('success');
    }, 1500);
  };

  // --- Photo Upload Logic ---
  const handleFileClick = () => fileInputRef.current.click();

  const processFiles = (files) => {
    const newPhotos = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const removePhoto = (index, e) => {
    e.stopPropagation();
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      if (currentPreviewIndex >= newPhotos.length && newPhotos.length > 0) {
        setCurrentPreviewIndex(newPhotos.length - 1);
      }
      return newPhotos;
    });
  };

  // --- Map & Geocoding Logic ---
  const handleMapSearch = async () => {
    const query = formData.displayAddress;
    if (!query.trim()) return;
    
    setIsSearchingLocation(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }));
        if (errors.displayAddress) setErrors(prev => ({ ...prev, displayAddress: null }));
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
    setIsSearchingLocation(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMapSearch();
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const latlng = e.target.getLatLng();
    setFormData(prev => ({ ...prev, lat: latlng.lat, lng: latlng.lng }));
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(', ');
        const simplified = parts.slice(0, 3).join(', ');
        setFormData(prev => ({ ...prev, displayAddress: simplified || data.display_name }));
        if (errors.displayAddress) setErrors(prev => ({ ...prev, displayAddress: null }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    }
  };

  const MapUpdater = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => { map.flyTo([lat, lng], 15); }, [lat, lng, map]);
    return null;
  };

  const FeatureChip = ({ name, label, icon }) => (
    <label className={`feature-chip glass-panel ${formData.features[name] ? 'active' : ''}`}>
      <input type="checkbox" name={name} checked={formData.features[name]} onChange={handleChange} className="hidden-checkbox" />
      <span className="chip-content">
        {icon && <span className="chip-icon">{icon}</span>}
        {label}
      </span>
    </label>
  );

  if (submitStatus === 'success') {
    return (
      <div className="add-space-container flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', borderRadius: '16px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'var(--accent-primary-transparent-20)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 20px', color: 'var(--accent-primary)' 
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-accent-gradient" style={{ fontSize: '2rem', marginBottom: '15px' }}>Listing Published!</h2>
          <p className="text-secondary" style={{ marginBottom: '30px', lineHeight: '1.5' }}>
            Your parking space <strong>{formData.title}</strong> is now live on ParkEasy. Drivers can now view and book your space.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="glass-btn secondary" onClick={() => window.location.reload()}>List Another Space</button>
            <button className="glass-btn primary" onClick={() => window.location.href = '/host/listings'}>My Spaces</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-space-container">
      <div className="add-space-header">
        <h1 className="text-accent-gradient animate-fade-in">List Your Space</h1>
        <p className="text-secondary animate-fade-in delay-1">Turn your unused parking space into income.</p>
      </div>

      {/* 4-Step Indicator */}
      <div className="step-indicator-wrapper animate-fade-in delay-2">
        <div className="step-indicator">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-dot"></div><span>Space</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-dot"></div><span>Access</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-dot"></div><span>Pricing</span>
          </div>
          <div className={`step-line ${step >= 4 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
            <div className="step-dot"></div><span>Photos</span>
          </div>
        </div>
      </div>

      <div className="layout-split animate-fade-in delay-3">
        {/* Left Column: Form */}
        <div className="form-column">
          <form onSubmit={handleSubmit} className="add-space-form glass-panel" onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.type !== 'textarea') e.preventDefault();
          }}>
            
            {/* STEP 1: Basic Info & Capacity */}
            {step === 1 && (
              <div className="form-step animate-fade-in">
                <h3 className="step-title">Space Details</h3>
                
                <div className="input-group">
                  <label>Listing title</label>
                  <input type="text" name="title" className={`glass-input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Spacious Driveway near Downtown" value={formData.title} onChange={handleChange} />
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>
                
                <div className="form-row">
                  <div className="input-group">
                    <label>Space type</label>
                    <select name="type" className="glass-input" value={formData.type} onChange={handleChange}>
                      <option value="driveway">Driveway</option>
                      <option value="garage">Garage</option>
                      <option value="lot">Parking Lot</option>
                      <option value="street">Street Parking</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Vehicle size</label>
                    <select name="vehicleSize" className="glass-input" value={formData.vehicleSize} onChange={handleChange}>
                      <option value="compact">Compact</option>
                      <option value="standard">Standard</option>
                      <option value="suv">SUV / Minivan</option>
                      <option value="oversized">Oversized</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>How many vehicles can park here simultaneously?</label>
                  <div className="capacity-counter glass-input">
                    <button type="button" className="counter-btn" onClick={() => handleCapacityChange(-1)} disabled={formData.capacity <= 1}>
                      <Minus size={18} />
                    </button>
                    <span className="counter-value">{formData.capacity}</span>
                    <button type="button" className="counter-btn" onClick={() => handleCapacityChange(1)}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Location</label>
                  <div className="location-search-group">
                    <input type="text" name="displayAddress" className={`glass-input ${errors.displayAddress ? 'input-error' : ''}`} placeholder="Search address or area..." value={formData.displayAddress} onChange={handleChange} onKeyDown={handleSearchKeyPress} />
                    <button type="button" className="glass-btn search-btn" onClick={handleMapSearch} disabled={isSearchingLocation} title="Locate on Map">
                      <Search size={18} />
                    </button>
                  </div>
                  {errors.displayAddress && <span className="error-text">{errors.displayAddress}</span>}
                </div>
                
                <div className="map-container-wrapper">
                  <div className="map-frame glass-panel">
                    <MapContainer center={[formData.lat, formData.lng]} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[formData.lat, formData.lng]} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }} />
                      <MapUpdater lat={formData.lat} lng={formData.lng} />
                    </MapContainer>
                  </div>
                  <p className="text-secondary mt-1" style={{fontSize: '0.8rem'}}>Drag pin to adjust the exact location.</p>
                </div>
              </div>
            )}

            {/* STEP 2: Access & Inventory */}
            {step === 2 && (
              <div className="form-step animate-fade-in">
                <h3 className="step-title">Access & Instructions</h3>
                
                <div className="input-group">
                  <label>Inventory Allocation</label>
                  <p className="text-secondary mb-3" style={{fontSize: '0.85rem'}}>How should drivers park in your {formData.capacity} space{formData.capacity > 1 ? 's' : ''}?</p>
                  
                  <div className="allocation-options">
                    <div className={`allocation-card glass-panel ${formData.allocationType === 'unassigned' ? 'active' : ''}`} onClick={() => handleAllocationChange('unassigned')}>
                      <div className="allocation-icon"><AlertCircle size={24} /></div>
                      <div className="allocation-info">
                        <h4>Unassigned</h4>
                        <p>Park anywhere available. Best for open lots or single driveways.</p>
                      </div>
                    </div>
                    <div className={`allocation-card glass-panel ${formData.allocationType === 'assigned' ? 'active' : ''}`} onClick={() => handleAllocationChange('assigned')}>
                      <div className="allocation-icon"><MapPin size={24} /></div>
                      <div className="allocation-info">
                        <h4>Assigned Spots</h4>
                        <p>Drivers are assigned a specific spot number upon booking.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.allocationType === 'assigned' && (
                  <div className="input-group mt-4 animate-fade-in">
                    <label>Spot Labels</label>
                    <p className="text-secondary mb-2" style={{fontSize: '0.85rem'}}>Name your {formData.capacity} spots so drivers can find them.</p>
                    <div className="spots-grid">
                      {formData.spots.map((spot, index) => (
                        <div key={index} className="spot-input-wrapper">
                          <span className="spot-number">{index + 1}</span>
                          <input 
                            type="text" 
                            className="glass-input" 
                            value={spot.label} 
                            onChange={(e) => handleSpotLabelChange(index, e.target.value)}
                            placeholder={`e.g. Spot ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    {errors.spots && <span className="error-text">{errors.spots}</span>}
                  </div>
                )}

                <div className="form-row mt-4">
                  <div className="input-group">
                    <label>Access Method</label>
                    <select name="accessType" className="glass-input" value={formData.accessType} onChange={handleChange}>
                      <option value="none">No barrier (Open access)</option>
                      <option value="security_gate">Security Gate / Guard</option>
                      <option value="keypad">Keypad / PIN</option>
                      <option value="meet_host">Meet the Host</option>
                    </select>
                  </div>
                </div>

                <div className="input-group mt-4">
                  <label>Parking Instructions</label>
                  <p className="text-secondary mb-2" style={{fontSize: '0.85rem'}}>Exact instructions visible only after a booking is confirmed.</p>
                  <textarea 
                    name="parkingInstructions"
                    className={`glass-input ${errors.parkingInstructions ? 'input-error' : ''}`} 
                    placeholder="e.g. Enter through Gate 2 and show your booking QR code..."
                    rows="3"
                    value={formData.parkingInstructions}
                    onChange={handleChange}
                  ></textarea>
                  {errors.parkingInstructions && <span className="error-text">{errors.parkingInstructions}</span>}
                </div>
              </div>
            )}

            {/* STEP 3: Pricing & Features */}
            {step === 3 && (
              <div className="form-step animate-fade-in">
                <h3 className="step-title">Pricing & Amenities</h3>
                
                <div className="form-row">
                  <div className="input-group">
                    <label>Hourly Rate (₹)</label>
                    <div className="rupee-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input type="number" name="priceHourly" className="glass-input price-input pl-8" placeholder="0" min="0" value={formData.priceHourly} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Daily Rate (₹)</label>
                    <div className="rupee-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input type="number" name="priceDaily" className="glass-input price-input pl-8" placeholder="0" min="0" value={formData.priceDaily} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="input-group mt-4">
                  <label>Amenities</label>
                  <div className="chips-grid">
                    <FeatureChip name="covered" label="Covered" />
                    <FeatureChip name="cctv" label="CCTV" />
                    <FeatureChip name="ev" label="EV Charging" />
                    <FeatureChip name="gated" label="Gated Access" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Photos & Publish */}
            {step === 4 && (
              <div className="form-step animate-fade-in">
                <h3 className="step-title">Photos (Optional)</h3>
                
                <div className={`photo-upload-area glass-input ${isDragging ? 'dragging' : ''}`} onClick={handleFileClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden-file-input" />
                  <Camera className="upload-icon" size={40} />
                  <p>Drag & drop photos here, or click to select</p>
                  <span className="upload-hint">Showcase your space (max 5). Photos are optional.</span>
                </div>
                
                {photos.length > 0 && (
                  <div className="photo-preview-grid">
                    {photos.map((photo, index) => (
                      <div key={index} className="photo-thumbnail">
                        <img src={photo.preview} alt={`Preview ${index}`} />
                        <button type="button" className="remove-photo-btn" onClick={(e) => removePhoto(index, e)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Actions */}
            <div className="form-actions">
              {step > 1 && (
                <button type="button" className="glass-btn secondary" onClick={handlePrev}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              {step < 4 ? (
                <button type="button" className="glass-btn primary btn-next" onClick={handleNext}>
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="glass-btn primary btn-next" 
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitting' || !canSubmit}
                >
                  {submitStatus === 'submitting' ? 'Publishing...' : 'Publish Listing'} 
                  {submitStatus !== 'submitting' && <CheckCircle2 size={18} className="ml-2" />}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview (Desktop Only) */}
        <div className="preview-column">
          <div className="preview-sticky">
            <h4 className="preview-heading">Your Listing</h4>
            <div className="preview-card glass-panel">
              <div className="preview-image-placeholder" style={photos.length > 0 ? { backgroundImage: `url(${photos[currentPreviewIndex]?.preview})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' } : {}}>
                {photos.length === 0 && (
                  <div className="preview-image-empty">
                    <ImagePlus size={36} className="text-secondary opacity-50 mb-2" />
                    <span className="empty-title">Add a photo</span>
                    <span className="empty-sub">Your first photo will be the cover</span>
                  </div>
                )}
                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => setCurrentPreviewIndex(prev => prev === 0 ? photos.length - 1 : prev - 1)} className="carousel-btn left"><ChevronLeft size={18} /></button>
                    <button type="button" onClick={() => setCurrentPreviewIndex(prev => prev === photos.length - 1 ? 0 : prev + 1)} className="carousel-btn right"><ChevronRight size={18} /></button>
                    <div className="carousel-dots">
                      {photos.map((_, i) => <div key={i} className={`carousel-dot ${i === currentPreviewIndex ? 'active' : ''}`} />)}
                    </div>
                  </>
                )}
              </div>
              <div className="preview-content">
                <div className="preview-type-badge flex-between">
                  <span>{formData.type.toUpperCase()} • {formData.vehicleSize.toUpperCase()}</span>
                  <span style={{color: 'var(--text-secondary)'}}>CAPACITY: {formData.capacity}</span>
                </div>
                <h3 className="preview-title">{formData.title || 'Spacious Driveway'}</h3>
                <div className="preview-location text-secondary">
                  <MapPin size={14} className="mr-1" />
                  {formData.displayAddress || 'Location not set'}
                </div>
                
                {(!formData.priceHourly && !formData.priceDaily) ? (
                  <div className="preview-price-row empty-price">Price not set</div>
                ) : (
                  <div className="preview-price-row">
                    <div className="preview-price">
                      <span className="price-val">{formData.priceHourly ? `₹${formData.priceHourly}` : '—'}</span>
                      <span className="price-unit">/hr</span>
                    </div>
                    <div className="preview-price-divider">•</div>
                    <div className="preview-price">
                      <span className="price-val">{formData.priceDaily ? `₹${formData.priceDaily}` : '—'}</span>
                      <span className="price-unit">/day</span>
                    </div>
                  </div>
                )}
                
                <div className="preview-features-mini">
                  {Object.entries(formData.features).filter(([_, isSelected]) => isSelected).map(([key]) => (
                    <span key={key} className="preview-feature-tag">
                      {key === 'cctv' ? 'CCTV' : key === 'ev' ? 'EV' : key === 'gated' ? 'Gated' : 'Covered'}
                    </span>
                  ))}
                  {formData.accessType !== 'none' && (
                    <span className="preview-feature-tag" style={{borderColor: 'var(--accent-secondary)'}}>
                      {formData.accessType === 'security_gate' ? 'Security Gate' : formData.accessType === 'keypad' ? 'Keypad Entry' : 'Meet Host'}
                    </span>
                  )}
                  {formData.allocationType === 'assigned' && (
                    <span className="preview-feature-tag" style={{borderColor: 'var(--accent-primary)'}}>Assigned Spots</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSpace;
