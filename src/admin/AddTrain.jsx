
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSave } from 'react-icons/fa';
import './Admin.scss';

const AddTrain = () => {
  const navigate = useNavigate();
  
 
  const [formData, setFormData] = useState({
    number: '', name: '', from: '', to: '',
    depTime: '', arrTime: '', duration: '', frequency: 'Daily', routeStns: '',seats: '', price: ''
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Get token for authorization
   const token = localStorage.getItem('token'); 
console.log("Token being sent:", token);

    // 2. Prepare data to match your Java Model (Train.java)
    const trainData = {
        trainNumber: formData.number,
        trainName: formData.name,
        source: formData.from,        // Ensure these match Java fields exactly
        destination: formData.to,
        departureTime: formData.depTime,
        arrivalTime: formData.arrTime,
        duration: formData.duration,
        frequency: formData.frequency,
        totalSeats: parseInt(formData.totalSeats) ||0 ,
    ticketPrice: parseFloat(formData.ticketPrice) ||0,
        routeStations: formData.routeStns ? formData.routeStns.split(',').map(s => s.trim()) : []
        
    };

    try {
        const response = await fetch("http://localhost:8082/api/trains/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Required for your JwtFilter
            },
            body: JSON.stringify(trainData)
        });

        if (response.ok) {  
            navigate('/admin/dashboard');
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (err) {
        console.error("Connection Failed:", err);
        alert("Could not connect to the Train Service. Is it running on port 8082?");
    }
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
                    <div className="form-group">
    <label>Total Seats</label>
    <input 
      type="number" 
      name="totalSeats" 
      required 
      className="admin-input" 
      value={formData.totalSeats} 
      onChange={handleChange} 
    />
</div>
<div className="form-group">
    <label>Ticket Price</label>
    <input 
      type="number" 
      name="ticketPrice" 
      required 
      className="admin-input" 
      value={formData.ticketPrice} 
      onChange={handleChange} 
    />
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