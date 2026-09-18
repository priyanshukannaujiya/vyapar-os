import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../../lib/db';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_prototype');

export async function POST(req: Request) {
  try {
    const { merchantId, password } = await req.json();

    if (!merchantId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchant = await db.merchant.findUnique({
      where: { merchantId },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, merchant.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ id: merchant.id, merchantId: merchant.merchantId, name: merchant.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, merchant: { id: merchant.id, name: merchant.name, merchantId: merchant.merchantId } });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
