import Booking from "../models/Booking.js";
import Place from "../models/Place.js";
import Experience from "../models/Experience.js";
import { Service } from "../models/Service.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose"; 

// status constants
const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELED: "canceled",
};

// ------------------- CREATE BOOKING -------------------
export const createBooking = async (req, res) => {
  try {
    const {
      type,
      itemId,
      checkIn,
      checkOut,
      date,
      numberOfGuests,
      name,
      phone,
      paymentMethod,
      transactionId, // Keep this if frontend might send it (e.g., from pre-payment)
      // Removed client-side price/user data for server-side authority
    } = req.body;

    // ---------------- VALIDATION BLOCK ----------------
    if (!type || !itemId || !numberOfGuests || !name || !phone || !paymentMethod) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // 🛑 FIX 1: Correctly return HTTP response for validation failure
   const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, error: "Invalid phone number format. Must be a 10-digit valid Indian number." });
  }
 

    // Validate name (min 2 chars, alphabetic)
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ success: false, error: "Name must contain only letters and be at least 2 characters long." });
    }

    // Validate number of guests
    if (isNaN(numberOfGuests) || Number(numberOfGuests) <= 0) {
      return res.status(400).json({ success: false, error: "Invalid number of guests" });
    }

    // Additional date validation for places
    if (type === "place") {
      if (!checkIn || !checkOut) {
        return res.status(400).json({ success: false, error: "Check-in and check-out dates are required" });
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) { // Use getTime() for robustness
        return res.status(400).json({ success: false, error: "Invalid check-in/check-out date format" });
      }

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ success: false, error: "Check-out date must be after check-in date" });
      }
    } else if (type === "experience" || type === "service") {
        if (!date) {
            return res.status(400).json({ success: false, error: "Date is required for this booking type" });
        }
        if (isNaN(new Date(date).getTime())) {
            return res.status(400).json({ success: false, error: "Invalid date format" });
        }
    }

    // ---------------- ITEM & PRICE CALCULATION ----------------

    let itemDoc; // ⬅ FIX 2: Unified variable for item details
    let price = 0;

    switch (type) {
      case "place": {
        itemDoc = await Place.findById(itemId);
        if (!itemDoc) return res.status(404).json({ success: false, error: "Place not found" });

        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
          place: itemId,
          status: "confirmed",
          $or: [
            { checkIn: { $lt: checkOut, $gte: checkIn } },
            { checkOut: { $lte: checkOut, $gt: checkIn } },
            { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
          ],
        });

        if (overlappingBooking) {
          return res.status(400).json({ success: false, error: "Place already booked for selected dates" });
        }

        const oneDay = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / oneDay);
        price = itemDoc.price * nights;
        break;
      }

      case "experience": {
        itemDoc = await Experience.findById(itemId);
        if (!itemDoc) return res.status(404).json({ success: false, error: "Experience not found" });
        price = itemDoc.price * Number(numberOfGuests);
        break;
      }

      case "service": {
        itemDoc = await Service.findById(itemId);
        if (!itemDoc) return res.status(404).json({ success: false, error: "Service not found" });
        price = itemDoc.price * Number(numberOfGuests);
        break;
      }

      default:
        return res.status(400).json({ success: false, error: "Invalid booking type" });
    }

    // Calculate final amounts based on server data
    const serviceFee = Math.max(50, +(price * 0.05).toFixed(2));
    const totalAmount = price + serviceFee;

    // ---------------- CREATE BOOKING DATA ----------------

    const bookingData = {
      type,
      numberOfGuests: Number(numberOfGuests),
      name,
      phone,
      price, // Base price
      serviceFee,
      totalAmount,
      // 💡 Use itemDoc for address/location details
      address: itemDoc.address || itemDoc.location || "", 
      paymentMethod,
      status: BOOKING_STATUS.CONFIRMED, // Status based on your frontend flow
      user: req.user ? req.user.id : null, // Assuming user is attached by middleware
      // 💡 Use transactionId if passed (e.g., successful external payment), otherwise generate
      transactionId: transactionId || `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    };

    if (type === "place") {
      bookingData.place = itemId;
      bookingData.checkIn = checkIn;
      bookingData.checkOut = checkOut;
    } else {
      bookingData.item = itemId;
      bookingData.date = date;
      bookingData.itemModel = type === "experience" ? "Experience" : "Service";
    }

    // Save booking to the database
    const booking = await Booking.create(bookingData);
    
    // NOTE: If sending a confirmation email here is causing the timeout, 
    // you must move that logic into an asynchronous job or service.

    res.status(201).json({ success: true, bookingId: booking._id, booking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, error: error.message || "Booking failed" });
  }
};


// ------------------- INITIATE PAYMENT -------------------
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, error: "Missing bookingId" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    if (booking.status !== BOOKING_STATUS.PENDING) {
      return res.status(400).json({ success: false, error: "Booking already paid or canceled" });
    }

    // Simulate payment success (80% success rate for demo)
    const paymentSuccess = Math.random() > 0.2;
    if (!paymentSuccess) return res.status(402).json({ success: false, error: "Payment failed" });

    booking.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    booking.status = BOOKING_STATUS.CONFIRMED;
    await booking.save();

    res.json({ success: true, transactionId: booking.transactionId, status: booking.status });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ success: false, error: "Payment initiation failed" });
  }
};

// ------------------- GET BOOKINGS -------------------
export const getUserBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const bookings = await Booking.find({ user: req.user.id })
      .populate("place")
      .populate("item");
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
};

// ------------------- GET SINGLE BOOKING -------------------
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(id)
      .populate("place")
      .populate("item");
    
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error("Get Booking Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch booking" });
  }
};

// ------------------- CANCEL BOOKING -------------------
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    // Check authorization only if user is logged in
    if (req.user && booking.user && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized action" });
    }

    if (booking.status === BOOKING_STATUS.CANCELED) {
      return res.status(400).json({ success: false, error: "Booking already canceled" });
    }

    booking.status = BOOKING_STATUS.CANCELED;
    await booking.save();

    res.json({ success: true, message: "Booking canceled successfully", booking });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ success: false, error: "Failed to cancel booking" });
  }
};

// ------------------- REQUEST REFUND -------------------
export const requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    // Check authorization only if user is logged in
    if (req.user && booking.user && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized action" });
    }

    if (booking.status !== BOOKING_STATUS.CANCELED) {
      return res.status(400).json({ success: false, error: "Only canceled bookings can be refunded" });
    }

    if (booking.refundRequested) {
      return res.status(400).json({ success: false, error: "Refund already requested" });
    }

    booking.refundRequested = true;
    booking.refundRequestedAt = new Date();
    await booking.save();

    res.json({ success: true, message: "Refund request submitted", booking });
  } catch (error) {
    console.error("Refund Request Error:", error);
    res.status(500).json({ success: false, error: "Refund request failed" });
  }
};

// ------------------- SEND RECEIPT EMAIL -------------------
// controllers/emailController.js


export const sendReceiptEmail = async (req, res) => {
  try {
    const { email, bookingId } = req.body;

    if (!email || !bookingId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing email or bookingId" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("place")
      .populate("item");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    const subject = "Your Booking Receipt - Domio";
    const message = `
      Thank you for your booking with Domio!
      
      Booking Details:
      ----------------
      Booking ID: ${booking._id}
      Transaction ID: ${booking.transactionId || "N/A"}
      Total Paid: ₹${booking.totalAmount}
      Item: ${
        booking.type === "place"
          ? booking.place?.title
          : booking.item?.title || "N/A"
      }
      Guest Name: ${booking.name}
      Phone: ${booking.phone}
      Number of Guests: ${booking.numberOfGuests}
      
      Thank you for choosing Domio!
    `;

    // If SMTP is not configured, simulate success
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("SMTP configuration not found, simulating email send");
      return res.json({
        success: true,
        message: "Receipt sent successfully (simulated)",
      });
    }

    // Configure Nodemailer correctly
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: '"Domio" <no-reply@domio.com>',
      to: email,
      subject,
      text: message,
    });

    res.json({ success: true, message: "Receipt sent successfully" });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ success: false, error: "Failed to send receipt" });
  }
};

// ------------------- VERIFY BOOKING -------------------
export const verifyBooking = async (req, res) => {
  try {
    const { tx } = req.query;

    if (!tx) {
      return res
        .status(400)
        .json({ success: false, error: "Missing transaction reference" });
    }

    const bookingDoc = await Booking.findOne({ transactionId: tx })
      .populate("place")
      .populate("item");

    if (!bookingDoc) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    const responseBooking = {
      _id: bookingDoc._id,
      type: bookingDoc.type,
      status: bookingDoc.status,
      transactionId: bookingDoc.transactionId,
      name: bookingDoc.name,
      phone: bookingDoc.phone,
      numberOfGuests: bookingDoc.numberOfGuests,
      price: bookingDoc.price || 0,
      serviceFee: bookingDoc.serviceFee || 0,
      totalAmount: bookingDoc.totalAmount || 0,
      paymentMethod: bookingDoc.paymentMethod || "N/A",
      checkIn: bookingDoc.checkIn || null,
      checkOut: bookingDoc.checkOut || null,
      date: bookingDoc.date || null,
      refundRequested: bookingDoc.refundRequested || false,
      refundRequestedAt: bookingDoc.refundRequestedAt || null,
      createdAt: bookingDoc.createdAt,
      place: bookingDoc.place || null,
      item: bookingDoc.item || null,
      address: bookingDoc.address || null,
    };

    res.json({ success: true, booking: responseBooking });
  } catch (error) {
    console.error("Verify booking error:", error);
    res.status(500).json({ success: false, error: "Failed to verify booking" });
  }
};


// ------------------- FETCH ITEM DETAILS -------------------
export const getItemDetails = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!type || !id) {
      return res.status(400).json({ success: false, error: "Missing type or id" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }

    let item;
    switch (type) {
      case "place":
        item = await Place.findById(id);
        break;
      case "experience":
        item = await Experience.findById(id);
        break;
      case "service":
        item = await Service.findById(id);
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid type. Must be 'place', 'experience', or 'service'" });
    }

    if (!item) {
      return res.status(404).json({ success: false, error: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` });
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error("Get item details error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch item details" });
  }
};