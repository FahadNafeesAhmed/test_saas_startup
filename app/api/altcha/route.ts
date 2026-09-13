// ALTCHA challenge endpoint implemented with node:crypto, no altcha-lib dependency (its versions drifted between
// local and Vercel builds). Format per https://altcha.org/docs/server-integration:
//   challenge = sha256(salt + number), signature = hmac-sha256(hmacKey, challenge)
import { createHash, createHmac, randomBytes, randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';

const hmacKey = 'supersecretkey12345678901234567890';
const MAX_NUMBER = 50000;

export const dynamic = 'force-dynamic';

export async function GET() {
  const salt = randomBytes(12).toString('hex') + '?expires=' + (Math.floor(Date.now() / 1000) + 600);
  const number = randomInt(0, MAX_NUMBER + 1);
  const challenge = createHash('sha256').update(salt + number).digest('hex');
  const signature = createHmac('sha256', hmacKey).update(challenge).digest('hex');
  return NextResponse.json({ algorithm: 'SHA-256', challenge, maxnumber: MAX_NUMBER, salt, signature });
}
