// src/lib/rate-limit.ts
// Simple in-memory rate limiter for serverless environments.
// Note: In a multi-region serverless deployment (e.g., Vercel edge), this map 
// will be localized to the specific isolate. For true global rate limiting, 
// a solution like Redis (Upstash) is recommended.

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// Configure rate limit: 5 requests per minute
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(ip: string): { success: boolean; message?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up old entries occasionally (simple garbage collection)
  if (Math.random() < 0.1) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { success: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    // Rate limit exceeded
    return { 
      success: false, 
      message: 'Too many RSVP submissions. Please try again in a minute.' 
    };
  }

  // Increment count
  entry.count += 1;
  return { success: true };
}
