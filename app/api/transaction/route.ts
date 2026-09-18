import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_prototype');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const merchantId = payload.id as string;

    const { amount, method, customerName } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
    }

    const transaction = await db.transaction.create({
      data: {
        merchantId,
        amount: parseFloat(amount),
        method: method || 'QR',
        customerName: customerName || 'Walk-in Customer',
        status: 'Success',
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction API Error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
