import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, guests, offerTitle } = body;

    // 🔴 حط التوكن الكامل هنا (استخدم زرار النسخ من موقع UltraMsg)
    const ULTRAMSG_TOKEN = "1ocn0e5bywxe600k"; 
    const INSTANCE_ID = "instance188247";

    // 1. إرسال الإيميل للإدارة
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'amrw28940@gmail.com',
      subject: `طلب حجز جديد 🚀: ${offerTitle}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 4px solid #000; border-radius: 15px; background-color: #fff; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px;">طلب حجز جديد من منصة Kemet AI</h2>
          <div style="font-size: 16px; color: #000; line-height: 1.8;">
            <p><strong style="color: #dc2626;">اسم العرض:</strong> ${offerTitle}</p>
            <p><strong style="color: #dc2626;">اسم العميل:</strong> ${name}</p>
            <p><strong style="color: #dc2626;">رقم الواتساب:</strong> ${phone}</p>
            <p><strong style="color: #dc2626;">البريد الإلكتروني:</strong> ${email}</p>
            <p><strong style="color: #dc2626;">عدد الأفراد:</strong> ${guests}</p>
          </div>
        </div>
      `,
    });

    // تجهيز إعدادات الإرسال الرسمية لـ UltraMsg
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // 2. إرسال إشعار واتساب للإدارة
    const adminParams = new URLSearchParams();
    adminParams.append("token", ULTRAMSG_TOKEN);
    adminParams.append("to", "+201020347946");
    adminParams.append("body", `إشعار للإدارة من شركة unique\n\nحجز جديد من منصة Kemet AI\nالعرض: ${offerTitle}\nاسم العميل: ${name}\nرقم العميل: ${phone}\nعدد الأفراد: ${guests}`);

    const adminRes = await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: myHeaders,
      body: adminParams
    });
    console.log('📡 رد الإدارة:', await adminRes.json());

    // 3. إرسال رسالة شكر للعميل على الواتساب
    const customerParams = new URLSearchParams();
    customerParams.append("token", ULTRAMSG_TOKEN);
    customerParams.append("to", phone);
    customerParams.append("body", `مرحباً ${name}، شكراً لاختيارك Kemet AI التابعة لشركة unique! \n\nتم استلام طلب حجزك بنجاح. \nسنتواصل معك قريباً لتأكيد التفاصيل.`);

    const customerRes = await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: myHeaders,
      body: customerParams
    });
    console.log('📡 رد العميل:', await customerRes.json());

    return NextResponse.json({ success: true, message: 'تم إرسال الطلب بنجاح' });
  } catch (error) {
    console.error('API Error details:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء الإرسال' }, { status: 500 });
  }
}