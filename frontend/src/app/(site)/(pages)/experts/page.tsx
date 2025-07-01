"use client";
import { useState, useEffect } from "react";
import api from "@/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Expert {
  _id: string;
  name: string;
  specialization: string;
  bio: string;
  experience: number;
  rating: number;
  pricePerHour: number;
  imageUrl: string;
  available: boolean;
}

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
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

const ExpertsPage = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("explore");
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/experts");
        setExperts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch experts");
        setLoading(false);
      }
    };

    const fetchExpertBookings = async () => {
      if (user?.role === "expert") {
        try {
          const response = await api.get("/bookings/expert/bookings");
          setBookings(response.data);
        } catch (err) {
          console.error("Failed to fetch bookings", err);
        }
      }
    };

    fetchExperts();
    if (user?.role === "expert") {
      fetchExpertBookings();
    }
  }, [user]);

  const handleBookExpert = (expert: Expert) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedExpert || !user) return;

    try {
      const response = await api.post("/bookings", {
        expertId: selectedExpert._id,
        buyer: {
          _id: user._id,
          name: user.name,
          email: user.email,
          whatsapp: user.whatsapp || "",
        },
        totalPrice: selectedExpert.pricePerHour,
      });

      alert("Booking request sent successfully!");
      setShowBookingModal(false);
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to book expert");
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/accept`);
      const updatedBooking = response.data;
      
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: "accepted" } : b
      ));
      
      // Open WhatsApp chat with buyer
      window.open(`https://wa.me/${updatedBooking.whatsapp}`, "_blank");
    } catch (err) {
      console.error("Failed to accept booking", err);
      alert("Failed to accept booking");
    }
  };

  if (loading) return <div className="text-center py-20">Loading experts...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">Our Experts</h1>
      
      {/* Tabs for expert view */}
      <div className="flex border-b mb-8">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "explore" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("explore")}
        >
          Explore Experts
        </button>
        {user?.role === "expert" && (
          <button
            className={`px-4 py-2 font-medium ${activeTab === "bookings" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        )}
      </div>

      {activeTab === "explore" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert) => (
            <div key={expert._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={expert.imageUrl || "/images/default-expert.jpg"}
                  alt={expert.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full"
                />
                {expert.available && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Available
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{expert.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{expert.specialization}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{expert.rating.toFixed(1)}</span>
                  <span className="mx-2">•</span>
                  <span>{expert.experience} years experience</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{expert.bio}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${expert.pricePerHour}/hr</span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
                    onClick={() => handleBookExpert(expert)}
                    disabled={!expert.available}
                  >
                    {expert.available ? "Book Now" : "Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Booking Requests</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500">You have no booking requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.buyer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.buyer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${booking.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === "pending" && (
                            <button
                              onClick={() => handleAcceptBooking(booking._id)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Accept
                            </button>
                          )}
                          {booking.status === "accepted" && (
                            <a
                              href={`https://wa.me/${booking.buyer.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Chat on WhatsApp
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
            <div className="mb-4">
              <p className="font-medium">Expert: {selectedExpert.name}</p>
              <p>Specialization: {selectedExpert.specialization}</p>
              <p>Rate: ${selectedExpert.pricePerHour} per hour</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertsPage;