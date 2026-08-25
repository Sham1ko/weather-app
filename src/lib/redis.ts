import { createClient } from "@redis/client";
import type { RedisClientType, SetOptions } from "@redis/client";

// ─────────────────────────────────────────────────────────────────────────────
// Флаг включения модуля Redis — переменная окружения REDIS_ENABLED:
//   true | on  | 1 | yes → модуль работает (значение по умолчанию)
//   false | off | 0 | no → модуль полностью отключён: клиент не создаётся,
//                          соединения не выполняются, кэш-функции сразу
//                          возвращают пустой результат.
// ─────────────────────────────────────────────────────────────────────────────
const parseRedisEnabled = () => {
  const raw = process.env.REDIS_ENABLED?.trim().toLowerCase();
  if (!raw) {
    return true;
  }
  return !["false", "off", "0", "no"].includes(raw);
};

const REDIS_ENABLED = parseRedisEnabled();

/** Включён ли модуль Redis (по переменной окружения REDIS_ENABLED). */
export const isRedisEnabled = () => REDIS_ENABLED;

let redis: RedisClientType | null = null;

if (REDIS_ENABLED) {
  redis = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redis.on("error", (err) => {
    void err;
    markRedisUnavailable();
  });
}

/** Клиент доступен только при включённом флаге. */
const getClient = (): RedisClientType | null => (REDIS_ENABLED ? redis : null);

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

const ensureRedisConnection = async (): Promise<boolean> => {
  const client = getClient();
  if (!client) {
    return false;
  }

  if (client.isOpen) {
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
      const outcome = await withTimeout(client.connect(), getRedisTimeoutMs());
      if (outcome.timedOut) {
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

/**
 * Доступен ли Redis прямо сейчас: флаг включён И соединение установлено.
 */
export const isRedisAvailable = () => REDIS_ENABLED && redisAvailable;

export const safeRedisGet = async (key: string) => {
  const isReady = await ensureRedisConnection();
  if (!isReady) {
    return null;
  }

  const client = getClient();
  if (!client) {
    return null;
  }

  try {
    const outcome = await withTimeout(client.get(key), getRedisTimeoutMs());
    if (outcome.timedOut) {
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

  const client = getClient();
  if (!client) {
    return false;
  }

  try {
    const outcome = await withTimeout(
      client.set(key, value, options),
      getRedisTimeoutMs()
    );
    if (outcome.timedOut) {
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
