import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import setUserRoutes from "./routes/userRoutes.js";
import setPointsRoutes from "./routes/pointsRoutes.js";
import setPurchasesRoutes from "./routes/purchasesRoutes.js";
import PointsExpirationService from "./services/pointsExpirationService.js";
import PointsModel from "./models/pointsModel.js";
import UserModel from "./models/userModel.js";
import PointsExpirationCronService from "./services/pointsExpirationCronService.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis client
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));

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
