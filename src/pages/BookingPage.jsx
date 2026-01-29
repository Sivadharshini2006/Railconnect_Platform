import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrain, FaPlus, FaTrash, FaUser, FaTimes, FaPhoneAlt, FaEnvelope, FaCheckCircle } from 'react-icons/fa'; // Added Icons
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passengers, setPassengers] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    mobile: '',
    email: ''
  });
  

  const [isAgreed, setIsAgreed] = useState(false);

  const train = location.state?.train || { 
    name: "Mumbai Rajdhani (12952)", from: "NDLS", to: "MMCT", date: "26 Jan", price: 2050 
  };

  const handleAddPassenger = (newPassenger) => {
    setPassengers([...passengers, newPassenger]);
    setIsModalOpen(false);
  };

  const removePassenger = (index) => {
    const newDocs = [...passengers];
    newDocs.splice(index, 1);
    setPassengers(newDocs);
  };

  // --- NEW: Validation and Proceed Logic ---
  const handleProceedToPay = () => {
    // 1. Check Passengers
    if (passengers.length === 0) {
      alert("Please add at least one passenger to proceed!");
      return;
    }

    // 2. Check Contact Details
    if (!contactInfo.mobile || contactInfo.mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!contactInfo.email || !contactInfo.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    // 3. Check Agreement
    if (!isAgreed) {
      alert("Please accept the terms and conditions.");
      return;
    }

    // 4. Navigate
    navigate('/payment', { 
      state: { 
        train: train, 
        passengers: passengers, 
        contactInfo: contactInfo, // Passing contact info to payment
        totalAmount: train.price * passengers.length 
      } 
    });
  };

  return (
    <div className="page-wrapper" >
       <div className="navbar-wrapper">
         <Navbar />
      </div>
      <div className="booking-container">
        <div className="left-section">
          {/* Train Details Card */}
          <div className="card train-summary">
            <div className="ts-header">
              <h3>{train.name}</h3>
              <span className="badge-ac">3A</span>
            </div>
            <div className="ts-route">
              <div><strong>04:00</strong> <span>{train.from}</span></div>
              <div className="line-sep">---------- 15h 40m ----------</div>
              <div><strong>23:55</strong> <span>{train.to}</span></div>
            </div>
            <div className="ts-date">📅 {train.date} • {passengers.length} Traveller(s)</div>
          </div>

          {/* Passenger List */}
          <div className="card passenger-section">
            <div className="sec-head">
               <h3>Passenger Details</h3>
               <span style={{fontSize:'12px', color:'#666'}}>{passengers.length} Added</span>
            </div>

            {/* List of added passengers */}
            {passengers.length === 0 && (
                <div className="empty-state">No passengers added yet.</div>
            )}

            {passengers.map((p, idx) => (
              <div key={idx} className="added-pax-row">
                 <div>
                   <div style={{fontWeight:'bold'}}>{p.name}</div>
                   <div style={{fontSize:'12px', color:'#666'}}>{p.age} yrs | {p.gender} | {p.berth}</div>
                 </div>
                 <button onClick={() => removePassenger(idx)} className="trash-btn"><FaTrash /></button>
              </div>
            ))}

            {/* Add Button */}
            <button className="add-pax-btn" onClick={() => setIsModalOpen(true)}>
              <FaPlus /> Add New Passenger
            </button>
          </div>

          {/* --- NEW SECTION: Contact Details --- */}
          <div className="card contact-section">
            <div className="sec-head">
               <h3>Contact Details</h3>
               <span style={{fontSize:'12px', color:'#666'}}>Ticket will be sent here</span>
            </div>
            <div className="contact-form">
                <div className="input-group">
                    <FaPhoneAlt className="c-icon"/>
                    <input 
                        type="number" 
                        placeholder="Mobile Number" 
                        value={contactInfo.mobile}
                        onChange={(e) => setContactInfo({...contactInfo, mobile: e.target.value})}
                    />
                </div>
                <div className="input-group">
                    <FaEnvelope className="c-icon"/>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Fare Summary (Right Side) */}
        <div className="right-section">
          <div className="card fare-card">
            <h3>Fare Summary</h3>
            <div className="fare-row"><span>Base Fare</span> <span>₹{train.price}</span></div>
            <div className="fare-row"><span>Passengers</span> <span>x {passengers.length}</span></div>
            <div className="divider"></div>
            <div className="fare-total">
              <span>Total Amount</span>
              <span>₹{train.price * (passengers.length || 0)}</span>
            </div>

            {/* --- NEW: Terms Checkbox --- */}
            <div className="terms-box">
                <input 
                    type="checkbox" 
                    id="agree" 
                    checked={isAgreed} 
                    onChange={(e) => setIsAgreed(e.target.checked)} 
                />
                <label htmlFor="agree">I agree to the Cancellation Policy & Terms of Service.</label>
            </div>

            {/* Updated Pay Button Logic */}
            <button 
              className={`pay-btn-main ${!isAgreed ? 'disabled' : ''}`} 
              onClick={handleProceedToPay}
            >
              Pay & Book
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL COMPONENT (The Popup) --- */}
      {isModalOpen && (
        <PassengerModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddPassenger} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: The Modal Form ---
const PassengerModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', berth: 'No Preference', nationality: 'India'
  });

  const handleSubmit = () => {
    if(!formData.name || !formData.age) return alert("Please fill details");
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Passenger</h3>
          <button onClick={onClose} className="close-icon"><FaTimes /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Full name as per Govt. ID</label>
            <input type="text" placeholder="Enter full name" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" placeholder="Enter age" 
              value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
              {['Male', 'Female', 'Transgender'].map(g => (
                <label key={g} className={`radio-btn ${formData.gender === g ? 'active' : ''}`}>
                  <input type="radio" name="gender" checked={formData.gender === g} onChange={() => setFormData({...formData, gender: g})} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Berth Preference</label>
            <select value={formData.berth} onChange={e => setFormData({...formData, berth: e.target.value})}>
              <option>No Preference</option>
              <option>Lower</option>
              <option>Middle</option>
              <option>Upper</option>
              <option>Side Lower</option>
            </select>
          </div>

          <div className="concession-box">
             No concessions are allowed in this train
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSubmit}>Save Passenger</button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;