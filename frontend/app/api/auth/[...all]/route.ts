/**
 * Better Auth API route handler.
 * Handles all authentication requests at /api/auth/*
 * Per specs/features/authentication.md
 */
import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import { Pool } from "pg";

/**
 * Create PostgreSQL connection pool.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * Better Auth server configuration.
 */
export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    // Password requirements
    minPasswordLength: 8,
  },
  session: {
    // Session configuration
    expiresIn: 60 * 60 * 24, // 24 hours in seconds
    updateAge: 60 * 60, // Update session every hour
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

/**
 * Export Next.js route handlers for Better Auth.
 */
const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = handler.POST;
