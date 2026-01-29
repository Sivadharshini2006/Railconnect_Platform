import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTrain, FaSignOutAlt, FaFileAlt, FaCheckCircle, FaListUl } from "react-icons/fa";
import "./Navbar.css";

const Navbartte = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add your logout logic here
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Clear any auth tokens or session data
      localStorage.removeItem("tteAuth"); // Example
      // Redirect to login page
      window.location.href = "/login"; // Adjust based on your routing
    }
  };

  return (
    <nav className="tte-navbar">
      <div className="navbar-container">
        {/* Left Section - Branding */}
        <div className="navbar-brand">
          <FaTrain className="brand-icon" />
          <div className="brand-text">
            <h1 className="brand-title">RailConnect</h1>
        
          </div>
        </div>
              <div className="navbar-links">
        <Link 
          to="/tte/charts" 
          className={`nav-link ${isActive("/tte/charts") ? "active" : ""}`}
        >
          <FaFileAlt className="nav-icon" />
          <span>Reservation Charts</span>
        </Link>

        <Link 
          to="/tte/verification" 
          className={`nav-link ${isActive("/tte/verification") ? "active" : ""}`}
        >
          <FaCheckCircle className="nav-icon" />
          <span>Ticket Verification</span>
        </Link>

        <Link 
          to="/tte/waitlist" 
          className={`nav-link ${isActive("/tte/waitlist") ? "active" : ""}`}
        >
          <FaListUl className="nav-icon" />
          <span>Waitlist Allotment</span>
        </Link>
      </div>

        {/* Right Section - Logout */}
        <button             style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '25px', 
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={handleLogout}>

          Logout
        </button>
      </div>

      {/* Navigation Links */}

    </nav>
  );
};

export default Navbartte;