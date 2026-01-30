import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaPen, FaTrash, FaTimes } from 'react-icons/fa';
import './StationManagement.scss';

const initialStations = [
  { id: 1, code: "NDLS", name: "New Delhi", city: "Delhi", state: "Delhi", zone: "Northern Railway" },
  { id: 2, code: "BCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", zone: "Western Railway" },
  { id: 3, code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", zone: "Eastern Railway" },
  { id: 4, code: "MAS", name: "Chennai Central", city: "Chennai", state: "Tamil Nadu", zone: "Southern Railway" }
];

const StationManagement = () => {

  const [stations, setStations] = useState(() => {
    const saved = localStorage.getItem('adminStations');
    return saved ? JSON.parse(saved) : initialStations;
  });

 
  const [view, setView] = useState('list');
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', code: '', name: '', city: '', state: '', zone: '' });

 
  useEffect(() => {
    localStorage.setItem('adminStations', JSON.stringify(stations));
  }, [stations]);

  

  const handleAddNew = () => {
    setFormData({ id: '', code: '', name: '', city: '', state: '', zone: '' });
    setIsEditing(false);
    setView('form');
  };

  const handleEdit = (station) => {
    setFormData(station);
    setIsEditing(true);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      setStations(stations.filter(s => s.id !== id));
    }
  };

  const handleCancel = () => {
    setView('list');
    setFormData({ id: '', code: '', name: '', city: '', state: '', zone: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      
      setStations(stations.map(s => (s.id === formData.id ? formData : s)));
    } else {
      
      const newStation = { ...formData, id: Date.now() };
      setStations([...stations, newStation]);
    }
    
    setView('list');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="station-container">
      
    
      <div className="station-header">
        <h3>Station Management</h3>
        {view === 'list' && (
          <button className="add-station-btn" onClick={handleAddNew}>
            <FaPlus /> Add Station
          </button>
        )}
        {view === 'form' && (
           <button className="cancel-top-btn" onClick={handleCancel}>
             <FaTimes /> Cancel
           </button>
        )}
      </div>

      
      {view === 'list' && (
        <div className="station-grid">
          {stations.map((station) => (
            <div key={station.id} className="station-card">
              <div className="card-top">
                <div className="station-icon-box">
                  <FaMapMarkerAlt className="pin-icon" />
                </div>
                <div className="station-info">
                  <h4>{station.code}</h4>
                  <p className="station-name">{station.name}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(station)} className="icon-btn edit"><FaPen /></button>
                  <button onClick={() => handleDelete(station.id)} className="icon-btn delete"><FaTrash /></button>
                </div>
              </div>
              
              <div className="card-details">
                <p><strong>City:</strong> {station.city}</p>
                <p><strong>State:</strong> {station.state}</p>
                <p className="zone-text">{station.zone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {view === 'form' && (
        <div className="form-wrapper">
          <div className="form-card">
            <h4>{isEditing ? "Edit Station" : "Add New Station"}</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half">
                  <label>Station Code</label>
                  <input name="code" value={formData.code} onChange={handleChange} placeholder="e.g., NDLS" required />
                </div>
                <div className="form-group half">
                  <label>Station Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="New Delhi" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="Delhi" required />
                </div>
                <div className="form-group half">
                  <label>State</label>
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="Delhi" required />
                </div>
              </div>

              <div className="form-group full">
                <label>Railway Zone</label>
                <select name="zone" value={formData.zone} onChange={handleChange} required>
                  <option value="">Select Zone</option>
                  <option value="Northern Railway">Northern Railway</option>
                  <option value="Western Railway">Western Railway</option>
                  <option value="Eastern Railway">Eastern Railway</option>
                  <option value="Southern Railway">Southern Railway</option>
                  <option value="Central Railway">Central Railway</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {isEditing ? "Update Station" : "Add Station"}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StationManagement;