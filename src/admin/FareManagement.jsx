import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './FareManagement.scss';

const initialFares = [
  { id: 1, className: "1A (First AC)", baseRate: 500, perKm: 6.5, tatkal: 400, reservation: 50 },
  { id: 2, className: "2A (Second AC)", baseRate: 350, perKm: 4.5, tatkal: 300, reservation: 50 },
  { id: 3, className: "3A (Third AC)", baseRate: 250, perKm: 3, tatkal: 200, reservation: 40 },
  { id: 4, className: "SL (Sleeper)", baseRate: 150, perKm: 1.5, tatkal: 100, reservation: 30 },
  { id: 5, className: "2S (Second Sitting)", baseRate: 80, perKm: 0.8, tatkal: 50, reservation: 20 },
];

const FareManagement = () => {
  const [fares, setFares] = useState(initialFares);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  
  const handleEditClick = (fare) => {
    setEditId(fare.id);
    setEditFormData(fare);
  };

  const handleCancelClick = () => {
    setEditId(null);
  };

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = () => {
    const updatedFares = fares.map((fare) => 
      fare.id === editId ? { ...editFormData, 
          
          baseRate: Number(editFormData.baseRate),
          perKm: Number(editFormData.perKm),
          tatkal: Number(editFormData.tatkal),
          reservation: Number(editFormData.reservation)
      } : fare
    );
    setFares(updatedFares);
    setEditId(null);
  };

  return (
    <div className="fare-page-container">
      
     
      <div className="fare-header-section">
        <h3>Fare Management</h3>
        <p className="fare-subtitle">Configure base rates, per-kilometer charges, and additional fees for different classes.</p>
      </div>

     
      <div className="fare-table-card">
        <table className="fare-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Base Rate (₹)</th>
              <th>Per KM (₹)</th>
              <th>Tatkal Charge (₹)</th>
              <th>Reservation (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fares.map((fare) => (
              <tr key={fare.id} className={editId === fare.id ? "fare-edit-row" : ""}>
                
                
                <td className="class-name">{fare.className}</td>

                {editId === fare.id ? (
                 
                  <>
                    <td><input type="number" name="baseRate" value={editFormData.baseRate} onChange={handleChange} className="fare-input" /></td>
                    <td><input type="number" name="perKm" value={editFormData.perKm} onChange={handleChange} className="fare-input" step="0.1" /></td>
                    <td><input type="number" name="tatkal" value={editFormData.tatkal} onChange={handleChange} className="fare-input" /></td>
                    <td><input type="number" name="reservation" value={editFormData.reservation} onChange={handleChange} className="fare-input" /></td>
                    <td>
                      <button className="fare-action-btn save" onClick={handleSaveClick}><FaSave /></button>
                      <button className="fare-action-btn cancel" onClick={handleCancelClick}><FaTimes /></button>
                    </td>
                  </>
                ) : (
                 
                  <>
                    <td>₹{fare.baseRate}</td>
                    <td>₹{fare.perKm}</td>
                    <td>₹{fare.tatkal}</td>
                    <td>₹{fare.reservation}</td>
                    <td>
                      <button className="fare-btn-primary" onClick={() => handleEditClick(fare)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="fare-info-container">
        
      
        <div className="fare-info-card">
          <h4>Fare Calculator (Example)</h4>
          <div className="formula-box">
            <p className="formula-label">Formula:</p>
            <code className="formula-text">
              Total Fare = Base Rate + (Distance × Per KM Rate) + Reservation Charge + GST (5%)
            </code>
            <p className="example-text">
              Example for 3A class (500 km):<br/>
              <strong>₹250 + (500 × ₹3.0) + ₹40 = ₹1,790 + GST = ₹1,879.50</strong>
            </p>
          </div>
        </div>

        
        <div className="fare-info-card">
          <h4>Dynamic Pricing Rules</h4>
          <ul className="rules-list">
            <li>
              <strong>Tatkal Booking</strong><br/>
              Additional charges apply for bookings made within 24 hours of departure
            </li>
            <li>
              <strong>Senior Citizen Discount</strong><br/>
              40% discount for male senior citizens (60+) and 50% for female senior citizens (58+)
            </li>
            <li>
              <strong>Children Fare</strong><br/>
              50% discount for children aged 5-12 years
            </li>
            <li>
              <strong>Cancellation Charges</strong>
              <ul>
                <li>More than 48 hours before departure: ₹240 per passenger</li>
                <li>12-48 hours: 25% of fare</li>
                <li>Less than 12 hours: 50% of fare</li>
              </ul>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};

export default FareManagement;