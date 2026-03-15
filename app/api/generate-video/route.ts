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
    const { template, text, color, y, size, videoId, delay = 0, font = 'Arial' } = body;

    // 1. تحديد الخط (مخصص أو عادي)
    const textStyle = font.includes('.ttf') ? `${font}_${size}` : `${font}_${size}_bold`;

    // 2. إعداد التوقيت (إذا كان هناك تأخير)
    const delayParam = delay > 0 ? `,so_${delay}` : '';

    // 🌟 السر هنا: تقسيم الأوامر إلى 3 طبقات صحيحة لـ Cloudinary
    
    // الطبقة الأولى: صناعة النص وتلوينه
    const textLayer = `l_text:${textStyle}:${text},co_${color}`;
    
    // الطبقة الثانية: تطبيق النص في مكانه (y) وفي زمانه (so)
    const applyLayer = `fl_layer_apply,g_center,y_${y}${delayParam}`;
    
    // الطبقة الثالثة: أمر التحميل كملف
    const attachment = `fl_attachment:Aljouza_Greeting_${videoId}`;

    // دمج الطبقات بالشرطة المائلة (/)
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