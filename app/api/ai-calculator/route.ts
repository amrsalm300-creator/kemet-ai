import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  let userBudget = 5000;
  try {
    const body = await req.json();
    const destination = body.destination;
    userBudget = Number(body.budget) || 5000;

    if (!destination || !userBudget) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    const prompt = `أنت خبير سياحي لمنصة Kemet AI التابعة لشركة Unique. قم بتحليل ميزانية قدرها ${userBudget} جنيه مصري للوجهة "${destination}".
    أجب بصيغة JSON صارمة فقط وبدون أي إضافات أو ماركداون بالشكل التالي باللغة العربية تماماً:
    {
      "flightCost": ${Math.round(userBudget * 0.35)},
      "flightDesc": "تكلفة التنقلات ووسائل المواصلات",
      "hotelCost": ${Math.round(userBudget * 0.65)},
      "hotelDesc": "الإقامة الفندقية المختارة",
      "companyName": "عروض Unique المميزة"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const textResponse = response.text || '';
    const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultData = JSON.parse(cleanedJson);

    return NextResponse.json({ success: true, data: resultData });
  } catch (error) {
    console.error('Calculator AI Error:', error);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        flightCost: Math.round(userBudget * 0.35),
        flightDesc: "تكلفة التنقلات ووسائل المواصلات",
        hotelCost: Math.round(userBudget * 0.65),
        hotelDesc: "الإقامة الفندقية المختارة",
        companyName: "عروض Unique المميزة"
      }
    });
  }
}