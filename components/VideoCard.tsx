'use client';

import React from 'react';

type VideoCardProps = {
  id: number;
  title: string;
  isFree: boolean;
  price?: number;
  previewUrl?: string;
  isPlaceholder?: boolean;
  onClick: () => void;
};

export default function VideoCard({ title, isFree, price, previewUrl, isPlaceholder, onClick }: VideoCardProps) {
  
  // 1. تصميم خانة "قريباً" الزجاجي
  if (isPlaceholder) {
    return (
      <div className="flex flex-col bg-gray-50/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] overflow-hidden opacity-80 cursor-default">
        <div className="relative w-full aspect-9/16 bg-gradient-to-br from-gray-100/50 to-gray-200/50 flex flex-col items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold opacity-70">يُضاف قريباً</span>
        </div>
        <div className="p-3.5 flex flex-col gap-2.5">
          <h3 className="text-sm font-bold text-gray-400 line-clamp-1 leading-tight">{title}</h3>
          <div className="flex items-center">
            <span className="text-sm font-extrabold text-gray-400">مجاني</span>
          </div>
          <button disabled className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-gray-200/50 text-gray-400 cursor-not-allowed">
            في الانتظار...
          </button>
        </div>
      </div>
    );
  }

  // 2. التصميم الأساسي الزجاجي (Apple Style Glassmorphism)
  return (
    <div 
      onClick={onClick} 
      // السر هنا: شفافية 60%، ضبابية عالية، حد أبيض ناعم، وظل خفيف جداً
      className="flex flex-col bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] overflow-hidden active:scale-[0.98] transition-all duration-300 cursor-pointer group"
    >
      {/* منطقة الفيديو */}
      <div className="relative w-full aspect-9/16 bg-gray-50/50 overflow-hidden">
        {previewUrl && (
          <video 
            src={previewUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            onContextMenu={(e) => e.preventDefault()} 
            controlsList="nodownload noplaybackrate" 
            disablePictureInPicture 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out select-none pointer-events-none"
          />
        )}
        
        {/* شارة الخصم */}
        {!isFree && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[12px] font-bold text-gray-100 bg-purple-800 border border-purple-200/50 backdrop-blur-md rounded-lg shadow-sm">
            خصم 90%
          </span>
        )}
    
      </div>
      
      {/* منطقة التفاصيل */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 leading-tight">{title}</h3>
        
        {/* منطقة السعر */}
        <div className="flex items-center">
          {isFree ? (
            <span className="text-lg font-black text-green-600 leading-none">مجاني</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-gray-900 leading-none">{price}</span>
              <img 
                src="https://aljouza.com/wp-content/uploads/2026/02/رمز-الريال-السعودي-بدقة-عالية-svg-png.svg" 
                alt="ريال سعودي" 
                className="w-4 h-4 opacity-80"
              />
            </div>
          )}
        </div>
        
        {/* زر الطلب */}
        <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 text-white shadow-sm ${isFree ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/20' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {isFree ? ' احصل عليها الآن ' : 'اطلب الآن'}
        </button>
      </div>
    </div>
  );
}