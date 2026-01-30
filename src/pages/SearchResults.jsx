import React, { useState, useRef, useMemo,useEffect } from "react";
import Navbar from "../components/Navbar";
import "./SearchResults.scss";
import { FaCalendarAlt, FaStar, FaChevronDown, FaChevronUp, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const generateSchedule = (depTime) => {
  return [
    { station: "New Delhi", code: "NDLS", arr: "--", dep: depTime, halt: "--", day: 1, delay: "On Time" },
    { station: "Mathura Jn", code: "MTJ", arr: "07:15", dep: "07:20", halt: "05m", day: 1, delay: "10 min" },
    { station: "Kota Jn", code: "KOTA", arr: "11:40", dep: "11:50", halt: "10m", day: 1, delay: "On Time" },
    { station: "Vadodara Jn", code: "BRC", arr: "18:20", dep: "18:30", halt: "10m", day: 1, delay: "05 min" },
    { station: "Surat", code: "ST", arr: "20:10", dep: "20:15", halt: "05m", day: 1, delay: "On Time" },
    { station: "Mumbai Central", code: "MMCT", arr: "23:55", dep: "--", halt: "--", day: 1, delay: "On Time" },
  ];
};

const generateNextDates = (basePrice) => {
  return [
    { date: "22 Jan, Thu", status: "Train Departed", price: basePrice, color: "red", canBook: false },
    { date: "23 Jan, Fri", status: "Not Available", price: basePrice, color: "red", canBook: true },
    { date: "24 Jan, Sat", status: "WL 58", price: basePrice, color: "orange", canBook: true, prob: "82%" },
    { date: "25 Jan, Sun", status: "WL 77", price: basePrice, color: "orange", canBook: true, prob: "76%" },
    { date: "26 Jan, Mon", status: "AVAILABLE-104", price: basePrice, color: "green", canBook: true },
  ];
};

const trainList = [
  {
    id: 12904,
    name: "Golden Temple M",
    number: "12904",
    from: "NZM",
    to: "BDTS",
    depTime: "04:00",
    arrTime: "23:55",
    duration: "19h 55m",
    rating: "3.9",
    status: "active",
    isAC: false,
    hasTatkal: false,
    classes: [
      { type: "SL", price: 655, status: "WL-45", label: "Waitlist" },
      { type: "3A", price: 1670, status: "AVAILABLE-12", label: "Available" },
      { type: "2A", price: 2450, status: "WL-10", label: "Waitlist" }
    ]
  },
  {
    id: 12138,
    name: "Punjab Mail",
    number: "12138",
    from: "NDLS",
    to: "CSMT",
    depTime: "05:10",
    arrTime: "07:35",
    duration: "26h 25m",
    rating: "3.9",
    status: "active",
    isAC: false,
    hasTatkal: true,
    classes: [
      { type: "SL", price: 710, status: "AVAILABLE-105", label: "Available" },
      { type: "3A", price: 1800, status: "AVAILABLE-20", label: "Available" },
      { type: "2A", price: 2500, status: "WL-05", label: "Waitlist" }
    ]
  },
  {
    id: 12952,
    name: "Mumbai Rajdhani",
    number: "12952",
    from: "NDLS",
    to: "MMCT",
    depTime: "16:55",
    arrTime: "08:35",
    duration: "15h 40m",
    rating: "4.5",
    status: "active",
    isAC: true,
    hasTatkal: false,
    classes: [
      { type: "3A", price: 2050, status: "AVAILABLE-102", label: "Available" },
      { type: "2A", price: 2950, status: "AVAILABLE-45", label: "Available" },
      { type: "1A", price: 4800, status: "AVAILABLE-12", label: "Available" }
    ]
  }
];

const formatDateDisplay = (dateObj) => {
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = dateObj.getDate();
  return `${dayName}, ${dayNum}`;
};


const TrainCard = ({ train, activeFilter, isTatkalAllowed }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  
  const navigate = useNavigate();
  
  const { user } = useAuth(); 

  const scheduleData = generateSchedule(train.depTime);

  const handleClassClick = (clsType) => {
    setSelectedClass(selectedClass === clsType ? null : clsType);
  };

  const currentClassData = train.classes.find(c => c.type === selectedClass);
  const bookingRows = currentClassData ? generateNextDates(currentClassData.price) : [];

 
  const handleBook = () => {
    if (!user) {
      alert("Must login and after that you can continue your booking");
      navigate('/login');
      return; 
    }

    navigate('/booking', { 
      state: { 
        train: {
          name: `${train.name} (${train.number})`,
          from: train.from,
          to: train.to,
          date: "26 Jan", 
          price: currentClassData ? currentClassData.price : 0
        } 
      } 
    });
  };
  return (
    <div className="train-card-wrapper">
      <div className="train-card-row">
       
        <div className="train-header">
          <div className="t-name">
            <span className="number">{train.number}</span> {train.name}
          </div>
          <div className="t-rating">
            <span className="star-box">{train.rating} <FaStar size={10} /></span>
            <span className="schedule-link" onClick={() => setShowSchedule(!showSchedule)}>
              Schedule {showSchedule ? <FaChevronUp size={10}/> : <FaChevronDown size={10}/>}
            </span>
          </div>
        </div>

    
        <div className="train-time-info">
          <div className="time-group">
            <span className="t-time">{train.depTime} <strong>{train.from}</strong></span>
            <span className="t-duration">--- {train.duration} ---</span>
            <span className="t-time">{train.arrTime} <strong>{train.to}</strong></span>
          </div>
        </div>


        <div className="seat-scroller">
          {train.classes.map((cls, idx) => {
            const isSelected = selectedClass === cls.type;
            const isAvailable = cls.label === 'Available';
            return (
              <div 
                key={idx} 
                className={`seat-ticket ${isSelected ? 'selected' : ''} ${train.status === 'departed' ? 'departed' : ''}`}
                onClick={() => handleClassClick(cls.type)}
              >
                <div className="seat-top">
                  <span className="cls-name">{cls.type}</span>
                  <span className="cls-price">₹{cls.price}</span>
                </div>
                <div className={`seat-stat ${isAvailable ? 'green-txt' : 'red-txt'}`}>
                   {activeFilter === 'TATKAL' ? 'TQWL-10' : cls.status}
                </div>
                <div className="seat-lbl">
                   {activeFilter === 'TATKAL' ? 'Tatkal Waitlist' : cls.label}
                </div>
                {isSelected && <div className="check-mark">✓</div>}
              </div>
            );
          })}
        </div>


        {selectedClass && (
          <div className="booking-expanded">
            <div className="booking-tabs">
              {['General', 'Tatkal', 'Senior Citizen', 'Ladies'].map(tab => {
                 const isTabDisabled = tab === 'Tatkal' && !isTatkalAllowed;
                 return (
                   <div 
                     key={tab} 
                     className={`b-tab ${activeTab === tab ? 'active' : ''}`}
                     style={isTabDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                     onClick={() => { if (!isTabDisabled) setActiveTab(tab); }}
                   >
                     {tab}
                   </div>
                 );
              })}
            </div>

            <div className="date-rows-container">
              {bookingRows.map((row, idx) => (
                <div key={idx} className="date-row">
                  <div className="dr-left">
                    <span className="dr-date">{row.date}</span>
                    <span className={`dr-status ${row.color}`}>
                        {activeTab === 'Tatkal' && idx === 0 ? "Train Departed" : 
                         activeTab === 'Tatkal' && idx === 1 ? "AVAILABLE-04" :
                         activeTab === 'Tatkal' ? "Not Available" :
                         row.status}
                    </span>
                  </div>
                  <div className="dr-right">
                    {row.color === 'orange' && activeTab === 'General' && (
                        <div className="prob-badge"><span className="prob-txt">{row.prob || '65%'} Chance</span></div>
                    )}
                    <button 
                        className={`book-btn-sm ${!row.canBook ? 'disabled' : ''}`}
                        disabled={!row.canBook}
                        onClick={handleBook} 
                    >
                        {row.canBook ? `Book ₹${row.price}` : 'Closed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSchedule && (
           <div className="schedule-accordion">
              <div className="sch-head"><span>Station</span><span>Arrives</span><span>Departs</span><span>Halt</span><span>Day</span></div>
              <div className="sch-timeline">
                {scheduleData.map((stop, i) => (
                    <div key={i} className="sch-row">
                        <div className="sch-line-col">
                            <div className="line-top"></div><div className="dot"></div><div className="line-btm"></div>
                        </div>
                        <div className="sch-data">
                            <div className="stn-name"><strong>{stop.station}</strong> <span className="stn-code">({stop.code})</span><span className={`delay-tag ${stop.delay === 'On Time' ? 'green' : 'red'}`}>{stop.delay}</span></div>
                            <div className="sch-time">{stop.arr}</div><div className="sch-time">{stop.dep}</div><div className="sch-time">{stop.halt}</div><div className="sch-time">{stop.day}</div>
                        </div>
                    </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};




export default function SearchResults() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();
  const dateInputRef = useRef(null);
const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'tte') {
      navigate('/tte/charts'); 
    }
  }, [user, navigate]);
  
 
  const isSameDate = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const dates = useMemo(() => {
    const newDates = [];
    const startDate = new Date(selectedDate);
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      
      let statusLabel = "Available";
      let statusColor = "green";
      const dayOfWeek = d.getDay();
      
      if (i === 0) { statusLabel = "Filling Fast"; statusColor = "orange"; }
      else if (dayOfWeek === 5 || dayOfWeek === 6) { statusLabel = "Few Seats"; statusColor = "yellow"; }
      
      newDates.push({ 
        fullDate: d, 
        display: formatDateDisplay(d), 
        label: statusLabel, 
        color: statusColor 
      });
    }
    return newDates;
  }, [selectedDate]);

  const handleDateClick = (dateObj) => setSelectedDate(dateObj);
  
  const handleCalendarPick = (e) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      setSelectedDate(newDate);
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTatkalAllowed = isSameDate(selectedDate, tomorrow);

  const filteredTrains = trainList.filter((train) => {
    if (activeFilter === 'AC_ONLY' && !train.isAC) return false;
    if (activeFilter === 'BEST_AVAIL' && !train.classes.some(cls => cls.label === "Available")) 
      return false;
    if (activeFilter === 'TATKAL') {
       if (!isTatkalAllowed) return false;
       if (!train.hasTatkal) return false;
    }
    return true; 
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="main-container">
       
        <div className="route-header">
           <h1>New Delhi (NDLS) <FaExchangeAlt style={{margin:'0 8px', fontSize:'12px', color:'#999'}}/> Mumbai Central (MMCT)</h1>
           <span className="route-meta">
             {filteredTrains.length} Trains found | {selectedDate.toDateString()} | General Quota
           </span>
        </div>

       
        <div className="date-carousel">
            <input type="date" ref={dateInputRef} onChange={handleCalendarPick} 
            style={{visibility: 'hidden', position:'absolute'}} />
            <button className="cal-btn" onClick={() => dateInputRef.current.showPicker()}><FaCalendarAlt /></button>
            <div className="dates-scroll">
                {dates.map((d, index) => {
                    const isActive = isSameDate(d.fullDate, selectedDate);
                    return (
                        <div key={index} className={`date-card ${isActive ? 'active' : ''}`} onClick={() => handleDateClick(d.fullDate)}>
                            <span className="d-day">{d.display}</span>
                            <span className={`d-label ${d.color}`}>● {d.label}</span>
                            {isActive && <div className="active-bar"></div>}
                        </div>
                    );
                })}
            </div>
        </div>

      
        <div className="quick-filters">
            <div className="toggles">
                <label className="toggle-container">
                   <input type="checkbox" checked={activeFilter === 'BEST_AVAIL'} onChange={() => setActiveFilter(activeFilter === 'BEST_AVAIL' ? null : 'BEST_AVAIL')}/>
                   <span className="checkmark"></span> Best Available
                </label>
                <label className="toggle-container">
                   <input type="checkbox" checked={activeFilter === 'TATKAL'} onChange={() => setActiveFilter(activeFilter === 'TATKAL' ? null : 'TATKAL')}/>
                   <span className="checkmark"></span> Tatkal Only
                </label>
                <label className="toggle-container">
                   <input type="checkbox" checked={activeFilter === 'AC_ONLY'} onChange={() => setActiveFilter(activeFilter === 'AC_ONLY' ? null : 'AC_ONLY')}/>
                   <span className="checkmark"></span> AC Only
                </label>
            </div>
        </div>

        
        {activeFilter === 'TATKAL' && !isTatkalAllowed && (
            <div className="error-banner">
                ⚠️ Tatkal booking is only allowed for journey starting Tomorrow.
            </div>
        )}

        <div className="promo-banner green">
            <div className="banner-content">
                <input type="checkbox" checked readOnly className="check-box" />
                <div className="text-col">
                    <strong>Free Cancellation</strong>
                    <span>Get full refund of your train fare on cancellation*</span>
                </div>
            </div>
            <div className="shield-icon">🛡️ FCF</div>
        </div>

        
        <div className="train-list">
            {filteredTrains.length > 0 ? (
                filteredTrains.map((train) => (
                    <TrainCard 
                        key={train.id} 
                        train={train} 
                        activeFilter={activeFilter}
                        isTatkalAllowed={isTatkalAllowed}
                    />
                ))
            ) : (
                <div className="no-trains">
                   <h3>No trains found</h3>
                   <p>Try changing the date or filters.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}