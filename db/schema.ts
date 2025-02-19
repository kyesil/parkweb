import { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

// Domain tablosu
export const domains = pgTable('domains', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: integer('price'),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export type Domain = Partial<InferSelectModel<typeof domains>>;
// Teklifler tablosu
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  domain: varchar('domain', { length: 255 }).references(() => domains.name),
  email: varchar('email', { length: 255 }).notNull(),
  amount: integer('amount').notNull(),
  message: varchar('message',{length: 255}),
  verificationCode: varchar('verification_code', { length: 5 }),
  verificationExpiry: timestamp('verification_expiry'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Offer = InferSelectModel<typeof offers>;