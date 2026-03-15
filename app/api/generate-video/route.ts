import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// 1. تعريف مفاتيح الوصول لحسابك
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { template, text, color, y, size, videoId } = body;

    // 2. بناء أوامر الطباعة تماماً كما كانت في صفحتك
    const transformation = `l_text:Arial_${size}_bold:${text},co_${color},g_center,y_${y}`;

    // 3. 🔒 السحر هنا: إنشاء الرابط وتوقيعه سرياً (الختم)
    const url = cloudinary.url(`fl_attachment:Aljouza_Greeting_${videoId}/${template}.mp4`, {
      resource_type: 'video',
      type: 'upload',
      raw_transformation: transformation,
      sign_url: true // هذه التعليمة تضع ختماً مشفراً على الرابط يمنع أي شخص من العبث به
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}