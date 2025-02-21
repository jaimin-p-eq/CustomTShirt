import { createClient } from "redis"; // Import the createClient function from Redis

// Function to establish a Redis connection
let redisClient;

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379", // Default to localhost if no Redis URL is provided
    });

    // Handle Redis connection events
    try {
      await redisClient.connect(); // Connect asynchronously
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("Shutting down Redis connection...");
      redisClient.quit();
      process.exit();
    });
  }

  return redisClient;
};
