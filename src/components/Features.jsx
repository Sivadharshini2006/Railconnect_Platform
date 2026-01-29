import "./Features.css";

export default function Features() {
  return (
    <div className="features">
      <div className="card">
        🎟️
        <h3>Easy Booking</h3>
        <p>Book train tickets in just a few clicks</p>
      </div>

      <div className="card">
        ⏰
        <h3>Real-time Availability</h3>
        <p>Check live seat availability instantly</p>
      </div>

      <div className="card">
        🔐
        <h3>Secure Payment</h3>
        <p>100% safe and secure transactions</p>
      </div>
    </div>
  );
}
