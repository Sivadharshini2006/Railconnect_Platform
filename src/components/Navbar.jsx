import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTrain, FaUser, FaChartBar, FaUserCheck, FaListUl } from 'react-icons/fa'; 
import { useAuth } from '../context/AuthContext'; 
import { IoSearchSharp } from "react-icons/io5";
import { LuTicketCheck } from "react-icons/lu";
import { GrStatusUnknown } from "react-icons/gr";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, logout } = useAuth(); 

 
  const isActive = (path) => location.pathname === path;

  const isTTE = user?.role === 'tte' || user?.email === 'tte@railconnect.com';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#0d6efd' : '#444',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontWeight: isActive(path) ? '700' : '500' 
  });

  return (
    <nav style={{ 
      background: '#fff', 
      padding: '12px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      fontFamily: 'sans-serif'
    }}>
     
      <div 
        
        onClick={() => navigate(isTTE ? "/tte/charts" : "/")} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <FaTrain size={24} color="#2196F3" />
        <span style={{ color: '#0d6efd', fontSize: '22px', fontWeight: '800' }}>RailConnect</span>
      </div>

      
      <div style={{ display: 'flex', gap: '30px', fontSize: '15px' }}>
        
        {isTTE ? (
          
          <>
            <Link to="/tte/charts" style={linkStyle('/tte/charts')}>
              <FaChartBar /> Reservation Charts
            </Link>
            <Link to="/tte/verification" style={linkStyle('/tte/verification')}>
              <FaUserCheck /> Ticket Verification
            </Link>
            <Link to="/tte/waitlist" style={linkStyle('/tte/waitlist')}>
              <FaListUl /> Waitlist Allotment
            </Link>
          </>
        ) : (
         
          <>
             <Link to="/" style={linkStyle('/')}><IoSearchSharp /> Search</Link>
             
            
             {user && (
               <Link to="/my-bookings" style={linkStyle('/my-bookings')}><LuTicketCheck /> My Bookings</Link>
             )}
             
             <Link to="/pnr-status" style={linkStyle('/pnr-status')}><GrStatusUnknown /> PNR Status</Link>
          </>
        )}
        
      </div>

      
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontWeight: '600' }}>
            <FaUser size={14} color="#666"/>
            {/* Display "TTE Admin" or the Passenger's Name */}
            <span>{isTTE ? "TTE Admin" : user.name}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '25px', 
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/login')} 
          style={{ 
            background: '#0d6efd', 
            color: 'white', 
            border: 'none', 
            padding: '10px 24px', 
            borderRadius: '25px', 
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          Login / Sign Up
        </button>
      )}
    </nav>
  );
};

export default Navbar;