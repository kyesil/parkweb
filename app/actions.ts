'use server';

import { revalidatePath } from 'next/cache';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { Offer, offers } from '@/db/schema';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { checkRateLimit } from './lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateVerificationCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function saveOffer(offer: Offer) {
  const headersList =  await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  
  // Rate limit kontrolü
  if (!checkRateLimit(ip)) {
    throw new Error('Too many attempts. Please try again in 5 minutes.');
  }

  offer.verificationCode = generateVerificationCode();
  offer.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const { data, error } = await resend.emails.send({
    from: 'Domain Offers <noreply@voltar.uk>',
    to: offer.email,
    subject: `Verification Code for ${offer.domain} Offer`,
    html: `
    <div>
    <h2>Verify Your Offer for ${offer.domain}</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${offer.verificationCode}</strong>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        </div>
        `,
  });
  
  if (error) {
    console.log(error);
    return Response.json({ error }, { status: 400 });
  }

  return await db.insert(offers).values(offer);
}

export async function verifyOffer(verificationCode: string) {
  const now = new Date();
  const offer = await db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.verificationCode, verificationCode),
        eq(offers.isVerified, false),
        gt(offers.verificationExpiry, now)
      )
    )
    .limit(1);

  if (!offer || offer.length === 0) {
    throw new Error('Invalid or expired verification code');
  }

  await db
    .update(offers)
    .set({ isVerified: true })
    .where(eq(offers.id, offer[0].id));

  return offer[0];
}


