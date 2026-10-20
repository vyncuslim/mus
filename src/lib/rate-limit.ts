/**
 * Lightweight in-memory sliding-window rate limiter to protect public API endpoints
 * from abusive burst traffic without requiring external infrastructure.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  clientKey: string,
  limit = 120,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(clientKey);

  if (!existing || existing.resetAt <= now) {
    const nextBucket: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(clientKey, nextBucket);
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: nextBucket.resetAt,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    allowed: existing.count <= limit,
    remaining,
    resetAt: existing.resetAt,
  };
}
