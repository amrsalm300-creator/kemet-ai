import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// تهيئة العميل باستخدام المفتاح من البيئة مباشرة
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: 'الرجاء إرسال رسالة.' }, { status: 400 });
    }

    // استدعاء الموديل بالطريقة الرسمية الصحيحة للمكتبة
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: "أنت مساعد ذكي لمنصة السياحة المصرية Kemet AI التابعة لشركة Unique. أجب على هذا السؤال باللغة العربية باختصار واحترافية: " + message }]
        }
      ]
    });

    // استخراج النص مباشرة من استجابة المكتبة الرسمية
    const reply = response.text || "أهلاً بك، تفضل بطرح سؤالك وسأساعدك فوراً.";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('AI SDK Error:', error);
    return NextResponse.json({ success: false, reply: 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي.' }, { status: 500 });
  }
}