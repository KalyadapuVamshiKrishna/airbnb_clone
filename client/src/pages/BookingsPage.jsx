"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AccountNav from "../components/Account/AccountNav";
import PlaceImg from "../components/Places/PlaceImg";
import BookingDates from "../components/Booking/BookingDates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmDelete) return;

    try {
      setDeleting(id);
      await axios.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setIsModalOpen(true); // Show success modal
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-6">
      <AccountNav />

      <h1 className="text-3xl font-bold mt-6 mb-4">Your Bookings</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && bookings?.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No bookings found.
        </div>
      )}

      <div className="flex flex-col gap-8">
        {bookings?.map((booking) => {
          const loc = [
            booking.place.location?.city,
            booking.place.location?.country,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <Card
              key={booking._id}
              className="flex flex-col lg:flex-row gap-6 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-3xl overflow-hidden"
            >
              {/* Left: Place Image */}
              <div className="lg:w-80 w-full h-64 lg:h-auto flex-shrink-0 relative">
                <PlaceImg
                  place={booking.place}
                  className="w-full h-full object-cover rounded-l-3xl"
                />
              </div>

              {/* Right: Details */}
              <CardContent className="flex flex-col justify-between flex-1 p-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    {booking.place.title}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" /> {loc || "—"}
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-4 h-4 fill-black text-black" />
                    <span className="text-gray-700">
                      {booking.place.ratingAvg?.toFixed(1) ?? "New"}
                    </span>
                  </div>

                  <BookingDates
                    booking={booking}
                    className="text-gray-500 text-sm"
                  />

                  <p className="mt-3 text-gray-700 text-sm">
                    Price paid:{" "}
                    <span className="font-semibold">₹{booking.price}</span>
                  </p>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  <Button
                    as={Link}
                    to={`/account/bookings/${booking._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    to={`/account/bookings/${booking._id}/pay`}
                    variant="outline"
                    className="flex-1"
                  >
                    Pay Now
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBooking(booking._id)}
                    disabled={deleting === booking._id}
                    className="flex items-center gap-2 flex-1"
                  >
                    {deleting === booking._id ? "Deleting..." : <Trash2 />}
                    {deleting === booking._id ? "" : "Cancel Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal for cancellation success */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            Booking Cancelled Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Your cancellation is confirmed. Refund will be processed within{" "}
            <span className="font-semibold">4 to 7 working days</span>.
          </p>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            OK
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
