import express from "express";
import { getBusDetails, searchBuses } from "../controllers/bus.js";
import Bus from "../models/bus.js";

const router = express.Router();

// ✅ Fetch specific bus by ID


// ✅ Search buses (e.g., by from, to, date)
router.post("/search", searchBuses);

// ✅ Get all buses
router.get("/all", async (req, res) => {
  try {
    console.log("reached destination")
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch buses" });
  }
});

// ✅ Create a sample bus (useful for testing)
router.post("/create", async (req, res) => {
  try {
    const bus = new Bus({
      busId: "BUS123",
      from: "Lucknow",
      to: "Delhi",
      price: 500,
      availableSeats: 6,             // ✅ Required
      duration: "6h",                // ✅ Required
      departureTime: new Date("2025-07-05T08:00:00Z"),
      arrivalTime: new Date("2025-07-05T14:00:00Z"),
      company: "Red Travels",
      busType: "AC Sleeper",
      originalPrice: 600,
      rating: 4.5,
      totalReviews: 50,
      badges: ["Popular", "On-Time"],
      seats: [
        [
          { seat_id: 1, booked: false, type: "window" },
          { seat_id: 2, booked: false, type: "side" },
          { seat_id: 3, booked: false, type: "path" }
        ],
        [
          { seat_id: 4, booked: false, type: "window" },
          { seat_id: 5, booked: false, type: "side" },
          { seat_id: 6, booked: false, type: "path" }
        ]
      ]
    });

    await bus.save();
    res.status(201).json({ success: true, message: "Bus created", data: bus });
  } catch (error) {
    console.error("❌ Error creating bus:", error.message);
    res.status(500).json({ error: "Error creating bus", details: error.message });
  }
});

router.get("/:busId", getBusDetails);

export default router;
