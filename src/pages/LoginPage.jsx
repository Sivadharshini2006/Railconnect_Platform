import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./LoginPage.scss";
import { FaUser, FaLock } from "react-icons/fa"; 
import { useAuth } from "../context/AuthContext"; 

// 1. Import the BackButton Component
import BackButton from "../components/BackButton"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8081/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);

    // ✅ Normalize the role to stay consistent
    const rawRole = data.role || "";
    const cleanRole = rawRole.replace("ROLE_", "").toUpperCase();

    console.log("Redirecting user with role:", cleanRole);

    login({ email, role: cleanRole });

    // ✅ Use cleanRole for the checks
    if (cleanRole === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (cleanRole === "TTE") {
      navigate("/tte/charts");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Server Error");
  }
};

const handleLoginSubmit = async (credentials) => {
    try {
        const response = await fetch("http://localhost:8081/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });

        const data = await response.json(); // This contains { token, username, role }

        if (response.ok && data.token) {
            // ✅ This triggers the logic in AuthContext to save token & user
            login(data); 
            
            // Redirect based on role
            if (data.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/');
        }
    } catch (error) {
        console.error("Login failed", error);
    }
};


  return (
    <div className="login-page-wrapper">
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          
          {/* 2. Place the BackButton Here */}
          <div style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
            <BackButton />
          </div>

          <h2>Welcome Back</h2>
          <p className="sub-text">Please sign in to continue</p>
  <form onSubmit={(e) => {
    e.preventDefault();
    // Gather your form data into a 'credentials' object
    const credentials = { email, password }; 
    handleLoginSubmit(credentials); // 👈 Call the function here to fix the error
}}></form>

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