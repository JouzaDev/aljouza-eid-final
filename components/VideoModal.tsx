"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

type Video = { id: number; title: string; isFree: boolean; price?: number; previewUrl: string; };
type VideoModalProps = { isOpen: boolean; onClose: () => void; video: Video | null; };

export default function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMoyasarReady, setIsMoyasarReady] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // إعادة ضبط الحالات عند الإغلاق
  const handleClose = () => {
    setName(''); setPhone(''); setErrorMessage(''); setShowPaymentOptions(false); onClose();
  };

  // معالجة الأخطاء الاحترافية قبل الإرسال
  const validateInput = () => {
    if (name.trim().length < 2) return 'يرجى إدخال اسم صحيح.';
    const saudiPhoneRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
    if (!saudiPhoneRegex.test(phone)) return 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX).';
    return null;
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateInput();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('');
    
    // حفظ البيانات في الذاكرة لتستخدمها صفحة النجاح
    localStorage.setItem('eid_pending_order', JSON.stringify({ name, phone, video }));

    if (video?.isFree) {
      // نقل مباشر لصفحة النجاح للمجاني
      router.push('/success?status=paid');
    } else {
      setShowPaymentOptions(true);
    }
  };

  useEffect(() => {
    if (showPaymentOptions && isMoyasarReady && video && video.price) {
      // @ts-ignore
      if (window.Moyasar) {
        // @ts-ignore
        window.Moyasar.init({
          element: '.mysr-form',
          amount: video.price * 100,
          currency: 'SAR',
          description: `شراء فيديو: ${video.title}`,
          publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
          // توجيه ميسر مباشرة لصفحة النجاح بعد الدفع عبر 3DS
          callback_url: `${window.location.origin}/success`, 
          methods: ['creditcard', 'stcpay', 'applepay'],
          apple_pay: { country: 'SA', label: 'أفراح العيد', validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate' },
          on_completed: function (payment: any) {
            if (payment.status === 'paid') {
              router.push(`/success?id=${payment.id}&status=paid`);
            } else if (payment.status === 'initiated') {
              setErrorMessage(''); 
            } else {
              setErrorMessage('فشلت عملية الدفع، يرجى التحقق من البطاقة.');
            }
          }
        });
      }
    }
  }, [showPaymentOptions, isMoyasarReady, video, router]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-md transition-opacity">
      <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.14.0/moyasar.css" />
      <Script src="https://cdn.moyasar.com/mpf/1.14.0/moyasar.js" onLoad={() => setIsMoyasarReady(true)} />
      
      <div className="absolute inset-0" onClick={handleClose}></div>
      
      {/* تطبيق HIG: حواف دائرية كبيرة، خلفية بيضاء نقية، ظل ناعم */}
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl p-6 transform transition-transform max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <button onClick={handleClose} className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-black mb-1">{video.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{video.isFree ? 'احصل عليه مجاناً' : 'أكمل البيانات للدفع والتنزيل'}</p>
        
        <div className="w-full aspect-9/16 bg-gray-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
          <video src={video.previewUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
        </div>

        {errorMessage && <div className="mb-4 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl text-center">{errorMessage}</div>}

        <form className="space-y-4" onSubmit={handleProceed}>
          {!showPaymentOptions && (
            <>
              <input type="text" placeholder="الاسم الكريم" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-right" />
              <input type="tel" placeholder="رقم الجوال (مثال: 05XXXXXXXX)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-right text-left" dir="rtl" />
              <button type="submit" className="w-full py-4 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all">
                {video.isFree ? 'الحصول على الفيديو' : 'المتابعة للدفع (5 ر.س)'}
              </button>
            </>
          )}
        </form>

        {showPaymentOptions && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500"><div className="mysr-form"></div></div>
        )}
      </div>
    </div>
  );
}