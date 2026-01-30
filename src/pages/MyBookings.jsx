import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./MyBookings.scss";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
  
    if (!user) {
      navigate("/login");
      return;
    }

    
    const rawData = localStorage.getItem("bookings") || "[]";
    const allTickets = JSON.parse(rawData);

    
    const myTickets = allTickets.filter(
      (ticket) => ticket.email === user.email || ticket.contactInfo?.email === user.email
    );

    setBookings(myTickets);
  }, [user, navigate]);

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="bookings-container">
        <h2>My Bookings</h2>

        {/* Dynamic Empty State */}
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
                   <span className="status confirmed">● Booked</span>
                   <span className="price">₹{ticket.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}