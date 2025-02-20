'use server';

import { eq, and, gt } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Offer, offers } from '@/db/schema';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { checkRateLimit } from './lib/rateLimit';
import { generateVerifyCode, sendOffer, sendVerify } from './lib/mail';





export async function saveOffer(offer: Offer) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  // Rate limit kontrolü
  if (!checkRateLimit(ip)) {
    throw new Error('Too many attempts. Please try again in 5 minutes.');
  }

  offer.verificationCode = generateVerifyCode();
  offer.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const { data, error } = await sendVerify(offer.email, offer.verificationCode, offer.domain);

  if (error) {
    console.log("err_mail", error, "data_mail", data);
    return Response.json({ error }, { status: 400 });
  }

  return await db.insert(offers).values(offer);
}

export async function verifyOffer(email:string,code: any) {
  const now = new Date();

  const result = await db
    .update(offers)
    .set({ isVerified: true })
    .where(and(
      eq(offers.email, email),
      eq(offers.verificationCode, code),
      eq(offers.isVerified, false),
      gt(offers.verificationExpiry, now)
    ),
    ).returning();
  if (!result || result.length === 0) {
    throw new Error('Not verified');
  }

  const { data, error } = await sendOffer(result[0]);

  if (error) {
    console.log("err_mail", error, "data_mail", data);
    return Response.json({ error }, { status: 400 });
  }
  return result;
}


