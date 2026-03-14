import React from 'react';

type VideoCardProps = {
  id: number;
  title: string;
  isFree: boolean;
  price?: number;
  previewUrl: string;
  onClick: () => void;
};

export default function VideoCard({ title, isFree, price, previewUrl, onClick }: VideoCardProps) {
  return (
    <div 
      onClick={onClick} 
      className="flex flex-col bg-white/70 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[1.5rem] overflow-hidden active:scale-95 transition-all duration-300 cursor-pointer group"
    >
      {/* منطقة الفيديو والشارات */}
      <div className="relative w-full aspect-9/16 bg-gray-100 overflow-hidden">
        <video 
          src={previewUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* شارة الخصم في أعلى اليسار */}
        {!isFree && (
          <span className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-100/90 backdrop-blur-sm rounded-lg">
            خصم 85%
          </span>
        )}

        {/* شارة مجاني/حصري في أعلى اليمين */}
        <span className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md rounded-lg">
          {isFree ? 'مجاني' : 'متميز'}
        </span>
      </div>
      
      {/* منطقة التفاصيل وزر الشراء */}
      <div className="p-3.5 flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">{title}</h3>
        
        {/* السعر والعملة */}
        <div className="flex items-center">
          {isFree ? (
            <span className="text-sm font-extrabold text-green-600">متاح مجاناً</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-black leading-none">{price}</span>
              <img 
                src="https://aljouza.com/wp-content/uploads/2026/02/رمز-الريال-السعودي-بدقة-عالية-svg-png.svg" 
                alt="ريال سعودي" 
                className="w-5 h-5 opacity-90"
              />
            </div>
          )}
        </div>

        {/* زر الشراء/التحميل */}
        <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors ${isFree ? 'bg-black text-white hover:bg-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {isFree ? 'طلب التصميم' : 'اطلب الآن'}
        </button>
      </div>
    </div>
  );
}