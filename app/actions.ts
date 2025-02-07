'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { offers } from '@/db/schema';


export async function saveOffer(offer: any) {
  return await db.insert(offers).values(offer);
}

export async function verifyOffer(verificationCode: string) {
  const offer = await db
    .select()
    .from(offers)
    .where(eq(offers.verificationCode, verificationCode))
    .limit(1);

  if (!offer || offer.length === 0) {
    throw new Error('Offer not found');
  }

  await db.update(offers).set({ isVerified: true }).where(eq(offers.id, offer[0].id));

  await revalidatePath('/api/offers');
}
