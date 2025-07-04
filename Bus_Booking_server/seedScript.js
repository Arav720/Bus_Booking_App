import dotenv from "dotenv";
import mongoose from "mongoose";
import Bus from "./models/bus.js";
import { buses, generateSeats, locations } from "./seedData.js";

dotenv.config();

const generateRandomTime = (baseDate) => {
  const hour = Math.floor(Math.random() * 12) + 6;
  const minute = Math.random() > 0.5 ? 30 : 0;
  const dateTime = new Date(baseDate);
  dateTime.setHours(hour, minute, 0, 0);
  return dateTime;
};

function createUniqueBusId(baseId, from, to, dayOffset) {
  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  return `${baseId}_${from}_${to}_${dayOffset}_${uniqueSuffix}`;
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Bus.deleteMany();
    console.log("🧹 Old Bus Data Deleted");

    const busesToInsert = [];
    const baseDate = new Date();

    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const from = locations[i];
        const to = locations[j];

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const travelDate = new Date(baseDate);
          travelDate.setDate(travelDate.getDate() + dayOffset);

          const returnDate = new Date(travelDate);
          returnDate.setDate(returnDate.getDate() + 1);

          buses.forEach((bus) => {
            const departureTime = generateRandomTime(travelDate);
            const arrivalTime = new Date(departureTime.getTime() + 9.5 * 60 * 60 * 1000);

            const forwardBusId = createUniqueBusId(bus.busId, from, to, dayOffset);

            busesToInsert.push({
              busId: forwardBusId,
              from,
              to,
              departureTime,
              arrivalTime,
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });

            const returnDeparture = generateRandomTime(returnDate);
            const returnArrival = new Date(returnDeparture.getTime() + 9.5 * 60 * 60 * 1000);

            const returnBusId = createUniqueBusId(bus.busId, to, from, dayOffset + 1);

            busesToInsert.push({
              busId: returnBusId,
              from: to,
              to: from,
              departureTime: returnDeparture,
              arrivalTime: returnArrival,
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });
          });
        }
      }
    }

    await Bus.insertMany(busesToInsert);
    console.log("✅ Database Seeded Successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Connection closed");
  }
}

seedDatabase();
