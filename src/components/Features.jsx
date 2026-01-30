
import "./Features.scss";


export default function Features() {
  return (
    <div className="flex justify-center gap-6 my-16 mx-10">
      <div className="bg-white p-8 w-64 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-3">🎟️</div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Easy Booking</h3>
        <p className="text-gray-600 text-sm">Book train tickets in just a few clicks</p>
      </div>

      <div className="bg-white p-8 w-64 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-3">⏰</div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Real-time Availability</h3>
        <p className="text-gray-600 text-sm">Check live seat availability instantly</p>
      </div>

      <div className="bg-white p-8 w-64 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-3">🔐</div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Secure Payment</h3>
        <p className="text-gray-600 text-sm">100% safe and secure transactions</p>
      </div>
    </div>
  );
}
