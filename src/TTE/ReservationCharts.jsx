import React, { useState } from "react";
import Navbar from "../components/Navbar"; 
import { FaSearch, FaDownload, FaFilePdf } from "react-icons/fa";
import "./ReservationCharts.scss";
import Navbartte from "./Navbartte";

const ReservationCharts = () => {
  const [selectedTrain, setSelectedTrain] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({ total: 0, confirmed: 0, rac: 0, waitlist: 0 });

  // --- FIX 1: UPDATED TRAIN NAMES ---
  // These now match exactly what is shown in your My Bookings screenshot
  // Format: "Name (Number)"
  const trains = [
    { id: "12904", name: "Golden Temple M (12904)" },
    { id: "12138", name: "Punjab Mail (12138)" },
    { id: "12952", name: "Mumbai Rajdhani (12952)" },
    { id: "12260", name: "Duronto Express (12260)" }
  ];

  const handleGenerate = () => {
    if(!selectedTrain || !journeyDate) {
        alert("Please select both a train and a date.");
        return;
    }
    setLoading(true);
    setChartData(null);

    // --- FIX 2: DATE FORMAT CONVERSION ---
    // Your date picker gives "2026-01-26"
    // Your saved data has "26 Jan"
    // We must convert the picker date to match the saved text.
    const dateObj = new Date(journeyDate);
    const day = dateObj.getDate(); // e.g., 26
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[dateObj.getMonth()]; // e.g., "Jan"
    
    // Result: "26 Jan" (This matches your database)
    const formattedSearchDate = `${day} ${month}`; 

    console.log("Searching for Train:", selectedTrain);
    console.log("Searching for Date:", formattedSearchDate); 

    setTimeout(() => {
        // 1. Get All Bookings
        const rawData = localStorage.getItem("bookings") || "[]";
        const allBookings = JSON.parse(rawData);
        
        console.log("All Bookings in DB:", allBookings);

        // 2. FILTER LOGIC
        const filtered = allBookings.filter(b => {
             // Handle data structure variations (some might be b.train.name, others b.trainName)
             const dbTrainName = b.train?.name || b.trainName || "";
             const dbDate = b.train?.date || b.date || "";

             // Check Train Match (Flexible check)
             const isTrainMatch = dbTrainName.includes(selectedTrain) || selectedTrain.includes(dbTrainName);

             // Check Date Match (Look for "26 Jan" inside the saved date string)
             const isDateMatch = dbDate.toString().includes(formattedSearchDate);

             // Debugging specifically for your case
             if (isTrainMatch && !isDateMatch) {
                 console.log(`Train matched but date failed. DB has: "${dbDate}", we wanted: "${formattedSearchDate}"`);
             }

             return isTrainMatch && isDateMatch;
        });

        // 3. Calculate Stats
        let total = 0;
        let cnf = 0;
        
        filtered.forEach(b => {
            // reliable access to passengers array
            const passengers = b.passengers || []; 
            total += passengers.length;
            cnf += passengers.length; 
        });

        setStats({
            total: total,
            confirmed: cnf,
            rac: 0, 
            waitlist: 0 
        });

        if (filtered.length === 0) {
            console.warn(`No matches found. Search: [${selectedTrain}] & [${formattedSearchDate}]`);
            alert(`No passengers found for ${formattedSearchDate}. Please check if the booking exists.`);
        }

        setChartData(filtered);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="chart-page-wrapper">
      <Navbartte />
      
      <div className="chart-container-full">
        
        {/* --- INPUT CARD --- */}
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
                        <div className="train-subtitle">
                             Train # {selectedTrain.match(/\d+/)?.[0]} • {new Date(journeyDate).getDate()} {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date(journeyDate).getMonth()]}
                        </div>
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
                            <p style={{marginTop:'15px'}}>No passengers found for this selection.</p>
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
                                    const passengers = booking.passengers || [];
                                    return passengers.map((p, pIndex) => (
                                        <tr key={`${bIndex}-${pIndex}`}>
                                            <td>{bIndex + 1}</td>
                                            <td className="pnr-text">{booking.pnr}</td>
                                            <td>{p.name}</td>
                                            <td>{p.age} / {p.gender}</td>
                                            <td>S5</td>
                                            {/* Generate a mock seat number based on PNR suffix */}
                                            <td>{parseInt(booking.pnr.toString().slice(-2)) + pIndex}</td>
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