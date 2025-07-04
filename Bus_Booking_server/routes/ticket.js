import express from "express";
import {
  bookTicket,
  getUserTickets,
  getGuestTickets, // ✅ New guest ticket controller
} from "../controllers/ticket.js";
import verifyToken from "../middleware/verify.js";

const router = express.Router();

router.post("/book", bookTicket); // ✅ allow guests
router.get("/my-tickets", verifyToken, getUserTickets); // ✅ user only
router.get("/guest-tickets", getGuestTickets); // ✅ guest-only endpoint

export default router;
