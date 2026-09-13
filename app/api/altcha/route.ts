import { NextResponse } from 'next/server';
import { createChallenge } from 'altcha-lib';

const hmacKey = 'supersecretkey12345678901234567890';

export async function GET() {
  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 50000 // typical complexity
  });
  return NextResponse.json(challenge);
}
