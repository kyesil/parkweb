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

// Teklifler tablosu
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  domainId: integer('domain_id').references(() => domains.id),
  email: varchar('email', { length: 255 }).notNull(),
  amount: integer('amount').notNull(),
  message: text('message'),
  verificationCode: varchar('verification_code', { length: 6 }),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
