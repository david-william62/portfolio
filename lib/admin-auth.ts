import crypto from "crypto";
import type { NextRequest } from "next/server";

export const adminCookieName = "portfolio_admin";

const passwordSalt = "portfolio-admin-v1";
const passwordHash = "3d2ad116339cb91474976fe703c8502864cc3967ad53a469310582b0b25d0a44";
const sessionToken = crypto.createHash("sha256").update(`portfolio-session:${passwordHash}`).digest("hex");

function timingSafeEqualHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminPassword(password: string) {
  const candidateHash = crypto.pbkdf2Sync(password, passwordSalt, 210000, 32, "sha256").toString("hex");
  return timingSafeEqualHex(candidateHash, passwordHash);
}

export function getAdminSessionToken() {
  return sessionToken;
}

export function isAdminRequest(request: NextRequest) {
  return request.cookies.get(adminCookieName)?.value === sessionToken;
}
