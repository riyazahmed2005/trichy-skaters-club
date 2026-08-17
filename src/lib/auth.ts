import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'e9a2636ebcde11681abdfa515c1e54911f42277d33261a8682054c7d03f0de01'
);

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  return decrypt(sessionToken);
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  
  // Fetch fresh user from DB to verify role and status
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
}

export async function loginSession(user: SessionPayload) {
  const sessionToken = await encrypt(user);
  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function logoutSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
