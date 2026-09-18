import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../../lib/db';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_prototype');

export async function POST(req: Request) {
  try {
    const { merchantName, merchantId, password } = await req.json();

    if (!merchantName || !merchantId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await db.merchant.findUnique({
      where: { merchantId },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Merchant ID already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newMerchant = await db.merchant.create({
      data: {
        merchantId,
        name: merchantName,
        passwordHash,
      },
    });

    const token = await new SignJWT({ id: newMerchant.id, merchantId: newMerchant.merchantId, name: newMerchant.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, merchant: { id: newMerchant.id, name: newMerchant.name, merchantId: newMerchant.merchantId } });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
