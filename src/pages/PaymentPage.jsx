import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios'; 
import { FaCreditCard, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { train,  totalAmount } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!train) {
      alert("No active booking session found.");
      navigate('/');
    }
  }, [train, navigate]);

  // --- Step 1: Initiate Razorpay Payment ---
  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // ✅ MOVE THIS LINE HERE (Inside the handler)
    const pnrNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    try {
      const orderRequest = {
        amount: totalAmount,
        customerEmail: user.email,
        pnr: pnrNumber 
      };

      const response = await axios.post('http://localhost:8085/api/payment/create-order', orderRequest);
      const orderData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      const options = {
        key: "rzp_test_SHTPIu38G8iRPQ", 
        amount: orderData.amount, 
        currency: "INR",
        name: "RailConnect",
        description: `Ticket Booking`,
        order_id: orderData.id, 
        handler: function (response) {
        
    console.log("REAL SIGNATURE IS:", response.razorpay_signature);
          verifyPaymentOnBackend(response, pnrNumber);
        },
        prefill: {
          name: user.name || "Passenger",
          email: user.email,
        },
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Initiation Error:", error);
      alert("Failed to initiate payment. Ensure Backend is active.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Step 2: Verify Payment Signature on Backend ---
  const verifyPaymentOnBackend = async (response, pnr) => {
  try {
    // Send pnr along with orderId, paymentId, and signature
    const verifyUrl = `http://localhost:8085/api/payment/verify?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&signature=${response.razorpay_signature}&pnr=${pnr}`;
    
    const result = await axios.post(verifyUrl);
    console.log(result.data);
    
    if (result.data.includes("Successfully")) {
       // Proceed to confirm booking on port 8083
    }
  } catch (error) {
    console.error("Verification failed", error);
  }
};

  if (!train) return null;

  // --- Simple Inline Styles for Alignment ---
  const styles = {
    wrapper: { padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    grid: { display: 'flex', gap: '30px', marginTop: '20px' },
    left: { flex: '2' },
    right: { flex: '1' },
    card: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#f9f9f9' },
    btn: { background: '#2563eb', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FaArrowLeft size={20}/></button>
          <h2>Secure Checkout</h2>
        </div>

        <div style={styles.grid}>
          {/* LEFT SIDE: PAYMENT ACTION */}
          <div style={styles.left}>
            <div style={styles.card}>
              <p>Complete your payment via our secure gateway.</p>
              <button onClick={handlePayment} style={styles.btn} disabled={isProcessing}>
                {isProcessing ? 'Initializing...' : `Pay ₹${totalAmount}`}
              </button>
              <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
                <FaShieldAlt /> 256-bit SSL Secure Connection
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div style={styles.right}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0 }}>Booking Summary</h3>
              <div style={styles.row}><span>Train:</span> <strong>{train.name}</strong></div>
              <div style={styles.row}><span>PNR:</span> <strong>Auto-gen</strong></div>
              <hr />
              <div style={{ ...styles.row, fontSize: '18px', color: '#2563eb' }}>
                <span>Total:</span> <strong>₹{totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;