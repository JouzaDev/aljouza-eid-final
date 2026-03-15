"use client";
import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/next";
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';

const EID_VIDEOS = [
  // --- الفيديوهات المجانية (4 خانات رمادية بانتظار تفعيلها لاحقاً) ---
  { id: 1, title: 'تصميم العيد المجاني 1', isFree: true, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-free-greating.mp4' },
  { id: 2, title: 'تصميم العيد المجاني 2', isFree: true, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-free-greating0.mp4' },
  { id: 3, title: 'تصميم العيد المجاني 3', isFree: true, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-free-greating1.mp4' },
  { id: 4, title: 'تصميم العيد المجاني 4', isFree: true, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-free-greating2.mp4' },

  
  // --- الفيديوهات المدفوعة (6 فيديوهات معتمدة) ---
  // ملاحظة: قم بتغيير الروابط في previewUrl لتطابق فيديوهات المعاينة الخاصة بك في سابابيس
  { id: 5, title: 'تصميم ذهبي فخم', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview.mp4' },
  { id: 6, title: 'تهنئة بخط الثلث', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview0.mp4' },
  { id: 7, title: 'مخطوطة العيد الملكية', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview1.mp4' },
  { id: 8, title: 'تصميم كلاسيكي راقي', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview2.mp4' },
  { id: 9, title: 'مخطوطة ديوانية', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview3.mp4' },
  { id: 10, title: 'تصميم عصري', isFree: false, price: 5, previewUrl: 'https://pkemnucxqytzjljvpcab.supabase.co/storage/v1/object/public/eid-previews/eid-greeting-preview4.mp4' },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    // الخلفية الزجاجية (أبيض على أزرق جليدي خفيف جداً)
    <main dir="rtl" className="min-h-screen bg-linear-to-br from-[#ffefff] via-[#ffffff] to-[#eff4fb] flex flex-col relative">
      
      {/* القائمة العلوية العائمة (Floating Header) */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className="w-full max-w-md pointer-events-auto flex items-center justify-between px-5 py-3.5 bg-blue-300/40 backdrop-blur-xl border border-purple-100/40 shadow-sm rounded-full">
          {/* دمج الشعار مع اسم الخدمة بخط فاصل أنيق */}
          <div className="flex items-center gap-2.5">
            <img 
              src="https://aljouza.com/wp-content/uploads/2025/09/Logo-Colored.webp" 
              alt="منصة الجوزاء للخدمات التعليمية والرقمية" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <a 
            href="https://aljouza.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50/80 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            المتجر
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
        </header>
      </div>

      {/* المحتوى الرئيسي (حاوية الموبايل) */}
      <div className="flex-1 w-full max-w-md mx-auto pt-28 pb-10 flex flex-col">
        
        {/* العناوين */}
        <section className="px-5 pb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">تهاني العيد</h1>
          <p className="text-sm font-medium text-gray-500 leading-relaxed">
            اختر تصميمك المفضل، أضف لمستك، وشارك الفرحة فوراً.
          </p>
        </section>

        {/* شبكة الفيديوهات */}
        <section className="px-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            {EID_VIDEOS.map((video) => (
              <VideoCard 
                key={video.id} id={video.id} title={video.title} isFree={video.isFree} 
                price={video.price} previewUrl={video.previewUrl}
                onClick={() => setSelectedVideo(video)} 
              />
            ))}
          </div>
        </section>

        {/* الفوتر (Footer) */}
        <footer className="mt-16 mb-4 px-6 text-center">
          <div className="flex items-center justify-center gap-5 mb-4 opacity-60">
            {/* أيقونة X */}
            <a href="https://x.com/aljouza1_" className="hover:text-black transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.398H5.078z"/></svg></a>
            {/* أيقونة LinkedIn */}
            <a href="#" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            {/* أيقونة Snapchat */}
            <a href="#" className="hover:text-yellow-500 transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.08 2.316c-2.348 0-4.043 1.258-4.636 3.447-.197.728-.242 1.623-.153 2.502.138 1.347.502 2.658 1.054 3.864.086.192.146.438-.052.569-.364.24-.805.424-1.257.545-.98.261-2.033.228-3.024-.092-.37-.118-.696-.289-1.002-.505-.164-.117-.384-.108-.507.05-.125.158-.093.385.068.513 1.253 1.01 2.872 1.267 4.318.683.33-.133.645-.316.942-.525.132-.093.315-.05.405.083.473.689 1.026 1.334 1.644 1.914a11.967 11.967 0 001.385 1.121c.142.1.18.293.085.438-.382.584-.875 1.096-1.464 1.512a8.046 8.046 0 01-1.353.766c-.161.07-.354.02-.45-.133-.518-.842-1.272-1.487-2.181-1.858a4.593 4.593 0 00-1.748-.284c-.198.005-.365.163-.374.36-.017.375.093.743.312 1.042.484.665 1.238 1.071 2.052 1.107 1.11.05 2.196-.345 3.013-1.096.126-.115.318-.1.43.033.471.554.987 1.066 1.54 1.533.123.104.312.083.411-.046.215-.285.454-.555.714-.809.117-.116.305-.123.43-.016a10.89 10.89 0 001.537 1.108c.815.485 1.705.829 2.637 1.02a7.352 7.352 0 001.402.133c.197.001.357-.158.358-.354v-.016c-.004-.15-.1-.284-.241-.334a4.136 4.136 0 01-1.551-1.017c-.456-.474-.753-1.077-.852-1.73a.354.354 0 01.196-.363c.48-.242 1.006-.366 1.535-.36h.046c.92.008 1.821.325 2.56.903.14.108.337.067.433-.09.308-.501.523-1.045.632-1.611.137-.733-.004-1.488-.396-2.13-.095-.157-.282-.218-.445-.145a5.536 5.536 0 01-1.349.444 6.002 6.002 0 01-1.439.022c-.172-.02-.303-.171-.285-.343a9.904 9.904 0 00.088-1.325c-.015-.811-.157-1.614-.42-2.383-.053-.153.023-.321.171-.383 1.02-.43 2.102-.676 3.21-.73.4-.019.8-.002 1.196.05.187.025.358-.109.383-.295v-.013c.01-.132-.06-.255-.18-.313a3.57 3.57 0 00-1.332-.32 3.655 3.655 0 00-1.484.18c-.732.257-1.416.634-2.032 1.118-.124.097-.306.071-.401-.059-.446-.613-.933-1.192-1.455-1.731-.1-.103-.263-.12-.382-.038a8.885 8.885 0 01-1.22.71c-.139.066-.303.012-.375-.122-.441-.83-.936-1.63-1.481-2.391-.104-.146-.076-.35.061-.462 1.066-.867 2.227-1.6 3.461-2.18.156-.072.234-.247.18-.41a4.99 4.99 0 00-1.326-2.193C15.541 2.68 13.883 2.316 12.08 2.316z"/></svg></a>
            {/* أيقونة TikTok */}
            <a href="#" className="hover:text-black transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
          </div>
          <p className="text-xs font-semibold text-gray-400">صنع بحب 💜 من قبل <span className="text-gray-600">منصة الجوزاء</span></p>
          <p className="text-[10px] font-medium text-gray-400 mt-1">1447 هـ - 2026 م</p>
        </footer>

      </div>

      <VideoModal 
        isOpen={selectedVideo !== null} 
        onClose={() => setSelectedVideo(null)} 
        video={selectedVideo} 
      />
    </main>
  );
}