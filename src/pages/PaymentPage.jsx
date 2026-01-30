import React, { useState, useEffect,useContext } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'; 

import { FaCreditCard, FaMobileAlt, FaWallet, FaUniversity, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import './PaymentPage.scss'; 

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
const { user } = useContext(AuthContext);
  
  const { train, passengers, totalAmount } = location.state || {};

  const [activeTab, setActiveTab] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  
 useEffect(() => {
    
    if (!train) {
      alert("No active booking session found. Please search for a train first.");
      navigate('/');
    }
  }, [train, navigate]);
  
  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      
      const newTicket = {
       pnr: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      train: location.state.train, 
      passengers: location.state.passengers, 
      totalAmount: location.state.totalAmount,
      date: new Date().toLocaleDateString(),
      
   
      email: user.email, 
      userId: user.email 
    };

  
     const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    existingBookings.push(newTicket);
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

      alert(`Payment Successful via ${activeTab.toUpperCase()}! PNR: ${newTicket.pnr}`);
      
      
      navigate('/my-bookings'); 
    }, 2000);
  };

  if (!train) return null;

  return (
    <div>
      <Navbar />
      
      <div className="payment-wrapper">
        
     
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <div>
            <h2>Payment Details</h2>
            <p>Complete your purchase securely</p>
          </div>
        </div>

        <div className="payment-grid">

          <div className="payment-left">
            
         
            <div className="method-tabs">
              <div 
                className={`method-box ${activeTab === 'upi' ? 'active' : ''}`} 
                onClick={() => setActiveTab('upi')}
              >
                <div className="m-icon"><FaMobileAlt /></div>
                <span>UPI</span>
              </div>

              <div 
                className={`method-box ${activeTab === 'card' ? 'active' : ''}`} 
                onClick={() => setActiveTab('card')}
              >
                <div className="m-icon"><FaCreditCard /></div>
                <span>Card</span>
              </div>

              <div 
                className={`method-box ${activeTab === 'wallet' ? 'active' : ''}`} 
                onClick={() => setActiveTab('wallet')}
              >
                <div className="m-icon"><FaWallet /></div>
                <span>Wallet</span>
              </div>

              <div 
                className={`method-box ${activeTab === 'netbanking' ? 'active' : ''}`} 
                onClick={() => setActiveTab('netbanking')}
              >
                <div className="m-icon"><FaUniversity /></div>
                <span>Net Banking</span>
              </div>
            </div>

           
            <div className="payment-form">
   
              {activeTab === 'upi' && (
                <form onSubmit={handlePayment}>
                  <label>Virtual Payment Address (VPA)</label>
                  <input type="text" className="pay-input" placeholder="e.g. 9876543210@upi" required />
                  <button type="submit" className="pay-confirm-btn">
                    {isProcessing ? 'Verifying...' : `Pay ₹${totalAmount}`}
                  </button>
                </form>
              )}

              
              {activeTab === 'card' && (
                <form onSubmit={handlePayment}>
                  <label>Card Number</label>
                  <input type="text" className="pay-input" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required />
                  
                  <div style={{display:'flex', gap:'15px'}}>
                    <div style={{flex:1}}>
                      <label>Expiry Date</label>
                      <input type="text" className="pay-input" placeholder="MM/YY" required />
                    </div>
                    <div style={{flex:1}}>
                      <label>CVV</label>
                      <input type="password" className="pay-input" placeholder="123" maxLength="3" required />
                    </div>
                  </div>

                  <label>Card Holder Name</label>
                  <input type="text" className="pay-input" placeholder="Name on card" required />
                  
                  <button type="submit" className="pay-confirm-btn">
                    {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
                  </button>
                </form>
              )}

            
              {activeTab === 'wallet' && (
                <form onSubmit={handlePayment}>
                  <label>Select Digital Wallet</label>
                  <select className="pay-input">
                    <option>Paytm Wallet</option>
                    <option>PhonePe Wallet</option>
                    <option>Amazon Pay</option>
                    <option>Freecharge</option>
                    <option>Mobikwik</option>
                  </select>
                  
                  <label>Mobile Number linked to Wallet</label>
                  <input type="number" className="pay-input" placeholder="Enter 10 digit number" required />

                  <button type="submit" className="pay-confirm-btn">
                    {isProcessing ? 'Connecting...' : `Pay ₹${totalAmount}`}
                  </button>
                </form>
              )}

              {activeTab === 'netbanking' && (
                <form onSubmit={handlePayment}>
                  <label>Select Bank</label>
                  <select className="pay-input">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                  </select>

                  <div style={{marginBottom:'15px', fontSize:'13px', color:'#666'}}>
                    Note: You will be redirected to your bank's secure website to complete the payment.
                  </div>

                  <button type="submit" className="pay-confirm-btn">
                    {isProcessing ? 'Redirecting...' : `Pay ₹${totalAmount}`}
                  </button>
                </form>
              )}

            </div>
          </div>

          <div className="payment-right">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Train</span>
                <span style={{fontWeight:'bold'}}>{train.name}</span>
              </div>
              
              <div className="summary-row">
                <span>Date</span>
                <span>{train.date}</span>
              </div>

              <div className="summary-row">
                <span>Passengers</span>
                <span>{passengers.length} Traveller(s)</span>
              </div>
              
              <div className="summ-divider"></div>
              
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="blue-text">₹{totalAmount}</span>
              </div>

            
              <div className="secure-badge">
                <div className="secure-icon"><FaShieldAlt size={20} /></div>
                <div>
                  <strong>100% Secure Payment</strong>
                  <p>Your data is encrypted and safe.</p>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;