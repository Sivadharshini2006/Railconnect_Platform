import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrain, FaMapMarkerAlt, FaDollarSign, FaCogs, 
  FaChartPie, FaPlus, FaRegEdit, FaRegTrashAlt, 
  FaSave, FaTimes 
} from 'react-icons/fa';
import './Admin.scss';

import Statistics from './Statistics';
import StationManagement from './StationManagement'; 
import FareManagement from './FareManagement'; 
import QuotaAllocation from './QuotaAllocation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trains'); 
  const [trains, setTrains] = useState([]); 
  const [editTrainId, setEditTrainId] = useState(null); 
  const [editFormData, setEditFormData] = useState({}); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  const fetchAllTrains = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch("http://localhost:8082/api/trains/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrains(data); 
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8082/api/trains/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok && isMounted) {
                const data = await response.json();
                setTrains(data); // List only updates if fetch is successful
            }
        } catch (err) {
            console.error("CORS or Network Error:", err);
            // Don't setTrains([]) here; keep the old data or show an error message
        }
    };
    loadData();
    return () => { isMounted = false; };
}, [activeTab]); // Keep this constant!

  const handleEditClick = (train) => {
    // MongoDB uses _id, while SQL usually uses id. This handles both.
    const id = train.id || train._id;
    setEditTrainId(id);
    setEditFormData({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      totalSeats: train.totalSeats,
      ticketPrice: train.ticketPrice
    });
  };

  const handleCancelClick = () => { 
    setEditTrainId(null); 
    setEditFormData({}); 
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      // LOGIC FIX: Ensure the PUT request is sent with correct headers to avoid 403
      const response = await fetch(`http://localhost:8082/api/trains/update/${id}`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setEditTrainId(null);
        fetchAllTrains(); // Refresh the list after successful save
        alert("Train updated successfully!");
      } else {
        // Handle 403 or other status codes
        const errorText = await response.text();
        console.error(`Status ${response.status}: ${errorText}`);
      }
    } catch (err) {
      // FIX for 'no-unused-vars': Use the 'err' variable in the log
      console.error("Update failed:", err); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this train?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8082/api/trains/delete/${id}`, {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          fetchAllTrains(); 
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <nav className="tte-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <FaTrain className="brand-icon" />
            <div className="brand-text">
              <h1 className="brand-title">RailConnect</h1>
              <span className="brand-subtitle">Admin Portal</span>
            </div>
          </div>

          <div className="navbar-links">
            <div className={`nav-link ${activeTab === 'trains' ? 'active' : ''}`} onClick={() => setActiveTab('trains')}>
                <FaTrain className="nav-icon" /> Train Management
            </div>
            <div className={`nav-link ${activeTab === 'stations' ? 'active' : ''}`} onClick={() => setActiveTab('stations')}>
                <FaMapMarkerAlt className="nav-icon" /> Stations
            </div>
            <div className={`nav-link ${activeTab === 'fares' ? 'active' : ''}`} onClick={() => setActiveTab('fares')}>
                <FaDollarSign className="nav-icon" /> Fare Management
            </div>
            <div className={`nav-link ${activeTab === 'quotas' ? 'active' : ''}`} onClick={() => setActiveTab('quotas')}>
                <FaCogs className="nav-icon" /> Quota Allocation
            </div>
            <div className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
                <FaChartPie className="nav-icon" /> Statistics
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn-custom">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
          {activeTab === 'trains' && (
              <>
                  <div className="admin-header-row">
                      <h2 className="admin-title">Train Schedule Management</h2>
                      <button className="add-train-btn-top" onClick={() => navigate('/admin/add-train')}>
                          <FaPlus /> Add Train
                      </button>
                  </div>

                  <div className="admin-table-container">
                      <table className="admin-table">
                          <thead>
                              <tr>
                                  <th>Train Number</th><th>Name</th><th>Route</th><th>Seats</th><th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {trains.map((train) => (
                                  <tr key={train.id || train._id}>
                                      {editTrainId === (train.id || train._id) ? (
                                          <>
                                              <td><input type="text" name="trainNumber" value={editFormData.trainNumber} onChange={handleEditFormChange} className="edit-input" /></td>
                                              <td><input type="text" name="trainName" value={editFormData.trainName} onChange={handleEditFormChange} className="edit-input" /></td>
                                              <td>
                                                  <div className="route-edit-group">
                                                      <input type="text" name="source" value={editFormData.source} onChange={handleEditFormChange} className="edit-input" placeholder="From" />
                                                      <span> → </span>
                                                      <input type="text" name="destination" value={editFormData.destination} onChange={handleEditFormChange} className="edit-input" placeholder="To" />
                                                  </div>
                                              </td>
                                              <td><input type="text" name="ticketPrice" value={editFormData.ticketPrice} onChange={handleEditFormChange} className="edit-input" /></td>
                                              <td className="action-cell">
                                                  <button className="action-btn save-icon" onClick={() => handleSaveEdit(train.id || train._id)}><FaSave /></button>
                                                  <button className="action-btn cancel-icon" onClick={handleCancelClick}><FaTimes /></button>
                                              </td>
                                          </>
                                      ) : (
                                          <>
                                              <td style={{fontWeight:'bold'}}>{train.trainNumber}</td>
                                              <td>{train.trainName}</td>
                                              <td>{train.source} → {train.destination}</td>
                                              <td>{train.totalSeats} </td>
                                              <td className="action-cell">
                                                  <button className="action-btn edit-icon" onClick={() => handleEditClick(train)}><FaRegEdit /></button>
                                                  <button className="action-btn delete-icon" onClick={() => handleDelete(train.id || train._id)}><FaRegTrashAlt /></button>
                                              </td>
                                          </>
                                      )}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </>
          )}

          {activeTab === 'stations' && <StationManagement />}
          {activeTab === 'fares' && <FareManagement />}
          {activeTab === 'quotas' && <QuotaAllocation />}
          {activeTab === 'statistics' && <Statistics />}
      </div>
    </div>
  );
};

export default AdminDashboard;