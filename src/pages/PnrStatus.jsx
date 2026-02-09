import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaSearch, FaTrain } from "react-icons/fa";
import "./PnrStatus.scss";
import BackButton from "../components/BackButton"; 

const PnrStatus = () => {
  const [pnr, setPnr] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = () => {
    if (!pnr) {
      alert("Please enter a valid PNR number!");
      return;
    }

    setLoading(true);
    setBookingData(null); 

    setTimeout(() => {
      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const foundTicket = existingBookings.find(ticket => ticket.pnr === pnr);

      if (foundTicket) {
       
        const passengersWithStatus = foundTicket.passengers.map(p => ({
          ...p,
          
          coach: `S${Math.floor(Math.random() * 10) + 1}`,
          seat: Math.floor(Math.random() * 60) + 1
        }));

        
        setBookingData({ ...foundTicket, passengers: passengersWithStatus });
      } else {
        alert("PNR Number not found! Please check the number and try again.");
      }
      
      setLoading(false);
    }, 1000); 
  };

  return (
    <div className="pnr-page">
      <Navbar />
       <div style={{ alignSelf: 'flex-start', width: '100%', marginBottom: '10px' }}>
            <BackButton />
          </div>
      <div className="pnr-container">
        <div className="pnr-card">
         
          <h2 className="pnr-title">Check PNR Status</h2>
          
          <label className="pnr-label">Enter PNR Number</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Enter your PNR number" 
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
            />
            <button className="check-btn" onClick={handleCheckStatus}>
              {loading ? "Searching..." : (
                <>
                  <FaSearch /> Check Status
                </>
              )}
            </button>
          </div>
        </div>

        {bookingData && (
          <div className="status-result">
            <div className="result-header">
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <FaTrain size={20} /> 
                <span style={{fontSize:'18px'}}>
                  {bookingData.train?.name || bookingData.trainName || "Train Details"}
                </span>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'12px', opacity:0.8}}>Journey Date</div>
                <div>{bookingData.date || bookingData.train?.date}</div>
              </div>
            </div>

            <div 
            style={{padding: '15px 25px',
             borderBottom: '1px solid #eee', 
             color:'#555'}}>
               <strong>Route:</strong> {bookingData.train?.from || bookingData.from} ➝ {bookingData.train?.to || bookingData.to}
            </div>

            <div className="passenger-table">
              <h4 style={{marginBottom:'15px', color:'#333'}}>Passenger Status</h4>
              
              {bookingData.passengers && bookingData.passengers.length > 0 ? (
                bookingData.passengers.map((p, index) => (
                  <div key={index} className="passenger-row">
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                      <span style={{fontWeight:'bold', color:'#444'}}>{index + 1}.</span>
                      <div>
                        <div style={{fontWeight:'600'}}>{p.name}</div>
                        <div style={{fontSize:'12px', color:'#777'}}>{p.age} yrs | {p.gender}</div>
                      </div>
                    </div>
                    
                   
                    <span className="status-badge">
                      CNF / {p.coach} / {p.seat}
                    </span>
                  </div>
                ))
              ) : (
                <p>No passenger details found.</p>
              )}
            </div>
            
            <div style={{padding:'15px', background:'#f9f9f9', textAlign:'center', fontSize:'13px', color:'#666'}}>
              Total Fare: <strong>₹{bookingData.totalAmount}</strong>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PnrStatus;