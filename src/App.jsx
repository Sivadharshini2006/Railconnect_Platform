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
        
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pnr-status" element={<PnrStatus />} />



        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
    

{/* --- TTE ROUTES (Protected) --- */}
          <Route path="/tte/charts" element={
            <RoleAccess roleType="TTE">
              <ReservationCharts />
            </RoleAccess>
          } />
          <Route path="/tte/verification" element={
            <RoleAccess roleType="TTE">
              <TicketVerification />
            </RoleAccess>
          } />
          <Route path="/tte/waitlist" element={
            <RoleAccess roleType="TTE">
              <WaitlistAllotment />
            </RoleAccess>
          } />

          {/* --- ADMIN ROUTES (Protected) --- */}
          <Route path="/admin/dashboard" element={
            <RoleAccess roleType="ADMIN">
              <AdminDashboard />
            </RoleAccess>
          } />
          <Route path="/admin/add-train" element={
            <RoleAccess roleType="ADMIN">
              <AddTrain />
            </RoleAccess>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;