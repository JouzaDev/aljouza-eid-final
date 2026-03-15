'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// @ts-ignore
import * as arabicReshaper from 'arabic-reshaper';

// ==========================================
// 1. إعدادات القوالب الدقيقة الخاصة بك (لم نلمسها أبداً)
const videoSettings: Record<string, { template: string, y: number, color: string, size: number }> = {
  '1': { template: 'eid-free-greating_s8nxyx', y: 940, color: 'black', size: 70 },
  '2': { template: 'eid-free-greating0_i96sle', y: 1180, color: 'black', size: 90 },
  '3': { template: 'eid-free-greating3_xaiw4a', y: 1180, color: 'black', size: 85 },
  '4': { template: 'eid-free-greating4_kfjc4u', y: 950, color: 'black', size: 80 },
  '5': { template: 'premium-1_a5n7bh', y: 455, color: 'black', size: 70 },
  '6': { template: 'premium-2_iapzey', y: 380, color: 'black', size: 85 },
  '7': { template: 'premium-3_t8psna', y: -146, color: 'black', size: 80 },
  '8': { template: 'premium-4_zyymt8', y: -6, color: 'black', size: 75 },
  '9': { template: 'premium-6_t9ztps', y: 450, color: 'white', size: 80 },
  '10': { template: 'premium-5_x4y3vg', y: 380, color: 'black', size: 85 },
};
// ==========================================

// 2. دالة معالجة اللغة العربية الذكية والمختصرة
const processArabic = (text: string) => {
  try {
    // @ts-ignore
    const reshapeMethod = arabicReshaper.reshape || (arabicReshaper.default && arabicReshaper.default.reshape);
    return typeof reshapeMethod === 'function' ? reshapeMethod(text) : text;
  } catch (e) {
    console.error("Arabic Processing Error:", e);
    return text;
  }
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const paymentId = searchParams.get('id');
  
  const [customerName, setCustomerName] = useState('ضيفنا الكريم');
  const [isReady, setIsReady] = useState(false);
  
  // 🔒 حالات جديدة لاستقبال الرابط الآمن وحالة التحميل
  const [secureDownloadUrl, setSecureDownloadUrl] = useState('');
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(true);

  useEffect(() => {
    // سحب البيانات من الذاكرة للحفاظ على نظافة الاسم
    const localName = localStorage.getItem('customerName');
    const localVideoId = localStorage.getItem('selectedVideoId');
    
    let validName = 'ضيفنا الكريم';

    if (localName) {
      validName = localName;
    } else {
      const urlName = searchParams.get('name');
      if (urlName) {
        try { validName = decodeURIComponent(urlName); } 
        catch (e) { validName = urlName; }
      }
    }

    setCustomerName(validName);
    const currentVideoId = localVideoId || searchParams.get('videoId') || '1';
    setIsReady(true);

    // 🔒 استدعاء حارس الأمن (السيرفر) لإنتاج الرابط المختوم بدلاً من بنائه هنا
    const generateSecureUrl = async () => {
      try {
        const config = videoSettings[currentVideoId] || videoSettings['1'];
        const finalName = processArabic(validName.trim());
        const encodedName = encodeURIComponent(finalName);

        // إرسال البيانات للـ API الخاص بنا
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            template: config.template,
            text: encodedName,
            color: config.color,
            y: config.y,
            size: config.size,
            videoId: currentVideoId
          }),
        });

        const data = await response.json();
        if (data.url) {
          setSecureDownloadUrl(data.url); // حفظ الرابط المختوم في الزر
        }
      } catch (error) {
        console.error("Error fetching secure URL:", error);
      } finally {
        setIsGeneratingUrl(false); // إيقاف علامة التحميل
      }
    };

    generateSecureUrl();
  }, [searchParams]);

  if (!isReady) return null;

  if (status !== 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-bold p-6 text-center shadow-inner">
        عذراً، لم نتمكن من العثور على طلبك. يرجى المحاولة من جديد.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center border border-gray-100 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">مبارك عليك العيد يا {customerName}!</h1>
        
        <div className="text-gray-500 mb-10 leading-relaxed">
          <p className="text-lg">تهنئتك من <span className="font-bold text-blue-600">منصة الجوزاء</span> أصبحت جاهزة.</p>
          {paymentId && paymentId.startsWith('FREE_') ? (
            <span className="inline-block mt-3 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold">هدايا الجوزاء المجانية 🎁</span>
          ) : (
            <p className="text-xs text-gray-400 mt-2">رقم التوثيق: {paymentId}</p>
          )}
        </div>

        {/* 🔒 زر التحميل الذكي: يظهر حالة تحميل حتى يصل الرابط المشفر */}
        {isGeneratingUrl ? (
          <button disabled className="w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl text-xl font-bold transition-all bg-gray-200 text-gray-500 cursor-not-allowed mb-4 shadow-inner">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري تجهيز الرابط الآمن...
          </button>
        ) : (
          <a 
            href={secureDownloadUrl}
            className="w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl text-xl font-bold transition-all bg-black text-white hover:bg-gray-800 hover:shadow-2xl hover:scale-[1.03] active:scale-95 mb-4 shadow-xl shadow-black/10 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            حفظ الفيديو
          </a>
        )}

        <Link 
          href="/" 
          onClick={() => {
            localStorage.removeItem('customerName');
            localStorage.removeItem('selectedVideoId');
          }}
          className="block mt-6 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
// Trigger Vercel Update