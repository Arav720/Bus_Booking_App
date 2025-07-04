import Bus from "../models/bus.js";
import User from "../models/user.js";
import Ticket from "../models/ticket.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Logged-in user's ticket history
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const tickets = await Ticket.find({ user: userId })
      .populate("bus", "busId from to departureTime arrivalTime price")
      .sort({ bookedAt: -1 });

    res.status(200).json({
      success: true,
      tickets: tickets || [],
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Guest and logged-in user ticket booking
export const bookTicket = async (req, res) => {
  try {
    const { busId, date, seatNumbers, guestName, guestEmail } = req.body;
    const userId = req.user?._id || null;

    if (!busId || !date || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!userId && (!guestName || !guestEmail)) {
      return res.status(400).json({ error: "Guest name and email required" });
    }

    const bus = await Bus.findOne({ busId });
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    const unavailableSeats = seatNumbers.filter((seatNum) =>
      bus.seats.some((row) =>
        row.some((seat) => seat.seat_id === seatNum && seat.booked)
      )
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ error: "Some seats are already booked" });
    }

    const total_fare = bus.price * seatNumbers.length;

    const newTicket = new Ticket({
      user: userId,
      guestName,
      guestEmail,
      bus: bus._id,
      date,
      seatNumbers,
      total_fare,
      pnr: uuidv4().slice(0, 12).toUpperCase(),
    });

    await newTicket.save();

    // Mark seats as booked
    bus.seats.forEach((row) => {
      row.forEach((seat) => {
        if (seatNumbers.includes(seat.seat_id)) {
          seat.booked = true;
        }
      });
    });

    await bus.save();

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Guest ticket fetch using email
export const getGuestTickets = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Guest email is required" });
    }

    const tickets = await Ticket.find({ guestEmail: email })
      .populate("bus", "busId from to departureTime arrivalTime price")
      .sort({ bookedAt: -1 });

    res.status(200).json({
      success: true,
      tickets: tickets || [],
    });
  } catch (error) {
    console.error("Error fetching guest tickets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
