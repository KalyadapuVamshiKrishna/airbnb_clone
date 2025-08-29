import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { type, itemId, checkIn, checkOut, date, numberOfGuests, name, phone, price } = req.body;

    // Map item based on type
    const bookingData = {
      type,
      numberOfGuests,
      name,
      phone,
      price,
      user: req.user ? req.user.id : null, // optional for now
    };

    if (type === "place") {
      bookingData.place = itemId;
      bookingData.checkIn = checkIn;
      bookingData.checkOut = checkOut;
    } else {
      bookingData.item = itemId; // For experience/service
      bookingData.date = date;
    }

    const booking = await Booking.create(bookingData);
    res.json(booking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Booking failed" });
  }
};


export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("place");
  res.json(bookings);
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Optional: Check if the user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "canceled") return res.status(400).json({ error: "Only canceled bookings can be refunded" });

    booking.refundRequested = true;
    await booking.save();

    res.json({ success: true, message: "Refund request submitted" });
  } catch (error) {
    console.error("Refund Request Error:", error);
    res.status(500).json({ error: "Refund request failed" });
  }
};
