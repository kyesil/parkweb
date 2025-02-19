import { domains, offers } from '@/db/schema';
import { desc, eq, and, gt } from 'drizzle-orm';
import { db } from './drizzle';

export async function getDomains() {
  return await db.select().from(domains).orderBy(desc(domains.createdAt));
}

export async function getDomainByName(name: string) {
  return await db
    .select()
    .from(domains)
    .where(eq(domains.name, name))
    .limit(1);
}

export async function createOffer({
  domain,
  email,
  amount,
  message,
  verificationCode,
  verificationExpiry,
}: {
  domain: string;
  email: string;
  amount: number;
  message?: string;
  verificationCode: string;
  verificationExpiry: Date;
}) {


  return await db.insert(offers).values({
    domain,
    email,
    amount,
    message,
    verificationCode,
    verificationExpiry,
    isVerified: false,
  });
}

export async function verifyOffer(email: string, code: string) {
  const now = new Date();
  
  // Doğrulama kodunu kontrol et
  const offer = await db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.email, email),
        eq(offers.verificationCode, code),
        eq(offers.isVerified, false),
        gt(offers.verificationExpiry, now)
      )
    )
    .limit(1);

  if (!offer || offer.length === 0) {
    throw new Error('Invalid or expired verification code');
  }

  // Teklifi doğrulanmış olarak işaretle
  return await db
    .update(offers)
    .set({ isVerified: true })
    .where(eq(offers.id, offer[0].id));
}
