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

    // 2. 🛠️ الإصلاح هنا: دمجنا أمر (fl_attachment) مع تحويلات النص ليكون في مكانه الصحيح
    const transformation = `l_text:Arial_${size}_bold:${text},co_${color},g_center,y_${y}/fl_attachment:Aljouza_Greeting_${videoId}`;

    // 3. نمرر اسم القالب فقط (بدون أي مجلدات وهمية) ونحدد الصيغة mp4
    const url = cloudinary.url(template, {
      resource_type: 'video',
      format: 'mp4',
      raw_transformation: transformation,
      sign_url: true // الختم السري
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}