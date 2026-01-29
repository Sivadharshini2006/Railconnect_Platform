import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ReservationCharts from './TTE/ReservationCharts';



// Import Pages
import Home from './pages/Home'; // Make sure Home.jsx is in src/pages/
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import PaymentPage from './pages/PaymentPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PnrStatus from './pages/PnrStatus';
import TicketVerification from "./TTE/TicketVerification"; // <--- IMPORT THIS
import WaitlistAllotment from "./TTE/WaitlistAllotment";   // <--- IMPORT THIS
import RoleAccess from "./context/RoleAccess";
import AdminDashboard from './admin/AdminDashboard';
import AddTrain from './admin/AddTrain';



function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* The Default Route now points to your new Home component */}
        <Route path="/" element={<Home />} />
        
        {/* Other Routes */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pnr-status" element={<PnrStatus />} />
        <Route path="/tte/charts" element={<ReservationCharts />} />
        {/* Add these routes for the TTE Header Links */}
<Route path="/tte/charts" element={<ReservationCharts />} />
<Route path="/tte/verification" element={<TicketVerification />} /> 
           <Route path="/tte/waitlist" element={<WaitlistAllotment />} />

<Route path="/" element={
             <RoleAccess roleType="user">
                <SearchResults />
             </RoleAccess>
           } />

<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/add-train" element={<AddTrain />} />

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;