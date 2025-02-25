import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    try {
      await redisClient.connect();
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }

    process.on("SIGINT", () => {
      console.log("Shutting down Redis connection...");
      redisClient.quit();
      process.exit();
    });
  }

  return redisClient;
};
