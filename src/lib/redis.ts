import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export async function getOrSetCache<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.warn('[Redis] Cache get error:', err);
  }

  const result = await fetcher();

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(result));
  } catch (err) {
    console.warn('[Redis] Cache set error:', err);
  }

  return result;
}
