

import React, { useState, useEffect } from 'react';
import './QuotaAllocation.scss';
import { FaEdit, FaCog, FaSave, FaTimes } from 'react-icons/fa';

const QuotaAllocation = () => {
  const [quotas, setQuotas] = useState([]); // Now empty by default
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});



  // FETCH DATA FROM BACKEND
  const fetchQuotas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8082/api/quotas/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuotas(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

 useEffect(() => {
  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8082/api/quotas/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuotas(data); // This is now safe
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  loadInitialData();
}, []);
  const handleEditClick = (item) => {
    setEditId(item.id); // Matches Spring model 'id'
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
      [name]: name === 'pct' ? Number(value) : value 
    });
  };

  // SAVE TO DATABASE
  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/quotas/update/${editId}`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setEditId(null);
        fetchQuotas(); // Refresh chart and table
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const totalPercentage = quotas.reduce((acc, curr) => acc + curr.pct, 0);
 const rules = [
    { title: 'General Quota', rule: 'Opens 120 days before journey date' },
    { title: 'Tatkal Quota', rule: 'Opens 1 day before journey (10:00 AM for AC, 11:00 AM for non-AC)' },
    { title: 'Premium Tatkal', rule: 'Opens 1 day before with dynamic pricing' },
    { title: 'Ladies Quota', rule: 'Released to general quota 30 minutes before departure if not filled' },
  ];
  return (
    <div className="quota-container">
      <div className="quota-header-row">
        <h3><FaCog style={{marginRight: '10px'}}/> Quota Allocation Management</h3>
        <div 
          className="total-badge" 
          style={{ backgroundColor: totalPercentage > 100 ? '#fee2e2' : '#d1fae5', color: totalPercentage > 100 ? '#991b1b' : '#065f46' }}
        >
          Total: {totalPercentage}%
        </div>
      </div>

      {/* CHART: Adjusts dynamically based on item.pct */}
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

      <div className="section-card">
        <table className="quota-table">
          <thead>
            <tr>
              <th>Quota Type</th>
              <th>Description</th>
              <th>Allocation (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotas.map((item) => (
              <tr key={item.id}>
                {editId === item.id ? (
                  <>
                    <td><div className="q-label-cell"><span className="dot" style={{backgroundColor: item.color}}></span>{item.label}</div></td>
                    <td><input type="text" name="desc" value={editFormData.desc} onChange={handleChange} className="edit-input-quota" /></td>
                    <td><input type="number" name="pct" value={editFormData.pct} onChange={handleChange} className="edit-input-quota small" /></td>
                    <td>
                       <button className="icon-btn save" onClick={handleSaveClick}><FaSave /></button>
                       <button className="icon-btn cancel" onClick={handleCancelClick}><FaTimes /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><div className="q-label-cell"><span className="dot" style={{backgroundColor: item.color}}></span>{item.label}</div></td>
                    <td className="desc-text">{item.desc}</td>
                    <td className="pct-text">{item.pct}%</td>
                    <td><button className="q-edit-btn" onClick={() => handleEditClick(item)}>Edit</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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