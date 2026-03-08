import { createClient } from 'redis';

const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).__ENV) {
    return (window as any).__ENV[key];
  }
  return import.meta.env[key] || process.env[key];
};

const REDIS_URL = getEnvVar('REDIS_URL');

const client = createClient({
  url: REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.error('Redis Client Error', err));

/** Returns Redis client or null if connection unavailable. Prefer getCachedData/setCachedData (they never throw). */
export async function getRedisClient(): Promise<ReturnType<typeof createClient> | null> {
  try {
    if (!client.isOpen) await client.connect();
    return client;
  } catch (err) {
    console.warn('Redis getRedisClient failed:', (err as Error)?.message || err);
    return null;
  }
}

/** Returns cached value or null if key missing / Redis unavailable. Never throws. */
export async function getCachedData(key: string) {
  try {
    const redis = await getRedisClient();
    if (!redis) return null;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Redis getCachedData failed (using source fallback):', (err as Error)?.message || err);
    return null;
  }
}

/** Caches value; no-op if Redis unavailable. Never throws. */
export async function setCachedData(key: string, data: any, ttl: number = 3600) {
  try {
    const redis = await getRedisClient();
    if (!redis) return;
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.warn('Redis setCachedData failed (data still returned):', (err as Error)?.message || err);
  }
} 