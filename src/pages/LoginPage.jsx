import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./LoginPage.scss";
import { FaUser, FaLock } from "react-icons/fa"; 
import { useAuth } from "../context/AuthContext"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = (e) => {
    e.preventDefault();

    
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    console.log("Attempting login with:", cleanEmail, cleanPass);

    
    if (cleanEmail === "tte@railconnect.com" && cleanPass === "tte123") {
      console.log("Logged in as TTE");
      const tteUser = { name: "TTE Admin", email: cleanEmail, role: "tte" };
      login(tteUser);
      navigate("/tte/charts"); 
      return; 
    }

   
    if (cleanEmail === "admin@railconnect.com" && cleanPass === "admin123") {
      console.log("Logged in as Admin");
      const adminUser = { name: "System Admin", email: cleanEmail, role: "admin" };
      login(adminUser);
      navigate("/admin/dashboard");
      return;
    }

    
    console.log("Logged in as User");
    const userData = {
      name: cleanEmail.split("@")[0],
      email: cleanEmail,
      role: "user"
    };

    login(userData);
    navigate("/"); 
  };

  return (
    <div className="login-page-wrapper">
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="sub-text">Please sign in to continue</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="icon" />
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

            <button type="submit" className="login-btn">LOGIN</button>
          </form>
          
          <p className="register-link">
            Don't have an account? <span onClick={() => navigate("/signup")}>Register Here</span>
          </p>
        </div>
      </div>
    </div>
  );
}