import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./SignupPage.scss"; 
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSignup = (e) => {
    e.preventDefault();
    
    
    const newUser = { name, email, role: "user" };
    
    
    login(newUser);
    
    
    navigate("/");
  };

  return (
    <div className="signup-page-wrapper">
      <Navbar />
      <div className="signup-container">
        <div className="signup-box">
          <h2>Create Account</h2>
          <p className="sub-text">Join us to book your train tickets easily</p>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signup-btn">
              SIGN UP
            </button>
          </form>

          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")}>Login Here</span>
          </p>
        </div>
      </div>
    </div>
  );
}