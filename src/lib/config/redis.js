import { createClient } from "redis";

let client= null;

export const getRedis = async () => {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME || "default",
      password: process.env.REDIS_PASSWORD || "",
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 19164),
        tls: {},
      },
    });

    client.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    await client.connect();
  }

  return client;
};
