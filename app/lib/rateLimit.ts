type RateLimitEntry = {
  count: number;
  firstAttempt: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(clientIp: string, maxAttempts: number = 2, windowMs: number = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry) {
    rateLimitMap.set(clientIp, { count: 1, firstAttempt: now });
    return true;
  }

  // Zaman penceresi dışındaysa sıfırla
  if (now - entry.firstAttempt > windowMs) {
    rateLimitMap.set(clientIp, { count: 1, firstAttempt: now });
    return true;
  }

  // Rate limit kontrolü
  if (entry.count >= maxAttempts) {
    return false;
  }

  // Sayacı artır
  entry.count += 1;
  rateLimitMap.set(clientIp, entry);
  return true;
} 