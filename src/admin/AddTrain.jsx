
// src/admin/AddTrain.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSave } from 'react-icons/fa';
import './Admin.css';

const AddTrain = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    number: '', name: '', from: '', to: '',
    depTime: '', arrTime: '', duration: '', frequency: 'Daily', routeStns: ''
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      
      // 1. Create new train object
      const newTrain = {
          id: Date.now(), // Use timestamp for unique ID
          number: formData.number,
          name: formData.name,
          route: `${formData.from} → ${formData.to}`,
          timing: `${formData.depTime} - ${formData.arrTime}`,
          frequency: formData.frequency
          // In a real app, you'd save duration and intermediate stations too
      };

      // 2. Get existing trains, add new one, save back to LS
      const existingTrains = JSON.parse(localStorage.getItem('adminTrains') || "[]");
      const updatedTrains = [...existingTrains, newTrain];
      localStorage.setItem('adminTrains', JSON.stringify(updatedTrains));

      // 3. Redirect back to dashboard
      navigate('/admin/dashboard');
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-page-container">
         <div className="add-train-card">
            
            <div className="form-header-row">
                <h2 className="admin-title">Add New Train</h2>
                <button className="cancel-btn-top" onClick={() => navigate('/admin/dashboard')}>
                    <FaTimes /> Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Train Number</label>
                        <input type="text" name="number" required className="admin-input" value={formData.number} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Train Name</label>
                        <input type="text" name="name" required className="admin-input" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>From Station</label>
                        <input type="text" name="from" required className="admin-input" value={formData.from} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>To Station</label>
                        <input type="text" name="to" required className="admin-input" value={formData.to} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Departure Time</label>
                        <input type="time" name="depTime" required className="admin-input" value={formData.depTime} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Arrival Time</label>
                        <input type="time" name="arrTime" required className="admin-input" value={formData.arrTime} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label>Duration (e.g., 16h 30m)</label>
                        <input type="text" name="duration" className="admin-input" value={formData.duration} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Frequency</label>
                        <select name="frequency" className="admin-input custom-select" value={formData.frequency} onChange={handleChange}>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Mon,Wed,Fri</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Route Stations (comma-separated)</label>
                        <input type="text" name="routeStns" className="admin-input" placeholder="Station1, Station2, Station3" value={formData.routeStns} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-actions-bottom">
                    <button type="submit" className="submit-btn"><FaSave /> Add Train</button>
                    <button type="button" className="cancel-btn-bottom" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
                </div>
            </form>

         </div>
      </div>
    </div>
  );
};

export default AddTrain;