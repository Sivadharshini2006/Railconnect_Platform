import { useState, useRef, useEffect } from "react";
import "./SearchCard.scss";
import { useNavigate } from "react-router-dom";
import { FaTrain, FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt } from "react-icons/fa";

const STATION_LIST = [
  "NDLS - New Delhi",
  "MMCT - Mumbai Central",
  "MAS - Chennai Central",
  "SBC - KSR Bengaluru",
  "HWH - Howrah Jn",
  "PUNE - Pune Jn",
  "ADI - Ahmedabad Jn",
  "CNB - Kanpur Central",
  "JAT - Jammu Tawi",
  "SC - Secunderabad"
];

export default function SearchCard() {
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- NEW: CALENDAR LOGIC ---
  const todayObj = new Date();
  const currentDay = todayObj.getDate();     // e.g., 25
  const currentMonth = todayObj.toLocaleString('default', { month: 'long' }); // e.g., "October"
  const currentYear = todayObj.getFullYear(); // e.g., 2023
  
  // Get exact number of days in the current month (28, 30, or 31)
  const daysInMonth = new Date(currentYear, todayObj.getMonth() + 1, 0).getDate();
  // ---------------------------

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFrom(false);
        setShowTo(false);
        setShowDate(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill in all details!");
      return;
    }
    const [fromCode, fromName] = from.split(" - ");
    const [toCode, toName] = to.split(" - ");
    navigate("/search", {
      state: { from: fromName, fromCode, to: toName, toCode, journeyDate: date, quota: "General" }
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
    setSearchTerm("");
  };

  const selectDate = (day) => {
    // Save as "25 October, 2023"
    setDate(`${day} ${currentMonth}, ${currentYear}`);
    setShowDate(false);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const filteredStations = STATION_LIST.filter(station => 
    station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-wrapper">
      <p className="title">Train Ticket Booking</p>
      <h2>Easy IRCTC Login</h2>

      <form className="search-bar" onSubmit={handleSearch} ref={dropdownRef}>
        
        <div className="from-to-wrapper">
          {/* FROM SECTION */}
          <div className="box relative-box" onClick={() => { setShowFrom(true); setShowTo(false); setShowDate(false); }}>
            <FaTrain className="icon" color="#2196F3" size={20} />
            <div>
              <small>From</small>
              <p>{from || "Select Station"}</p>
            </div>
            {showFrom && (
              <div className="station-dropdown" onClick={(e) => e.stopPropagation()}>
                <input 
                  autoFocus placeholder="Search station..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <h4>Popular Stations</h4>
                <div className="list">
                  {filteredStations.map((station, i) => (
                    <p key={i} onClick={() => selectStation(station, 'from')}>{station}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="swap-btn" onClick={(e) => { e.stopPropagation(); handleSwap(); }}>
             <FaExchangeAlt color="#666" />
          </div>

          {/* TO SECTION */}
          <div className="box relative-box" onClick={() => { setShowTo(true); setShowFrom(false); setShowDate(false); }}>
            <FaMapMarkerAlt className="icon" color="#E91E63" size={20} />
            <div>
              <small>To</small>
              <p>{to || "Select Station"}</p>
            </div>
            {showTo && (
              <div className="station-dropdown" onClick={(e) => e.stopPropagation()}>
                <input 
                  autoFocus placeholder="Search station..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <h4>Popular Stations</h4>
                <div className="list">
                  {filteredStations.map((station, i) => (
                    <p key={i} onClick={() => selectStation(station, 'to')}>{station}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DATE SECTION */}
        <div className="box relative-box" onClick={() => { setShowDate(true); setShowFrom(false); setShowTo(false); }}>
          <FaCalendarAlt className="icon" color="#FF9800" size={20} />
          <div>
            <small>Departure Date</small>
            <p>{date || "Select Date"}</p>
          </div>

          {showDate && (
            <div className="date-dropdown" onClick={(e) => e.stopPropagation()}>
              {/* Dynamic Month and Year */}
              <h3>{currentMonth} {currentYear}</h3>
              
              <div className="dates-grid">
                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  // Highlight if:
                  // 1. It is the selected date (e.g., user clicked it)
                  // 2. OR if no date is selected yet, highlight Today
                  const isSelected = date.startsWith(`${dayNum} `);
                  const isToday = !date && dayNum === currentDay; 

                  return (
                    <span
                      key={i}
                      className={isSelected || isToday ? "active" : ""}
                      onClick={() => selectDate(dayNum)}
                    >
                      {dayNum}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="search-btn">SEARCH</button>
      </form>
    </div>
  );
}