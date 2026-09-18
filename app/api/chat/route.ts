import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { GoogleGenAI } from '@google/genai';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_prototype');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const merchantId = payload.id as string;

    const { message } = await req.json();

    // Fetch actual data context for this merchant
    const transactions = await db.transaction.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const context = `You are VyaparDost, an AI assistant for a merchant. 
    Here is their recent transaction data: ${JSON.stringify(transactions)}.
    Answer their question helpfully and concisely.`;

    // Try real LLM if key exists
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: context }] },
          { role: 'user', parts: [{ text: message }] }
        ],
      });
      return NextResponse.json({ reply: response.text });
    } else {
      // Fallback robust mock
      const salesToday = transactions.reduce((sum, t) => sum + t.amount, 0);
      const reply = `[Mock Mode] I received your query: "${message}". Based on your ${transactions.length} recent transactions, you've made ₹${salesToday} today. Add a GEMINI_API_KEY to enable full AI!`;
      return NextResponse.json({ reply });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
