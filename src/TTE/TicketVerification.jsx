import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaIdCard } from "react-icons/fa";
import "./ReservationCharts.scss"; 
import Navbartte from "./Navbartte";

const TicketVerification = () => {
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    setResult(null);
    setError("");

    if (!pnr) {
        setError("Please enter a PNR number.");
        return;
    }

    
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    
  
    const foundBooking = allBookings.find(b => b.pnr === pnr);

  
    if (foundBooking) {
      setResult(foundBooking);
    } else {
      setError("PNR not found in the system. Please check the number.");
    }
  };

  return (
    <div className="chart-page-wrapper">
      <Navbartte />
      
     
      <div className="chart-container-full">
        
        <h2 className="page-title" style={{ fontSize: '26px', marginBottom: '25px' }}>
          Ticket Verification
        </h2>

       
        <div className="chart-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaIdCard size={24} color="#0d6efd"/>
              <h3 className="section-title" style={{ margin: 0, fontSize: '20px' }}>Verify Passenger Ticket</h3>
          </div>
          
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             
         
             <div style={{ display: 'flex', gap: '15px', alignItems: 'stretch' }}>
                <input 
                  type="text" 
                  placeholder="Enter 10-digit PNR Number"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  style={{
                      flex: 1, 
                      padding: '12px 20px',
                      fontSize: '14px', 
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      outline: 'none',
                      backgroundColor: '#f8f9fa'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                
                <button type="submit" className="generate-btn" style={{ 
                    width: '150px', 
                    fontSize: '16px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    borderRadius: '8px' 
                }}>
                    <FaSearch style={{ marginRight: '8px' }} /> Verify
                </button>
             </div>

          </form>
        </div>

        {/* --- RESULT SECTION --- */}
        {result && (
           <div className="chart-results fade-in" style={{ marginTop: '30px', padding: '30px' }}>
              <div className="result-top-bar" style={{ justifyContent:'flex-start', gap:'20px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                  <FaCheckCircle size={40} color="#28a745" />
                  <div>
                    <h2 className="train-title" style={{ fontSize: '22px' }}>PNR Verified: {result.pnr}</h2>
                    <div className="train-subtitle" style={{ fontSize: '16px' }}>
                        {result.trainName} • <span style={{ color: '#555' }}>{result.date}</span>
                    </div>
                  </div>
              </div>

              <h4 style={{ marginTop: '25px', marginBottom: '15px', color: '#444', fontSize: '18px' }}>Passenger List</h4>
              
              <div className="table-responsive">
                <table className="chart-table">
                   <thead>
                      <tr style={{ background: '#f1f3f5' }}>
                         <th style={{ padding: '15px' }}>S.No</th>
                         <th style={{ padding: '15px' }}>Name</th>
                         <th style={{ padding: '15px' }}>Age / Gender</th>
                         <th style={{ padding: '15px' }}>Seat Number</th>
                         <th style={{ padding: '15px' }}>Current Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      {result.passengers.map((p, index) => (
                         <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px' }}>{index + 1}</td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>{p.name}</td>
                            <td style={{ padding: '15px' }}>{p.age} / {p.gender}</td>
                            <td style={{ padding: '15px', color: '#0d6efd', fontWeight: '600' }}>S5 - {12 + index}</td>
                            <td style={{ padding: '15px' }}>
                                
                                <span style={{
                                    background: '#d4edda', 
                                    color: '#155724', 
                                    padding: '6px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '15px', 
                                    fontWeight: 'bold',
                                    border: '1px solid #c3e6cb'
                                }}>
                                  CONFIRMED
                                </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        
        {error && (
            <div style={{
                marginTop: '25px', 
                padding: '20px', 
                background: '#fff5f5', 
                color: '#c62828', 
                borderRadius: '8px', 
                border: '1px solid #ffc9c9',
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                fontWeight: '500',
                fontSize: '16px'
            }}>
               <FaTimesCircle size={24} /> 
               {error}
            </div>
        )}

      </div>
    </div>
  );
};

export default TicketVerification;