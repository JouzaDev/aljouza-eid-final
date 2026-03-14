"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [downloadLink, setDownloadLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const paymentId = searchParams.get('id');
    const status = searchParams.get('status');
    const savedOrder = localStorage.getItem('eid_pending_order');

    // التحقق من وجود الطلب في الذاكرة
    if (!savedOrder) {
      setError('لا توجد بيانات للطلب الحالي. قد تكون الجلسة انتهت.');
      setIsLoading(false);
      return;
    }

    const orderData = JSON.parse(savedOrder);

    // إذا كانت العملية مجانية أو مدفوعة بنجاح
    if (orderData.video.isFree || status === 'paid') {
      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: paymentId || 'free_transaction',
          video_id: orderData.video.id,
          name: orderData.name,
          phone: orderData.phone
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.downloadUrl) {
          setDownloadLink(data.downloadUrl);
          localStorage.removeItem('eid_pending_order'); // تنظيف الذاكرة
        } else {
          setError('حدث خطأ أثناء تجهيز الرابط. يرجى التواصل مع الدعم.');
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
      });
    } else {
      setError('لم تكتمل عملية الدفع بنجاح.');
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <main dir="rtl" className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 text-center">
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-black">عذراً!</h2>
            <p className="text-gray-500">{error}</p>
            <button onClick={() => router.push('/')} className="mt-6 w-full py-4 font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-black tracking-tight">تهانينا!</h2>
            <p className="text-gray-500 leading-relaxed">
              تم تجهيز فيديو التهنئة الخاص بك بنجاح وهو الآن جاهز للتحميل بجودة عالية.
            </p>
            
            <a href={downloadLink} download="Eid-Greeting.mp4" className="w-full py-4 font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors flex justify-center items-center shadow-sm">
              تحميل الفيديو الآن (متاح لدقيقتين)
            </a>
          </div>
        )}
      </div>

      {/* قسم الخدمات الإضافية (Apple HIG Style Card) */}
      {!isLoading && !error && (
        <div className="w-full max-w-md mt-6 bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center border border-gray-100">
          <h3 className="text-lg font-bold text-black mb-2">تبحث عن تصميم خاص؟</h3>
          <p className="text-sm text-gray-500 text-center mb-5">
            نقدم خدمات تصميم الفيديوهات والموشن جرافيك المخصصة للشركات والأفراد لتناسب هويتك بدقة.
          </p>
          <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="w-full py-3.5 font-semibold text-black bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.84 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
            تواصل معنا عبر واتساب
          </a>
        </div>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">جاري التحميل...</div>}>
      <SuccessContent />
    </Suspense>
  );
}