import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Database connection string
const connectionString = process.env.POSTGRES_URL!;

// Create the connection
const client = postgres(connectionString, { max: 1 });

// Create the drizzle database instance
export const db = drizzle(client, { schema });
