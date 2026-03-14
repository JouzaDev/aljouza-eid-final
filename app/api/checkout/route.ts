import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء اتصال بصلاحيات المدير للوصول للملفات السرية
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // هذا المفتاح السري الذي أضفناه في ملف البيئة
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_id, video_id, name, phone } = body;

    // 1. ربط أرقام الفيديوهات بأسماء الملفات التي رفعتها في سابابيس
    // تأكد أن أسماء الملفات هنا ('premium-1.mp4' الخ) تطابق ما رفعته بالضبط في مجلد eid-originals
    const videoFiles: Record<number, string> = {
      3: 'premium-1.mp4',
      4: 'premium-2.mp4',
      5: 'premium-3.mp4',
      6: 'premium-4.mp4',
    };

    const fileName = videoFiles[video_id];
    
    if (!fileName) {
      return NextResponse.json({ error: 'لم يتم العثور على ملف الفيديو' }, { status: 400 });
    }

    // 2. توليد رابط التحميل السري (صالح لمدة دقيقتين فقط = 120 ثانية)
    const { data: signedUrlData, error: urlError } = await supabase
      .storage
      .from('eid-originals') // تأكد أن اسم الحاوية في سابابيس هو نفسه تماماً
      .createSignedUrl(fileName, 120);

    if (urlError) {
      console.error('Supabase Storage Error:', urlError);
      throw urlError;
    }

    // 3. حفظ بيانات العميل في قاعدة البيانات كـ "مشتري"
    await supabase.from('customers').insert([
      { name, phone, video_id, video_type: 'paid', payment_id }
    ]);

    // 4. إرسال الرابط للواجهة الأمامية لكي يظهر الزر الأخضر
    return NextResponse.json({ downloadUrl: signedUrlData.signedUrl });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم' }, { status: 500 });
  }
}