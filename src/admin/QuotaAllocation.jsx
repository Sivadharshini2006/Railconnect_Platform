import React, { useState } from 'react';
import './QuotaAllocation.css';
import { FaEdit, FaCog, FaSave, FaTimes } from 'react-icons/fa';

const QuotaAllocation = () => {
  // --- STATE MANAGEMENT ---
  const [quotas, setQuotas] = useState([
    { id: 1, label: 'General Quota', desc: 'Available to all passengers for regular booking', pct: 50, color: '#3b82f6' },
    { id: 2, label: 'Tatkal Quota', desc: 'Opens 24 hours before departure for urgent bookings', pct: 10, color: '#f97316' },
    { id: 3, label: 'Ladies Quota', desc: 'Reserved for female passengers', pct: 8, color: '#ec4899' },
    { id: 4, label: 'Senior Citizen', desc: 'For senior citizens (60+ male, 58+ female)', pct: 8, color: '#a855f7' },
    { id: 5, label: 'Lower Berth Quota', desc: 'For senior citizens and passengers with medical conditions', pct: 10, color: '#22c55e' },
    { id: 6, label: 'Premium Tatkal', desc: 'Dynamic pricing for last-minute bookings', pct: 5, color: '#ef4444' },
    { id: 7, label: 'RAC', desc: 'Reservation Against Cancellation', pct: 5, color: '#eab308' },
    { id: 8, label: 'Others', desc: 'VIP, Parliament, Defence quotas', pct: 4, color: '#64748b' },
  ]);

  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // --- HANDLERS ---
  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditFormData(item);
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'pct' ? Number(value) : value // Ensure percentage is a number
    });
  };

  const handleSaveClick = () => {
    const updatedQuotas = quotas.map((q) => (q.id === editId ? editFormData : q));
    setQuotas(updatedQuotas);
    setEditId(null);
  };

  // Calculate Total Percentage Dynamically
  const totalPercentage = quotas.reduce((acc, curr) => acc + curr.pct, 0);

  // --- STATIC RULES DATA ---
  const rules = [
    { title: 'General Quota', rule: 'Opens 120 days before journey date' },
    { title: 'Tatkal Quota', rule: 'Opens 1 day before journey (10:00 AM for AC, 11:00 AM for non-AC)' },
    { title: 'Premium Tatkal', rule: 'Opens 1 day before with dynamic pricing' },
    { title: 'Ladies Quota', rule: 'Released to general quota 30 minutes before departure if not filled' },
  ];

  return (
    <div className="quota-container">
      
      {/* 1. HEADER */}
      <div className="quota-header-row">
        <h3><FaCog style={{marginRight: '10px'}}/> Quota Allocation Management</h3>
        <div 
          className="total-badge" 
          style={{ backgroundColor: totalPercentage > 100 ? '#fee2e2' : '#d1fae5', color: totalPercentage > 100 ? '#991b1b' : '#065f46' }}
        >
          Total: {totalPercentage}%
        </div>
      </div>

      {/* 2. VISUAL DISTRIBUTION BAR (Updates Automatically) */}
      <div className="section-card">
        <h4 className="card-title">Quota Distribution</h4>
        <div className="quota-progress-bar">
          {quotas.map((item) => (
            <div 
              key={item.id} 
              className="q-bar-segment" 
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.pct}%`}
            >
              {item.pct >= 5 && <span className="bar-text">{item.pct}%</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 3. DETAILED TABLE WITH EDITING */}
      <div className="section-card">
        <table className="quota-table">
          <thead>
            <tr>
              <th style={{width: '20%'}}>Quota Type</th>
              <th style={{width: '55%'}}>Description</th>
              <th style={{width: '10%'}}>Allocation (%)</th>
              <th style={{width: '15%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotas.map((item) => (
              <tr key={item.id}>
                {editId === item.id ? (
                  /* EDIT MODE ROW */
                  <>
                    <td>
                      <div className="q-label-cell">
                        <span className="dot" style={{backgroundColor: item.color}}></span>
                        {item.label} 
                      </div>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="desc" 
                        value={editFormData.desc} 
                        onChange={handleChange} 
                        className="edit-input-quota"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        name="pct" 
                        value={editFormData.pct} 
                        onChange={handleChange} 
                        className="edit-input-quota small"
                      />
                    </td>
                    <td>
                       <button className="icon-btn save" onClick={handleSaveClick} title="Save"><FaSave /></button>
                       <button className="icon-btn cancel" onClick={handleCancelClick} title="Cancel"><FaTimes /></button>
                    </td>
                  </>
                ) : (
                  /* VIEW MODE ROW */
                  <>
                    <td>
                      <div className="q-label-cell">
                        <span className="dot" style={{backgroundColor: item.color}}></span>
                        {item.label}
                      </div>
                    </td>
                    <td className="desc-text">{item.desc}</td>
                    <td className="pct-text">{item.pct}%</td>
                    <td>
                      <button className="q-edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. RULES GRID */}
      <div className="rules-section">
        <h4 style={{marginBottom: '15px', color: '#333'}}>Quota Opening Times</h4>
        <div className="rules-grid">
          {rules.map((r, index) => (
            <div className="rule-card" key={index}>
              <h5>{r.title}</h5>
              <p>{r.rule}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default QuotaAllocation;