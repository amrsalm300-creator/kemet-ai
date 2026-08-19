'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  // قائمة صور الخلفية المتحركة (السلايدر)
  const bgImages = ['/a.webp', '/imagee.webp'];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // التبديل تلقائياً بين الصور كل 5 ثواني
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bgImages.length]);

  // جلب قائمة الأخبار ديناميكياً من ملفات الترجمة (تأكد من إضافتها في ملفات الترجمة ar.json و en.json)
  const newsList = [
    t('news.1'),
    t('news.2'),
    t('news.3'),
    t('news.4'),
    t('news.5'),
    t('news.6'),
    t('news.7'),
  ];

  const cards = [
    { title: t('card1_title'), englishTitle: 'Interactive Egypt Map', description: t('card1_desc'), image: '/b.webp' },
    { title: t('card2_title'), englishTitle: 'Flights & Hotels (APIs)', description: t('card2_desc'), image: '/c.webp' },
    { title: t('card3_title'), englishTitle: 'Localized Trip Offers', description: t('card3_desc'), image: '/d.webp' },
    { title: t('card4_title'), englishTitle: 'AI Travel Planner', description: t('card4_desc'), image: '/e.webp' },
  ];

  return (
    <section className="w-full min-h-screen pt-16 pb-16 px-4 md:px-8 flex flex-col items-center justify-center select-none relative overflow-hidden bg-white text-gray-900">
      
      {/* ستايل الحركة RTL */}
      <style>{`
        @keyframes rtlMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .ticker-wrapper {
          display: flex;
          width: max-content;
          animation: rtlMarquee 35s linear infinite;
        }
        .ticker-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full h-20 md:h-28 pointer-events-none select-none" />

      {/* --- الحاوية الكبرى التي تحتضن صور الخلفية المتحركة لتظهر بوضوح تام --- */}
      <div className="w-full max-w-5xl relative rounded-3xl p-6 md:p-12 mb-8 flex flex-col items-center text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-800">
        
        {/* طبقات السلايدر الخلفي (تظهر بوضوح وقوة داخل هذا البرواز) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {bgImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ 
                backgroundImage: `url(${img})`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '1500ms'
              }}
            />
          ))}
        </div>

        {/* طبقة تغشية داكنة فوق السلايدر لضمان ظهور النصوص البيضاء عليها بوضوح تامة وجذاب */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 pointer-events-none" />

        {/* محتوى الـ Hero الذي يظهر فوق الصور الخلفية */}
        <div className="relative z-20 w-full flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-black mb-3 tracking-wide text-white leading-tight drop-shadow-md">
            {t('title')}
          </h1>
          
          <p className="text-gray-200 text-xs md:text-sm font-semibold max-w-xl mb-8 tracking-wide drop-shadow">
            {t('subtitle')}
          </p>

          {/* --- بوكس البحث --- */}
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md border-2 border-red-600/60 rounded-2xl p-2.5 flex items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
            
            <div className="flex-grow relative">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder') || "إلى أين تريد الذهاب؟"} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-5 pr-12 text-right text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 transition-all font-medium text-sm shadow-sm"
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <button className="flex items-center gap-2.5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl px-7 py-4 transition-all duration-300 shadow-[0_4px_15px_rgba(220,38,38,0.4)] active:scale-95">
              <span className="font-bold text-base tracking-wide antialiased">{t('searchButton') || "بحث"}</span>
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

          </div>
        </div>

      </div>

      {/* --- شريط الأخبار المباشرة المتحرك --- */}
      <div className="w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 mb-12 flex items-center overflow-hidden shadow-lg relative text-white" dir="ltr">
        
        <div className="flex items-center gap-2 pr-4 border-r border-gray-800 z-10 bg-gray-900 shrink-0" dir="rtl">
          <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>

        <div className="overflow-hidden w-full relative flex items-center" dir="rtl">
          <div className="ticker-wrapper">
            {[...newsList, ...newsList, ...newsList].map((news, idx) => (
              <div key={idx} className="flex items-center shrink-0 whitespace-nowrap mx-5 text-xs md:text-sm font-medium text-gray-200">
                <span className="whitespace-nowrap">{news}</span>
                <span className={`mr-5 inline-block w-2 h-2 rounded-full shrink-0 ${idx % 2 === 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-white/40'}`} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* عنوان شبكة الكروت */}
      <div className="w-full max-w-6xl flex justify-start items-center mb-6 px-2 relative z-0">
        <h2 className="text-sm md:text-base font-black tracking-wide text-gray-800 border-r-4 border-red-600 pr-3">
          {t('sectionTitle')}
        </h2>
      </div>

      {/* شبكة الكروت */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            href="#"
            className="group block bg-white border border-gray-200 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(220,38,38,0.12)] hover:border-red-600/50 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex flex-col">
              <div className="mb-3 text-right">
                <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors mb-0.5">
                  {card.title}
                </h3>
                <span className="block text-[10px] font-mono text-gray-400 font-bold group-hover:text-gray-500 transition-colors">
                  {card.englishTitle}
                </span>
              </div>

              <div className="w-full h-40 bg-[#0c0c0e] border border-gray-800 rounded-xl mb-3 flex items-center justify-center p-2 relative overflow-hidden group-hover:border-red-600/40 transition-colors shadow-inner">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 select-none pointer-events-none" 
                />
              </div>
              
              <p className="text-[11px] text-gray-600 leading-relaxed font-semibold text-right">
                {card.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-red-600 font-black">
              <span>{t('explore')}</span>
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}