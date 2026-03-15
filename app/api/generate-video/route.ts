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
    const { template, text, color, y, size, videoId, delay = 0 } = body;

    // 1. خط Arial
    const textStyle = `Arial_${size}_bold`;

    // 2. التوقيت
    const delayParam = delay > 0 ? `,so_${delay}` : '';

    // 3. 🌟 الحل هنا: دمج كل شيء في سطر واحد مباشر بدون تعقيد الطبقات ليظهر النص فوراً
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