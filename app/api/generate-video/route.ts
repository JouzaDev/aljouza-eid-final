import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // لم نعد نحتاج لاستقبال نوع الخط، سنستخدم Arial المضمون
    const { template, text, color, y, size, videoId, delay = 0 } = body;

    // 1. تثبيت خط Arial العريض المدمج في Cloudinary
    const textStyle = `Arial_${size}_bold`;

    // 2. إعداد وقت التأخير (إذا كان موجوداً)
    const delayParam = delay > 0 ? `,so_${delay}` : '';

    // 3. ترتيب الطبقات بشكل مثالي لكي لا يظهر خطأ 400
    // الطبقة الأولى: كتابة النص
    const textLayer = `l_text:${textStyle}:${text},co_${color}`;
    
    // الطبقة الثانية: وضع النص في مكانه وتحديد وقت ظهوره
    const applyLayer = `fl_layer_apply,g_center,y_${y}${delayParam}`;
    
    // الطبقة الثالثة: التحميل
    const attachment = `fl_attachment:Aljouza_Greeting_${videoId}`;

    // دمج الطبقات
    const transformation = `${textLayer}/${applyLayer}/${attachment}`;

    const url = cloudinary.url(template, {
      resource_type: 'video',
      format: 'mp4',
      raw_transformation: transformation,
      sign_url: true
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}