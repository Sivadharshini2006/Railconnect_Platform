import React, { useState } from 'react';
import './Statistics.scss';
import { 
  FaTicketAlt, FaRupeeSign, FaUsers, FaChartLine, 
  FaCalendarAlt, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('This Week');

 
  const topTrains = [
    { rank: 1, name: "Rajdhani Express", bookings: 234, revenue: "876,543", avg: "3,746" },
    { rank: 2, name: "Shatabdi Express", bookings: 198, revenue: "654,321", avg: "3,305" },
    { rank: 3, name: "Duronto Express", bookings: 167, revenue: "543,210", avg: "3,253" },
    { rank: 4, name: "Garib Rath", bookings: 145, revenue: "432,109", avg: "2,980" },
    { rank: 5, name: "Jan Shatabdi", bookings: 132, revenue: "321,098", avg: "2,433" }
  ];

  const recentActivity = [
    { type: 'booking', title: 'New booking', desc: 'Rajdhani Express - PNR 1234567890', time: '2 minutes ago', amount: '+3,450', isPositive: true },
    { type: 'cancel', title: 'Cancellation', desc: 'Shatabdi Express - PNR 0987654321', time: '5 minutes ago', amount: '-2,180', isPositive: false },
    { type: 'booking', title: 'New booking', desc: 'Duronto Express - PNR 5647382910', time: '12 minutes ago', amount: '+4,230', isPositive: true },
    { type: 'waitlist', title: 'Waitlist cleared', desc: 'Garib Rath - PNR 3456789012', time: '18 minutes ago', amount: '1,890', isPositive: true, isNeutral: true },
  ];

  return (
    <div className="stats-container">
      
      <div className="stats-header">
        <h3>Booking Statistics & Revenue</h3>
        <div className="date-filter">
          <FaCalendarAlt className="cal-icon" />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="icon-box blue"><FaTicketAlt /></div>
            <span className="growth positive"><FaArrowUp /> +12%</span>
          </div>
          <h2>1,247</h2>
          <p>Total Bookings</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="icon-box green"><FaRupeeSign /></div>
            <span className="growth positive"><FaArrowUp /> +18%</span>
          </div>
          <h2>₹3,456,789</h2>
          <p>Total Revenue</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="icon-box purple"><FaUsers /></div>
            <span className="growth positive"><FaArrowUp /> +15%</span>
          </div>
          <h2>4,532</h2>
          <p>Total Passengers</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="icon-box orange"><FaChartLine /></div>
            <span className="growth positive"><FaArrowUp /> +8%</span>
          </div>
          <h2>₹2,773</h2>
          <p>Avg Booking Value</p>
        </div>
      </div>

     
      <div className="section-card">
        <h4>Booking Status Distribution</h4>
        <div className="status-bars-row">
          
          <div className="status-item">
            <div className="status-label"><span>Confirmed</span> <span className="val-green">1089</span></div>
            <div className="progress-track"><div className="progress-fill fill-green" style={{width: '85%'}}></div></div>
          </div>

          <div className="status-item">
            <div className="status-label"><span>RAC</span> <span className="val-orange">98</span></div>
            <div className="progress-track"><div className="progress-fill fill-orange" style={{width: '40%'}}></div></div>
          </div>

          <div className="status-item">
            <div className="status-label"><span>Waitlist</span> <span className="val-red">60</span></div>
            <div className="progress-track"><div className="progress-fill fill-red" style={{width: '25%'}}></div></div>
          </div>

        </div>
      </div>

      <div className="section-card">
        <h4>Top Performing Trains</h4>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Train Name</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Avg per Booking</th>
            </tr>
          </thead>
          <tbody>
            {topTrains.map((t) => (
              <tr key={t.rank}>
                <td><b>#{t.rank}</b></td>
                <td>{t.name}</td>
                <td>{t.bookings}</td>
                <td>₹{t.revenue}</td>
                <td>₹{t.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="split-grid">
        

        <div className="section-card">
          <h4>Revenue by Class</h4>
          <div className="class-bars">
            {[
              { label: '1A', val: '₹987,654', pct: '28.6%', w: '80%' },
              { label: '2A', val: '₹876,543', pct: '25.4%', w: '70%' },
              { label: '3A', val: '₹765,432', pct: '22.1%', w: '60%' },
              { label: 'SL', val: '₹654,321', pct: '18.9%', w: '45%' },
              { label: '2S', val: '₹172,839', pct: '5%', w: '15%' },
            ].map((c) => (
               <div className="class-bar-item" key={c.label}>
                 <div className="cb-info"><span>{c.label}</span> <span>{c.val} <small>({c.pct})</small></span></div>
                 <div className="progress-track"><div className="progress-fill fill-blue" style={{width: c.w}}></div></div>
               </div>
            ))}
          </div>
        </div>

       
        <div className="section-card">
          <h4>Recent Booking Activity</h4>
          <div className="activity-list">
            {recentActivity.map((act, i) => (
              <div className="activity-item" key={i}>
                <div className="act-details">
                   <div className="act-title">{act.title}</div>
                   <div className="act-desc">{act.desc}</div>
                   <div className="act-time">{act.time}</div>
                </div>
                <div className={`act-amount ${act.isPositive ? 'pos' : 'neg'} ${act.isNeutral ? 'neu' : ''}`}>
                  {act.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Statistics;