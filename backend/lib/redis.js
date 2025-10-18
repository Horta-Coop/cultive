import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

export const redis = new Redis(process.env.UPSTRASH_REDIS_URL);
// Key-value store
await redis.set('foo', 'bar');