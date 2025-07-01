"use client";
import { useEffect, useState } from "react";
import api from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Booking {
  _id: string;
  productId: string;
  expertId: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    whatsapp: string;
  };
  totalPrice: number;
  status: "pending" | "accepted" | "cancled";
  createdAt: string;
}

const ExpertBookingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/expert/bookings");
        console.log("API response data:", response.data);
    
        if (!Array.isArray(response.data)) {
          console.warn("Warning: bookings response is not an array!", response.data);
          setBookings([]);
        } else {
          setBookings(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  // Optional: log bookings whenever they update
  useEffect(() => {
    console.log("Bookings updated:", bookings);
  }, [bookings]);

  const handleAccept = async (bookingId: string, buyerWhatsapp: string) => {
    try {
      await api.post(`/bookings/${bookingId}/accept`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "accepted" } : b))
      );
      window.open(`https://wa.me/${buyerWhatsapp}`, "_blank");
    } catch (err) {
      console.error("Error accepting booking:", err);
      alert("Failed to accept booking");
    }
  };

  if (loading) return <div className="text-center py-20">Loading bookings...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <div className="max-w-4xl mx-auto p-6 pt-15 bg-gray-100 mt-10">
      <h1 className="text-2xl font-semibold mb-4">Pending Booking Requests</h1>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {pendingBookings.map((booking) => (
            <li key={booking._id} className="p-4 border rounded shadow">
              <p>
                <strong>Buyer:</strong> {booking.buyer.name}
              </p>
              <p>
                <strong>Email:</strong> {booking.buyer.email}
              </p>
              <p>
                <strong>WhatsApp:</strong> {booking.buyer.whatsapp}
              </p>
              <p>
                <strong>Total Price:</strong> ${booking.totalPrice}
              </p>
              <button
                onClick={() =>
                  handleAccept(booking._id, booking.buyer.whatsapp)
                }
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept Booking
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpertBookingsPage;
