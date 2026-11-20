import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export function hasClerkServer(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}

/** Returns the signed-in Clerk user id, or null for guests / missing Clerk config. */
export async function getOptionalUserId(): Promise<string | null> {
  if (!hasClerkServer()) return null;
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

export function getClientIp(req: NextRequest): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null
  );
}

/** Warm-cache scripts may bypass the free quota with a shared secret header. */
export function isWarmCacheRequest(req: NextRequest): boolean {
  const token = process.env.WARM_CACHE_TOKEN;
  if (!token) return false;
  return req.headers.get("x-warm-cache-token") === token;
}
