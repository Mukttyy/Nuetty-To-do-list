import { betterAuth } from "better-auth";
import { pool } from "@/server/db";

function localDevelopmentOrigin(request?: Request): string[] {
  if (process.env.NODE_ENV === "production") return [];

  const origin = request?.headers.get("origin");
  if (!origin) return [];

  try {
    const url = new URL(origin);
    const isLoopback =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]";
    return url.protocol === "http:" && isLoopback ? [url.origin] : [];
  } catch {
    return [];
  }
}

export const auth = betterAuth({
  database: pool,
  trustedOrigins: localDevelopmentOrigin,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60,
    max: 100,
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
