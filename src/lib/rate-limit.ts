const rateMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter.
 * @param key - Unique identifier (e.g., IP + route)
 * @param limit - Max requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);

  // Clean up old entries periodically
  if (rateMap.size > 10000) {
    for (const [k, v] of rateMap.entries()) {
      if (v.resetAt < now) rateMap.delete(k);
    }
  }

  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

export function getRateLimitKey(request: Request, prefix: string): string {
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  return `${prefix}:${ip}`;
}
