import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./MyBookings.scss";
import BackButton from "../components/BackButton";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getFilteredBookings = (currentUser) => {
    if (!currentUser) return [];
    try {
      const rawData = localStorage.getItem("bookings") || "[]";
      const allTickets = JSON.parse(rawData);
      return allTickets.filter(
        (ticket) => ticket.email === currentUser.email || ticket.contactInfo?.email === currentUser.email
      );
    } catch (error) {
      console.error("Error parsing bookings:", error);
      return [];
    }
  };

  
  const [bookings, setBookings] = useState(() => getFilteredBookings(user));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  
  const handleCancel = (pnrToCancel) => {
    if (window.confirm(`Are you sure you want to cancel PNR: ${pnrToCancel}?`)) {
      
      
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
     
      const updatedAllBookings = allBookings.filter(b => b.pnr !== pnrToCancel);
      
     
      localStorage.setItem("bookings", JSON.stringify(updatedAllBookings));

  
      setBookings(getFilteredBookings(user));
    }
  };

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="bookings-container">
        <div style={{ alignSelf: 'flex-start', width: '100%', marginBottom: '10px' }}>
            <BackButton />
          </div>
        

        {bookings.length === 0 ? (
          <div className="no-data">
            <p>You haven't booked any tickets yet.</p>
            <button onClick={() => navigate("/")} className="book-now-btn">
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {bookings.map((ticket, index) => (
              <div key={index} className="ticket-card">
                <div className="ticket-header">
                  <h3>🚆 {ticket.train?.name || ticket.trainName}</h3>
                  <span className="pnr">PNR: {ticket.pnr}</span>
                </div>
                
                <div className="ticket-body">
                  <div className="route-info">
                    <p><strong>From:</strong> {ticket.train?.from || ticket.from}</p>
                    <p><strong>To:</strong> {ticket.train?.to || ticket.to}</p>
                    <p><strong>Date:</strong> {ticket.train?.date || ticket.date}</p>
                  </div>
                  
                  <div className="passenger-list">
                      <h4>Passengers:</h4>
                      <ul>
                        {(ticket.passengers || []).map((p, i) => (
                          <li key={i}>{p.name} ({p.gender}, {p.age})</li>
                        ))}
                      </ul>
                  </div>
                </div>

                <div className="ticket-footer">
                   <div className="status-section">
                       <span className="status confirmed">● Booked</span>
                       <span className="price">₹{ticket.totalAmount}</span>
                   </div>
                   {/* Cancel Button - Uses the handleCancel function */}
                   <button 
                     className="cancel-btn"
                     style={{ marginLeft: 'auto', background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                     onClick={() => handleCancel(ticket.pnr)}
                   >
                     Cancel
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}