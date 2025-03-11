import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import setUserRoutes from "./routes/userRoutes.js";
import setPointsRoutes from "./routes/pointsRoutes.js";
import setPurchasesRoutes from "./routes/purchasesRoutes.js";
import PointsExpirationCronService from "./services/pointsExpirationCronService.js";
import redisClient from "../utils/redisClient.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis client
// Test route to set and get a key-value pair in Redis
app.get("/test-redis", async (req, res) => {
  try {
    await redisClient.set("test-key", "test-value");
    const value = await redisClient.get("test-key");
    res.send(`Redis test key value: ${value}`);
  } catch (err) {
    console.error("Redis operation error:", err);
    res.status(500).send("Redis operation error");
  }
});

// Explicitly connect the Redis client
await redisClient.connect();

// Test route to set and get a key-value pair in Redis
app.get("/test-redis", async (req, res) => {
  try {
    await redisClient.set("test-key", "test-value");
    const value = await redisClient.get("test-key");
    res.send(`Redis test key value: ${value}`);
  } catch (err) {
    console.error("Redis operation error:", err);
    res.status(500).send("Redis operation error");
  }
});

// Routes
setUserRoutes(app);
setPointsRoutes(app);
setPurchasesRoutes(app);

// Create and start points expiration cron job
const pointsExpirationCronService = new PointsExpirationCronService();
pointsExpirationCronService.start();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
