import React, { useState } from "react";
import Navbar from "../components/Navbar"; 
import { FaSearch, FaDownload, FaFilePdf } from "react-icons/fa";
import "./ReservationCharts.css";
import Navbartte from "./Navbartte";

const ReservationCharts = () => {
  const [selectedTrain, setSelectedTrain] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const [stats, setStats] = useState({ total: 0, confirmed: 0, rac: 0, waitlist: 0 });

  
  const trains = [
    { id: "12904", name: "12904 - Golden Temple M" },
    { id: "12138", name: "12138 - Punjab Mail" },
    { id: "12952", name: "12952 - Mumbai Rajdhani" },
    { id: "12260", name: "12260 - Duronto Express" }
  ];

  const handleGenerate = () => {
    if(!selectedTrain || !journeyDate) {
        alert("Please select both a train and a date.");
        return;
    }
    setLoading(true);
    setChartData(null);

    setTimeout(() => {
      
        const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        
     
        const filtered = allBookings.filter(b => {
             return b.trainName === selectedTrain && b.date === journeyDate;
        });

      
        let total = 0;
        let cnf = 0;
        
        filtered.forEach(b => {
            total += b.passengers.length;
            
            cnf += b.passengers.length; 
        });

        setStats({
            total: total,
            confirmed: cnf,
            rac: 0,       
            waitlist: 0    });

        setChartData(filtered);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="chart-page-wrapper">
      <Navbartte />
      
      <div className="chart-container-full">
      
        <div className="chart-card">
          <h3 className="section-title">Reservation Chart Preparation</h3>
          
          <div className="form-content">
            <h4 className="form-heading">Generate Chart</h4>

            <div className="input-group-row">
              <div className="input-box">
                <label>Select Train</label>
                <select 
                  value={selectedTrain} 
                  onChange={(e) => setSelectedTrain(e.target.value)}
                  className="custom-select"
                >
                  <option value="">Select a train</option>
                  {trains.map((train) => (
                    <option key={train.id} value={train.name}>{train.name}</option>
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
            </div>

            <button className="generate-btn" onClick={handleGenerate}>
              {loading ? "Generating..." : <><FaSearch /> Generate Chart</>}
            </button>
          </div>
        </div>

        {/* --- RESULTS SECTION --- */}
        {chartData && (
            <div className="chart-results fade-in">
                <div className="result-top-bar">
                    <div>
                        <h2 className="train-title">{selectedTrain}</h2>
                        <div className="train-subtitle">Train #{selectedTrain.split(' ')[0]} • {journeyDate}</div>
                    </div>
                   
                    {chartData.length > 0 && (
                        <button className="download-btn" onClick={() => window.print()}>
                            <FaDownload /> Download Chart
                        </button>
                    )}
                </div>

                
                {chartData.length > 0 && (
                    <div className="stats-row">
                        <div className="stat-card blue">
                            <div className="stat-label">Total Bookings</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                        <div className="stat-card green">
                            <div className="stat-label">Confirmed</div>
                            <div className="stat-value">{stats.confirmed}</div>
                        </div>
                        <div className="stat-card yellow">
                            <div className="stat-label">RAC</div>
                            <div className="stat-value">{stats.rac}</div>
                        </div>
                        <div className="stat-card orange">
                            <div className="stat-label">Waitlist</div>
                            <div className="stat-value">{stats.waitlist}</div>
                        </div>
                    </div>
                )}

                <h4 className="list-heading">Passenger List</h4>
                
                <div className="table-container">
                    {chartData.length === 0 ? (
                         <div className="empty-state">
                            <FaFilePdf size={40} color="#ccc" />
                            <p style={{marginTop:'15px'}}>No passengers found for <b>{selectedTrain}</b> on <b>{journeyDate}</b>.</p>
                         </div>
                    ) : (
                        <table className="chart-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>PNR</th>
                                    <th>Name</th>
                                    <th>Age/Gen</th>
                                    <th>Coach</th>
                                    <th>Seat</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((booking, bIndex) => {
                                    
                                    return booking.passengers.map((p, pIndex) => (
                                        <tr key={`${bIndex}-${pIndex}`}>
                                            <td>{bIndex + 1}</td>
                                            <td className="pnr-text">{booking.pnr}</td>
                                            <td>{p.name}</td>
                                            <td>{p.age} / {p.gender}</td>
                                            <td>S5</td>
                                            
                                            <td>{parseInt(booking.pnr.slice(-2)) + pIndex}</td>
                                            <td><span className="cnf-badge">CNF</span></td>
                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCharts;