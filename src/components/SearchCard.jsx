import { useState } from "react";
import "./SearchCard.scss";
import { useNavigate } from "react-router-dom";

import { FaTrain, FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function SearchCard() {
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showDate, setShowDate] = useState(false);
  
  const [from, setFrom] = useState(""); 
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();
const handleSearch = (e) => {
  e.preventDefault();

  if (!from || !to || !date) {
    alert("Please fill in all details (From, To, and Departure Date) before searching!");
    return;
  }

  const [fromCode, fromName] = from.split(" - ");
  const [toCode, toName] = to.split(" - ");

  navigate("/search", {
    state: {
      from: fromName,
      fromCode,
      to: toName,
      toCode,
      journeyDate: date,
      quota: "General"
    }
  });
};


  const selectStation = (stationName, type) => {
    if (type === 'from') {
      setFrom(stationName);
      setShowFrom(false);
    } else {
      setTo(stationName);
      setShowTo(false);
    }
  };

  const selectDate = (day) => {
    setDate(`${day} Jan, 2026`);
    setShowDate(false);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="search-wrapper">
      <p className="title">Train Ticket Booking</p>
      <h2>Easy IRCTC Login</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        
        <div className="from-to-wrapper">
         
          <div className="box" onClick={() => { setShowFrom(true); setShowTo(false); setShowDate(false); }}>
          
            <FaTrain className="icon" color="#2196F3" size={20} />
            <div>
              <small>From</small>
              <p>{from || "Select Station"}</p>
            </div>
          </div>

       
          <div className="swap-btn" onClick={handleSwap} style={{cursor: 'pointer'}}>
             <FaExchangeAlt color="#666" />
          </div>

         
          <div className="box" onClick={() => { setShowTo(true); setShowFrom(false); setShowDate(false); }}>
          
            <FaMapMarkerAlt className="icon" color="#E91E63" size={20} />
            <div>
              <small>To</small>
              <p>{to || "Select Station"}</p>
            </div>
          </div>
        </div>

        <div className="box" onClick={() => { setShowDate(true); setShowFrom(false); setShowTo(false); }}>
          
          <FaCalendarAlt className="icon" color="#FF9800" size={20} />
          <div>
            <small>Departure Date</small>
            <p>{date || "Select Date"}</p>
          </div>
        </div>

        <button type="submit" className="search-btn">SEARCH</button>
      </form>

      {showFrom && (
        <div className="station-panel">
          <input placeholder="Search from station..." />
          <h4>Popular Searches</h4>
          <p onClick={() => selectStation("NDLS - New Delhi", 'from')}>NDLS - New Delhi</p>
          <p onClick={() => selectStation("MMCT - Mumbai Central", 'from')}>MMCT - Mumbai Central</p>
          <p onClick={() => selectStation("MAS - Chennai Central", 'from')}>MAS - Chennai Central</p>
          <button onClick={() => setShowFrom(false)}>Close</button>
        </div>
      )}

      {showTo && (
        <div 
            className="station-panel" 
            
            style={{ left: '32%', right: 'auto' }} 
        > 
          <input placeholder="Search to station..." />
          <h4>Popular Searches</h4>
          <p onClick={() => selectStation("MMCT - Mumbai Central", 'to')}>MMCT - Mumbai Central</p>
          <p onClick={() => selectStation("NDLS - New Delhi", 'to')}>NDLS - New Delhi</p>
          <p onClick={() => selectStation("SBC - KSR Bengaluru", 'to')}>SBC - KSR Bengaluru</p>
          <button onClick={() => setShowTo(false)}>Close</button>
        </div>
      )}

      {showDate && (
        <div className="calendar-overlay">
          <div className="calendar">
            <h3>January 2026</h3>
            <div className="dates">
              {[...Array(31)].map((_, i) => (
                <span
                  key={i}
                  className={(i + 1).toString() === date.split(' ')[0] ? "active" : ""}
                  onClick={() => selectDate(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}