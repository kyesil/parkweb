import { domains, offers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
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
  domainName,
  email,
  amount,
  message,
  verificationCode,
}: {
  domainName: string;
  email: string;
  amount: number;
  message?: string;
  verificationCode: string;
}) {
  // Önce domain'i bul
  const domain = await getDomainByName(domainName);
  
  if (!domain || domain.length === 0) {
    throw new Error('Domain not found');
  }

  return await db.insert(offers).values({
    domainId: domain[0].id,
    email,
    amount,
    message,
    verificationCode,
    isVerified: false,
  });
}
