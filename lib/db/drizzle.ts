import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Lazy connection: don't crash at import time if POSTGRES_URL is missing
// (needed for Next.js static page generation on Vercel where no DB is available)
let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient() {
  if (!_client) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }
    _client = postgres(process.env.POSTGRES_URL);
  }
  return _client;
}

function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}

// Export proxies so existing `db.select(...)` / `client` calls still work
export const client = new Proxy({} as ReturnType<typeof postgres>, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
  apply(_target, thisArg, args) {
    return Reflect.apply(getClient() as unknown as Function, thisArg, args);
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  }
});

