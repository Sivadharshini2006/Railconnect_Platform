
import React, { useState, useRef, useMemo,useEffect } from "react";
import Navbar from "../components/Navbar";

import { FaCalendarAlt, FaStar, FaChevronDown, FaChevronUp, FaExchangeAlt } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";



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
    { date: "31 Jan, Thu", status: "Train Departed", price: basePrice, color: "red", canBook: false },
    { date: "1 Feb, Fri", status: "Not Available", price: basePrice, color: "red", canBook: true },
    { date: "2 Feb, Sat", status: "WL 58", price: basePrice, color: "orange", canBook: true, prob: "82%" },
    { date: "3 Feb, Sun", status: "WL 77", price: basePrice, color: "orange", canBook: true, prob: "76%" },
    { date: "4 Feb, Mon", status: "AVAILABLE-104", price: basePrice, color: "green", canBook: true },
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


const TrainCard = ({ train, activeFilter, isTatkalAllowed, journeyDate }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useAuth(); 

  const scheduleData = generateSchedule(train.depTime);

  const handleClassClick = (clsType) => {
    setSelectedClass(selectedClass === clsType ? null : clsType);
  };

  const currentClassData = train.classes.find(c => c.type === selectedClass);
  const bookingRows = currentClassData ? generateNextDates(currentClassData.price) : [];

 
  const handleBook = () => {
   if (!user) {
  alert("Please login to continue booking");

  navigate("/login", {
    state: {
      from: location.pathname,
      bookingData: {
        train,
        selectedClass
      }
    }
  });
  return;
}


    navigate('/booking', {
      state: {
        trainDetails: {
          name: train.name,
          number: train.number,
          from: train.from,
          to: train.to,
          depTime: train.depTime,
          arrTime: train.arrTime,
          date: journeyDate || "",
          price: currentClassData ? currentClassData.price : 0
        }
      }
    });
  };
 return (
  <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition p-4">

    {/* Header */}
    <div className="flex justify-between mb-3">
      <div className="flex items-center font-semibold text-sm">
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded mr-2">
          {train.number}
        </span>
        {train.name}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
          {train.rating} <FaStar className="text-yellow-500" size={10} />
        </span>
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-blue-600 font-medium flex items-center gap-1"
        >
          Schedule
          {showSchedule ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </button>
      </div>
    </div>

    {/* Time Row */}
    <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
      <span>
        {train.depTime} <strong>{train.from}</strong>
      </span>
      <span className="text-xs text-gray-400">
        — {train.duration} —
      </span>
      <span>
        {train.arrTime} <strong>{train.to}</strong>
      </span>
    </div>

    {/* Seat Cards */}
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
      {train.classes.map((cls, idx) => {
        const isSelected = selectedClass === cls.type;
        const isAvailable = cls.label === "Available";

        return (
          <div
            key={idx}
            onClick={() => handleClassClick(cls.type)}
            className={`min-w-[130px] border rounded-md p-3 cursor-pointer relative
              ${isSelected ? "border-blue-600 bg-blue-50" : "hover:border-blue-400"}
              ${!isAvailable ? "bg-red-50" : "bg-gray-50"}
            `}
          >
            <div className="flex justify-between font-semibold text-sm mb-1">
              <span>{cls.type}</span>
              <span>₹{cls.price}</span>
            </div>

            <div
              className={`text-xs font-medium ${
                isAvailable ? "text-green-700" : "text-red-600"
              }`}
            >
              {activeFilter === "TATKAL" ? "TQWL-10" : cls.status}
            </div>

            <div className="text-[11px] text-gray-500">
              {activeFilter === "TATKAL" ? "Tatkal Waitlist" : cls.label}
            </div>

            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Booking Section */}
    {selectedClass && (
      <div className="mt-4 border-t pt-4">

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2 mb-4 text-sm">
          {["General", "Tatkal", "Senior Citizen", "Ladies"].map((tab) => {
            const disabled = tab === "Tatkal" && !isTatkalAllowed;

            return (
              <button
                key={tab}
                onClick={() => !disabled && setActiveTab(tab)}
                className={`pb-1 ${
                  activeTab === tab
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-gray-500"
                } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Date Rows */}
        <div className="space-y-3">
          {bookingRows.map((row, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-dashed pb-3"
            >
              <div>
                <div className="text-sm font-semibold">{row.date}</div>
                <div
                  className={`text-xs font-medium ${
                    row.color === "green"
                      ? "text-green-700"
                      : row.color === "orange"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {row.status}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {row.prob && (
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {row.prob} Chance
                  </span>
                )}
{user?.role?.toUpperCase() !== 'ADMIN' && user?.role?.toUpperCase() !== 'TTE' ? (
                <button
                  disabled={!row.canBook}
                  onClick={handleBook}
                  className={`text-xs px-5 py-1.5 rounded font-medium
                    ${
                      row.canBook
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {row.canBook ? `Book ₹${row.price}` : "Closed"}
                </button>) : (
  <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded border">
    View Only Mode
  </span>
)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Schedule */}
    {showSchedule && (
  <div className="mt-4 border rounded-lg bg-gray-50 p-4 text-sm">

    {/* HEADER */}
    <div className="grid grid-cols-5 font-semibold text-gray-500 text-xs mb-3">
      <span>Station</span>
      <span>Arr</span>
      <span>Dep</span>
      <span>Halt</span>
      <span>Day</span>
    </div>

    {/* ROWS */}
    {scheduleData.map((s, i) => (
      <div
        key={i}
        className="grid grid-cols-5 items-center py-2 border-t text-gray-700"
      >
        <div>
          <div className="font-medium">{s.station}</div>
          <div className="text-xs text-gray-400">({s.code})</div>
        </div>

        <span>{s.arr}</span>
        <span>{s.dep}</span>
        <span>{s.halt}</span>
        <span>{s.day}</span>
      </div>
    ))}
  </div>
)}

  </div>
);

};




export default function SearchResults() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();
  const dateInputRef = useRef(null);
const navigate = useNavigate();
  const location = useLocation();

  const {
    from,
    fromCode,
    to,
    toCode,
    journeyDate,
    quota
  } = location.state || {};

useEffect(() => {
  if (!location.state) {
    navigate("/");
  }
}, [location, navigate]);

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
 <div className="min-h-screen bg-[#f2f4f7] font-poppins text-gray-800">
  
    <Navbar />

    <div className="w-full px-6 pb-10">

      {/* Route Header */}
      <div className="my-4">
        <h1 className="text-[18px] font-semibold flex items-center">
  {fromCode} – {from}
  <FaExchangeAlt className="mx-2 text-xs text-gray-400" />
 {toCode} – {to}
</h1>

<span className="text-xs text-gray-500">
  {filteredTrains.length} Trains found | {journeyDate} | {quota} Quota
</span>

      </div>

      {/* Date Carousel */}
      <div className="flex items-center bg-white p-2 rounded-t-lg border-b">
        <input
          type="date"
          ref={dateInputRef}
          onChange={handleCalendarPick}
          className="hidden"
        />
        <button
          onClick={() => dateInputRef.current.showPicker()}
          className="px-4 text-gray-500 border-r"
        >
          <FaCalendarAlt />
        </button>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1">
          {dates.map((d, i) => {
            const isActive = isSameDate(d.fullDate, selectedDate);
            return (
              <div
                key={i}
                onClick={() => handleDateClick(d.fullDate)}
                className={`min-w-[85px] text-center p-2 rounded cursor-pointer relative
                  ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <span className="block text-sm font-medium">{d.display}</span>
                <span
                  className={`text-[10px] font-medium ${
                    d.color === "green"
                      ? "text-green-700"
                      : d.color === "orange"
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                >
                  ● {d.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 h-[3px] w-full bg-blue-600 rounded-t" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-b-lg shadow-sm flex gap-4 text-sm">
        {[
          ["BEST_AVAIL", "Best Available"],
          ["TATKAL", "Tatkal Only"],
          ["AC_ONLY", "AC Only"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilter === key}
              onChange={() =>
                setActiveFilter(activeFilter === key ? null : key)
              }
              className="accent-blue-600"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Tatkal Warning */}
      {activeFilter === "TATKAL" && !isTatkalAllowed && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-3 rounded mt-4">
          ⚠️ Tatkal booking is only allowed for journey starting Tomorrow.
        </div>
      )}

      {/* Promo Banner */}
      <div className="mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked readOnly className="accent-white" />
          <div>
            <strong className="block text-sm">Free Cancellation</strong>
            <span className="text-xs opacity-90">
              Get full refund of your train fare on cancellation*
            </span>
          </div>
        </div>
        <div className="font-bold">🛡️ FCF</div>
      </div>

      {/* Train List */}
      <div className="mt-4 space-y-4">
        {filteredTrains.length ? (
          filteredTrains.map((train) => (
            <TrainCard
              key={train.id}
              train={train}
              activeFilter={activeFilter}
              isTatkalAllowed={isTatkalAllowed}
              journeyDate={journeyDate || selectedDate.toLocaleDateString()}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <h3 className="font-semibold">No trains found</h3>
            <p className="text-sm">Try changing the date or filters.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}