import { createClient } from "@redis/client";
import type { SetOptions } from "@redis/client";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

let redisAvailable = false;
let hasRedisFailedOnce = false;
let connectPromise: Promise<boolean> | null = null;
let lastConnectAttempt = 0;
const INITIAL_REDIS_TIMEOUT_MS = 3000;
const POST_FAILURE_TIMEOUT_MS = 500;
const CONNECT_COOLDOWN_MS = 30_000;

const markRedisUnavailable = () => {
  redisAvailable = false;
  if (!hasRedisFailedOnce) {
    hasRedisFailedOnce = true;
  }
};

const getRedisTimeoutMs = () => {
  if (!hasRedisFailedOnce) {
    return INITIAL_REDIS_TIMEOUT_MS;
  }
  return POST_FAILURE_TIMEOUT_MS;
};

const withTimeout = async <T>(promise: Promise<T>, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const wrapped = promise
    .then((value) => ({ ok: true as const, value }))
    .catch((error) => ({ ok: false as const, error }));
  const timeout = new Promise<{ timedOut: true }>((resolve) => {
    timeoutId = setTimeout(() => resolve({ timedOut: true }), ms);
  });

  const outcome = await Promise.race([
    wrapped.then((result) => ({ timedOut: false as const, result })),
    timeout,
  ]);

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  return outcome;
};

redis.on("error", (err) => {
  void err;
  markRedisUnavailable();
});

const ensureRedisConnection = async () => {
  if (redis.isOpen) {
    redisAvailable = true;
    return true;
  }

  const now = Date.now();
  if (now - lastConnectAttempt < CONNECT_COOLDOWN_MS) {
    return false;
  }

  if (connectPromise) {
    return connectPromise;
  }

  lastConnectAttempt = now;
  connectPromise = (async () => {
    try {
      const outcome = await withTimeout(redis.connect(), getRedisTimeoutMs());
      if ("timedOut" in outcome) {
        markRedisUnavailable();
        return false;
      }
      if (!outcome.result.ok) {
        markRedisUnavailable();
        return false;
      }
      redisAvailable = true;
      return true;
    } catch (err) {
      void err;
      markRedisUnavailable();
      return false;
    } finally {
      connectPromise = null;
    }
  })();

  return connectPromise;
};

export const isRedisAvailable = () => redisAvailable;

export const safeRedisGet = async (key: string) => {
  const isReady = await ensureRedisConnection();
  if (!isReady) {
    return null;
  }

  try {
    const outcome = await withTimeout(redis.get(key), getRedisTimeoutMs());
    if ("timedOut" in outcome) {
      markRedisUnavailable();
      return null;
    }
    if (!outcome.result.ok) {
      markRedisUnavailable();
      return null;
    }
    return outcome.result.value ?? null;
  } catch (err) {
    void err;
    markRedisUnavailable();
    return null;
  }
};

export const safeRedisSet = async (
  key: string,
  value: string,
  options?: SetOptions
) => {
  const isReady = await ensureRedisConnection();
  if (!isReady) {
    return false;
  }

  try {
    const outcome = await withTimeout(
      redis.set(key, value, options),
      getRedisTimeoutMs()
    );
    if ("timedOut" in outcome) {
      markRedisUnavailable();
      return false;
    }
    if (!outcome.result.ok) {
      markRedisUnavailable();
      return false;
    }
    return true;
  } catch (err) {
    void err;
    markRedisUnavailable();
    return false;
  }
};

export default redis;
