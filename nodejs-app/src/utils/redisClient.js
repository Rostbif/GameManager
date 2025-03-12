import redis from "redis";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Explicitly connect the Redis client
await redisClient.connect();

export default redisClient;
