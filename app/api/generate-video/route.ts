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
    // نستقبل المتغيرات الجديدة: وقت التأخير (delay) واسم الخط (font)
    const { template, text, color, y, size, videoId, delay = 0, font = 'Arial' } = body;

    // 1. إعداد وقت ظهور الاسم (مثلاً بعد 2.5 ثانية)
    const delayParam = delay > 0 ? `,so_${delay}` : '';

    // 2. إعداد الخط (إذا كان الخط ينتهي بـ .ttf لا نضيف له كلمة bold لأن وزنه مدمج فيه)
    const textStyle = font.includes('.ttf') ? `${font}_${size}` : `${font}_${size}_bold`;

    // 3. دمج كل شيء في الرابط النهائي
    const transformation = `l_text:${textStyle}:${text},co_${color},g_center,y_${y}${delayParam}/fl_attachment:Aljouza_Greeting_${videoId}`;

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