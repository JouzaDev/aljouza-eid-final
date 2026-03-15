'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type VideoModalProps = {
  video: any;
  onClose: () => void;
  isOpen?: boolean;
};

export default function VideoModal({ video, onClose }: VideoModalProps) {
  // 1. جميع الـ Hooks يجب أن تكون في الأعلى دائماً (قواعد React)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // 2. الـ useEffect (نقوم بحمايته داخلياً بالتأكد من وجود video أولاً)
  useEffect(() => {
    // أضفنا فحص (video &&) لكي لا ينهار الكود إذا كان الفيديو null
    if (showPaymentOptions && video && !video.isFree) {
      const loadMoyasar = () => {
        // @ts-ignore
        if (window.Moyasar) {
          // @ts-ignore
          window.Moyasar.init({
            element: '.mysr-form',
            amount: video.price * 100,
            currency: 'SAR',
            description: `شراء فيديو: ${video.title}`,
            publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
            // نقوم بتضمين الاسم ورقم الفيديو في رابط العودة كخطة أمان إضافية
            callback_url: `${window.location.origin}/success?name=${encodeURIComponent(name.trim())}&videoId=${video.id}`,
            
            methods: ['creditcard', 'applepay'], 
            apple_pay: { 
              country: 'SA', 
              label: 'منصة الجوزاء - أفراح العيد', 
              validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate' 
            },

            on_completed: function (payment: any) {
              if (payment.status === 'paid') {
                router.push(`/success?id=${payment.id}&status=paid&name=${encodeURIComponent(name)}&videoId=${video.id}`);
              } else if (payment.status === 'initiated') {
                setErrorMessage(''); 
              } else {
                setErrorMessage('فشلت عملية الدفع، يرجى التحقق من البطاقة والمحاولة مجدداً.');
              }
            }
          });
        }
      };

      // @ts-ignore
      if (typeof window.Moyasar === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.moyasar.com/mpf/1.13.0/moyasar.js';
        script.onload = loadMoyasar;
        document.body.appendChild(script);
        
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://cdn.moyasar.com/mpf/1.13.0/moyasar.css';
        document.head.appendChild(style);
      } else {
        loadMoyasar();
      }
    }
  }, [showPaymentOptions, video, name, router]);

  // 3. سطر الحماية (Early Return) يأتي بـعـد جميع الـ Hooks!
  if (!video) return null;

  // الدالة الخاصة بالتحقق من المدخلات
  const validateInput = () => {
    if (name.trim().length < 2) return 'يرجى إدخال اسم صحيح يظهر على التهنئة.';
    const cleanPhone = phone.replace(/[-+()\s]/g, '');
    if (cleanPhone.length < 9) return 'يرجى إدخال رقم جوال صحيح.';
    return null;
  };

  // الدالة الخاصة بزر المتابعة
  const handleContinue = () => {
    const error = validateInput();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage('');
    
    // 📍 الخطوة الذهبية: حفظ الاسم ورقم الفيديو في ذاكرة المتصفح
    localStorage.setItem('customerName', name.trim());
    localStorage.setItem('selectedVideoId', video.id.toString());
    
    if (video.isFree) {
      setIsProcessing(true);
      const freePaymentId = `FREE_${Date.now()}`;
      router.push(`/success?id=${freePaymentId}&status=paid&name=${encodeURIComponent(name.trim())}&videoId=${video.id}`);
    } else {
      setShowPaymentOptions(true);
    }
  };

  // واجهة المستخدم (الـ JSX)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{video.title}</h2>
            {video.isFree ? (
              <p className="text-sm font-bold text-green-600 mt-1">تهنئة مجانية بالكامل</p>
            ) : (
              <p className="text-sm font-bold text-blue-600 mt-1">السعر: {video.price} ريال</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          {!showPaymentOptions ? (
            <div className="space-y-6">
              <div className="aspect-video w-full bg-gray-100 rounded-2xl overflow-hidden relative">
                {video.previewUrl ? (
                  <video src={video.previewUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">معاينة الفيديو</div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 font-medium">أدخل بياناتك لتخصيص التهنئة باسمك {video.isFree ? 'وتحميلها فوراً' : 'وإتمام الطلب'}.</p>
                
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl text-center">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم المراد كتابته على الفيديو</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: صالح الدوسري"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 text-right"
                  />
                </div>

                <button
                  onClick={handleContinue}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-center py-4 rounded-xl text-lg font-bold transition-all shadow-lg ${
                    video.isFree 
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20' 
                      : 'bg-black text-white hover:bg-gray-800 shadow-black/20'
                  } ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                >
                  {isProcessing ? 'جاري التجهيز...' : (video.isFree ? 'تحميل التهنئة مجاناً' : 'المتابعة للدفع')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                <p className="text-sm text-blue-800 font-bold text-center">
                  جاري إتمام طلب التهنئة باسم: <span className="text-black">{name}</span>
                </p>
              </div>
              <div className="mysr-form"></div>
              
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors mt-4"
              >
                الرجوع لتعديل البيانات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}