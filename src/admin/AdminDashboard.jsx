import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrain, FaMapMarkerAlt, FaDollarSign, FaCogs, 
  FaChartPie, FaPlus, FaRegEdit, FaRegTrashAlt, 
  FaSave, FaTimes, FaSignOutAlt 
} from 'react-icons/fa';
import './Admin.scss'; // Ensure this imports your new SCSS styles

import Statistics from './Statistics';
import StationManagement from './StationManagement'; 
import FareManagement from './FareManagement'; 
import QuotaAllocation from './QuotaAllocation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trains'); 

  const handleLogout = () => {
    navigate('/');
  };

  // --- EXISTING LOGIC (Unchanged) ---
  const [trains, setTrains] = useState(() => {
    const stored = localStorage.getItem('adminTrains');
    return stored ? JSON.parse(stored) : [];
  });
  const [editTrainId, setEditTrainId] = useState(null); 
  const [editFormData, setEditFormData] = useState({}); 

  const handleEditClick = (train) => { setEditTrainId(train.id); setEditFormData(train); };
  const handleCancelClick = () => { setEditTrainId(null); setEditFormData({}); };
  const handleEditFormChange = (e) => { setEditFormData({ ...editFormData, [e.target.name]: e.target.value }); };
  const handleSaveClick = () => {
    const updatedTrains = trains.map((train) => train.id === editTrainId ? editFormData : train);
    setTrains(updatedTrains);
    localStorage.setItem('adminTrains', JSON.stringify(updatedTrains));
    setEditTrainId(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this train?")) {
        const updatedTrains = trains.filter(t => t.id !== id);
        setTrains(updatedTrains);
        localStorage.setItem('adminTrains', JSON.stringify(updatedTrains));
    }
  };

  return (
    <div className="page-wrapper">
      
      {/* ===== UPDATED HEADER (Matches TTE Style) ===== */}
      <nav className="tte-navbar">
        <div className="navbar-container">
          
          {/* Brand */}
          <div className="navbar-brand">
            <FaTrain className="brand-icon" />
            <div className="brand-text">
              <h1 className="brand-title">RailConnect</h1>
              <span className="brand-subtitle">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="navbar-links">
            <div 
                className={`nav-link ${activeTab === 'trains' ? 'active' : ''}`}
                onClick={() => setActiveTab('trains')}
                style={{cursor: 'pointer'}}
            >
                <FaTrain className="nav-icon" /> Train Management
            </div>
            
            <div 
                className={`nav-link ${activeTab === 'stations' ? 'active' : ''}`}
                onClick={() => setActiveTab('stations')}
                style={{cursor: 'pointer'}}
            >
                <FaMapMarkerAlt className="nav-icon" /> Stations
            </div>

            <div 
                className={`nav-link ${activeTab === 'fares' ? 'active' : ''}`} 
                onClick={() => setActiveTab('fares')}
                style={{cursor: 'pointer'}}
            >
                <FaDollarSign className="nav-icon" /> Fare Management
            </div>
            
            <div 
                className={`nav-link ${activeTab === 'quotas' ? 'active' : ''}`} 
                onClick={() => setActiveTab('quotas')}
                style={{cursor: 'pointer'}}
            >
                <FaCogs className="nav-icon" /> Quota Allocation
            </div>

            <div 
                className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`} 
                onClick={() => setActiveTab('statistics')}
                style={{cursor: 'pointer'}}
            >
                <FaChartPie className="nav-icon" /> Statistics
            </div>
          </div>

          
          <button 
  onClick={handleLogout}
  style={{ 
    background: '#dc3545', 
    color: 'white', 
    border: 'none', 
    padding: '8px 25px',
    borderRadius: '25px', 
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
    marginLeft: 'auto' 
  }}
  onMouseOver={(e) => e.currentTarget.style.background = '#c82333'} 
  onMouseOut={(e) => e.currentTarget.style.background = '#dc3545'}
>
  Logout
</button>

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
                                  <th>Train Number</th><th>Name</th><th>Route</th><th>Timing</th><th>Frequency</th><th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {trains.map((train) => (
                                  <React.Fragment key={train.id}>
                                      {editTrainId === train.id ? (
                                          <tr className="edit-row">
                                              <td><input type="text" name="number" value={editFormData.number} onChange={handleEditFormChange} className="edit-input small" /></td>
                                              <td><input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="edit-input" /></td>
                                              <td><input type="text" name="route" value={editFormData.route} onChange={handleEditFormChange} className="edit-input" /></td>
                                              <td><input type="text" name="timing" value={editFormData.timing} onChange={handleEditFormChange} className="edit-input small" /></td>
                                              <td>
                                                  <select name="frequency" value={editFormData.frequency} onChange={handleEditFormChange} className="edit-input">
                                                      <option value="Daily">Daily</option>
                                                      <option value="Mon,Wed,Fri">Mon,Wed,Fri</option>
                                                      <option value="Weekly">Weekly</option>
                                                  </select>
                                              </td>
                                              <td className="action-cell">
                                                  <button className="action-btn save-icon" onClick={handleSaveClick}><FaSave /></button>
                                                  <button className="action-btn cancel-icon" onClick={handleCancelClick}><FaTimes /></button>
                                              </td>
                                          </tr>
                                      ) : (
                                          <tr>
                                              <td style={{fontWeight:'bold'}}>{train.number}</td>
                                              <td>{train.name}</td><td>{train.route}</td><td>{train.timing}</td><td>{train.frequency}</td>
                                              <td className="action-cell">
                                                  <button className="action-btn edit-icon" onClick={() => handleEditClick(train)}><FaRegEdit /></button>
                                                  <button className="action-btn delete-icon" onClick={() => handleDelete(train.id)}><FaRegTrashAlt /></button>
                                              </td>
                                          </tr>
                                      )}
                                  </React.Fragment>
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