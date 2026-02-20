import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaPen, FaTrash, FaTimes } from 'react-icons/fa';
import './StationManagement.scss';

/*const initialStations = [
  { id: 1, code: "NDLS", name: "New Delhi", city: "Delhi", state: "Delhi", zone: "Northern Railway" },
  { id: 2, code: "BCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", zone: "Western Railway" },
  { id: 3, code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", zone: "Eastern Railway" },
  { id: 4, code: "MAS", name: "Chennai Central", city: "Chennai", state: "Tamil Nadu", zone: "Southern Railway" }
];*/

const StationManagement = () => {
  // 1. Initialize stations as an empty array
  const [stations, setStations] = useState([]);
  const [view, setView] = useState('list');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', code: '', name: '', city: '', state: '', zone: '' });

const fetchStations = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found. Please login again.");
            return;
        }

        const response = await fetch("http://localhost:8082/api/stations/all", {
            headers: { 
                "Authorization": `Bearer ${token}`, // Added Bearer prefix
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            setStations(data);
        } else if (response.status === 403) {
            console.error("403 Forbidden: Check your role or if the token is expired.");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
  };
 
useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty array means it runs exactly once on load
  


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

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this station?")) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/stations/delete/${id}`, {
        method: 'DELETE',
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (response.ok) {
        alert("Station deleted successfully");
        // Refresh the list from the database without reloading the whole page
        fetchStations(); 
      } else {
        const errorData = await response.text();
        console.error("Delete failed:", errorData);
      }
    } catch (err) {
      console.error("Network error during delete:", err);
    }
  }
};

  const handleCancel = () => {
    setView('list');
    setFormData({ id: '', code: '', name: '', city: '', state: '', zone: '' });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
        let response;
        if (isEditing) {
            response = await fetch(`http://localhost:8082/api/stations/update/${formData.id}`, {
                method: 'PUT',
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(formData)
            });
        } else {
            const stationToSave = { ...formData };
            delete stationToSave.id;
            response = await fetch("http://localhost:8082/api/stations/add", {
                method: 'POST',
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(stationToSave)
            });
        }

        if (response.ok) {
            alert(isEditing ? "Station Updated!" : "Station Added!");
            // INSTEAD OF RELOAD: Refresh data and switch view
            await fetchStations(); 
            setView('list'); 
        }
    } catch (err) {
        console.error("Operation failed:", err);
    }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="station-container">
      
    
      <div className="station-header">
       
        {view === 'list' && (
          <button className="add-station-btn" onClick={handleAddNew}>
            <FaPlus /> Add Station
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