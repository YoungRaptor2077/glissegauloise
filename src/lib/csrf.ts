const ALLOWED_ORIGINS = [
  "https://glissegauloisse.com",
  "https://www.glissegauloisse.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

/**
 * Verify that the request comes from an allowed origin.
 * Returns true if the request is safe, false if it should be rejected.
 */
export function verifyCsrf(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // If no origin header (e.g., same-origin navigation), check referer
  if (!origin && !referer) {
    // Allow requests with no origin/referer (server-side, curl, etc.)
    // In production, you might want to be stricter
    return true;
  }

  if (origin) {
    return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
  }

  if (referer) {
    return ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed));
  }

  return false;
}
