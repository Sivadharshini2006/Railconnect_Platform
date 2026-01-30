import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaListUl, FaCheck, FaChair, FaFilter, FaSearch } from "react-icons/fa";
import "./ReservationCharts.css"; 
import Navbartte from "./Navbartte";

const WaitlistAllotment = () => {
  
  const [selectedTrain, setSelectedTrain] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [showData, setShowData] = useState(false);

 
  const [allWaitlistData, setAllWaitlistData] = useState([
     { id: 1, pnr: "8899001122", name: "Rahul Verma", age: 28, gender: "M", wl_status: "WL-1", trainId: "12951", trainName: "12951 - Rajdhani", date: "2026-01-27" },
     { id: 2, pnr: "7766554433", name: "Priya Sharma", age: 34, gender: "F", wl_status: "WL-2", trainId: "12951", trainName: "12951 - Rajdhani", date: "2026-01-27" },
     { id: 3, pnr: "9988223344", name: "Amit Kumar", age: 45, gender: "M", wl_status: "WL-5", trainId: "12260", trainName: "12260 - Duronto", date: "2026-01-28" },
  ]);

  
  const [filteredList, setFilteredList] = useState([]);

  const trains = [
    { id: "12904", name: "12904 - Golden Temple M" },
    { id: "12138", name: "12138 - Punjab Mail" },
    { id: "12951", name: "12951 - Rajdhani" }, 
    { id: "12260", name: "12260 - Duronto" }
  ];

 
  const handleShowList = (e) => {
      e.preventDefault();
      
      if(!selectedTrain || !journeyDate) {
          alert("Please select both a Train and a Date.");
          return;
      }

      
      const results = allWaitlistData.filter(item => 
          item.trainId === selectedTrain && item.date === journeyDate
      );

      setFilteredList(results);
      setShowData(true);
  };

  const handleAllot = (id) => {
     const confirmed = window.confirm("Confirm seat allotment for this passenger?");
     if(confirmed) {
     
         setAllWaitlistData(allWaitlistData.filter(p => p.id !== id));
         setFilteredList(filteredList.filter(p => p.id !== id));
         alert("Seat successfully allotted.");
     }
  };

  return (
    <div className="chart-page-wrapper">
      <Navbartte />
      
      <div className="chart-container-full" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 className="page-title">Waitlist Allotment</h2>

        
        <div className="chart-card" style={{ marginBottom: '25px', padding: '30px' }}>
            <h3 className="section-title" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <FaFilter size={18} /> Select Train & Date
            </h3>
            
            <form onSubmit={handleShowList} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                
              
                <div className="input-box">
                    <label>Select Train</label>
                    <select 
                        className="custom-select"
                        value={selectedTrain}
                        onChange={(e) => setSelectedTrain(e.target.value)}
                    >
                        <option value="">-- Select a Train --</option>
                        {trains.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

           
                <div className="input-box">
                    <label>Journey Date</label>
                    <input 
                        type="date" 
                        className="custom-input"
                        value={journeyDate}
                        onChange={(e) => setJourneyDate(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="generate-btn" style={{ height: '48px', marginBottom: '2px' }}>
                    <FaSearch /> Show Waitlist
                </button>
            </form>
        </div>


        {/* --- RESULTS TABLE (Only shows after clicking button) --- */}
        {showData && (
            <div className="chart-card fade-in">
            <div className="result-top-bar" style={{ paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <FaListUl size={20} color="#555"/>
                    <h3 className="section-title" style={{margin:0}}>
                        Waitlist for {journeyDate}
                    </h3>
                </div>
                <span className="train-subtitle" style={{background:'#fff3cd', color:'#856404', padding:'5px 12px', borderRadius:'15px', fontSize:'13px', fontWeight:'bold'}}>
                    {filteredList.length} Pending
                </span>
            </div>

            <div className="table-container" style={{marginTop: '15px'}}>
                <table className="chart-table">
                    <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                            <th style={{padding:'12px'}}>PNR</th>
                            <th style={{padding:'12px'}}>Passenger Name</th>
                            <th style={{padding:'12px'}}>Train Name</th>
                            <th style={{padding:'12px'}}>Waitlist Status</th>
                            <th style={{padding:'12px'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.length > 0 ? filteredList.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td className="pnr-text" style={{ fontWeight:'bold', color:'#555' }}>{p.pnr}</td>
                            <td>
                                <div style={{fontWeight:'600', color:'#333'}}>{p.name}</div>
                                <div style={{fontSize:'12px', color:'#777'}}>{p.age} / {p.gender}</div>
                            </td>
                            <td>{p.trainName}</td>
                            <td>
                                <span style={{color:'#e65100', fontWeight:'bold', background:'#ffe0b2', padding:'4px 8px', borderRadius:'4px', fontSize:'12px'}}>
                                    {p.wl_status}
                                </span>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleAllot(p.id)}
                                    style={{
                                        background:'#0d6efd', 
                                        color:'white', 
                                        border:'none', 
                                        padding:'8px 14px', 
                                        borderRadius:'6px', 
                                        cursor:'pointer', 
                                        display:'flex', 
                                        alignItems:'center', 
                                        gap:'8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#0b5ed7'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#0d6efd'}
                                >
                                    <FaChair size={12}/> Allot Seat
                                </button>
                            </td>
                        </tr>
                        )) : (
                        <tr>
                            <td colSpan="5" style={{textAlign:'center', padding:'50px', color:'#999'}}>
                                <FaCheck size={30} style={{marginBottom:'10px', display:'block', margin:'0 auto 10px', color:'#28a745'}}/>
                                No waitlisted passengers found for this train & date.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default WaitlistAllotment;