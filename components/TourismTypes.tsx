'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface TourismTypeConfig {
  id: string;
  translationKey: 'cultural' | 'beach' | 'adventure' | 'diving' | 'medical' | 'eco' | 'safari' | 'religious' | 'nile' | 'conference';
  image: string;
}

const tourismItemsConfig: TourismTypeConfig[] = [
  { id: 'cultural', translationKey: 'cultural', image: '/culturalarchaeologicaltourism.webp' },
  { id: 'beach', translationKey: 'beach', image: '/beachtourism.webp' },
  { id: 'adventure', translationKey: 'adventure', image: '/adventuretourism.webp' },
  { id: 'diving', translationKey: 'diving', image: '/divingtourism.webp' },
  { id: 'medical', translationKey: 'medical', image: '/medicaltourism.webp' },
  { id: 'eco', translationKey: 'eco', image: '/ecotourism.webp' },
  { id: 'safari', translationKey: 'safari', image: '/safaritrips.webp' },
  { id: 'religious', translationKey: 'religious', image: '/religioustourism.webp' },
  { id: 'nile', translationKey: 'nile', image: '/niletourism.webp' },
  { id: 'conference', translationKey: 'conference', image: '/conferenceexhibitiontourism.webp' },
];

export default function TourismTypes() {
  const t = useTranslations('TourismTypes');
  const locale = useLocale();
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(tourismItemsConfig[0].id);

  const handleNavigate = (id: string) => {
    router.push(`/${locale}/tourism-types/${id}`);
  };

  return (
    <section className="bg-white py-16 px-4 text-gray-900 overflow-hidden border-t-2 border-b-2 border-red-600 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      
      {/* عنوان السكشن */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-wider">
          {t('sectionTitle')} <span className="text-red-600">{t('sectionHighlight')}</span>
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl mx-auto font-medium">
          {t('sectionSubtitle')}
        </p>
      </div>

      {/* حاوي عارض الستارة */}
      <div className="max-w-7xl mx-auto h-[550px] md:h-[600px] flex flex-col md:flex-row gap-2 md:gap-3 w-full transition-all duration-500 ease-in-out">
        {tourismItemsConfig.map((item) => {
          const isActive = activeId === item.id;
          const title = t(`items.${item.translationKey}.title` as any);
          const description = t(`items.${item.translationKey}.description` as any);

          return (
            <div
              key={item.id}
              onClick={() => setActiveId(item.id)}
              onMouseEnter={() => setActiveId(item.id)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-2 ${
                isActive
                  ? 'flex-[5] md:flex-[6] border-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.2)]'
                  : 'flex-[1] border-gray-200 opacity-80 hover:opacity-100 hover:border-red-400'
              } flex flex-col justify-end p-4 md:p-6 group`}
            >
              <Image
                src={item.image}
                alt={title}
                fill
                priority={isActive}
                className={`object-cover transition-transform duration-1000 ease-out filter contrast-105 ${
                  isActive ? 'scale-105' : 'scale-100 group-hover:scale-110'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                  isActive
                    ? 'from-black via-black/60 to-transparent opacity-90'
                    : 'from-black/90 via-black/50 to-black/30'
                }`}
              />

              <div className="relative z-10 flex flex-col justify-end h-full">

                {!isActive && (
                  <div className="hidden md:flex items-center justify-center h-full">
                    <span className="text-white font-bold text-lg whitespace-nowrap -rotate-90 tracking-wider drop-shadow-md">
                      {title}
                    </span>
                  </div>
                )}

                {!isActive && (
                  <div className="md:hidden">
                    <h3 className="text-white font-bold text-sm truncate">{title}</h3>
                  </div>
                )}

                {isActive && (
                  <div className="space-y-3 animate-fadeIn">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full w-fit shadow-md">
                      {t('badge')}
                    </span>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      {title}
                    </h3>

                    <p className="text-gray-200 text-xs md:text-sm max-w-lg leading-relaxed line-clamp-3 md:line-clamp-none">
                      {description}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(item.id);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm rounded-xl border border-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.5)] transition-all hover:gap-3 cursor-pointer"
                      >
                        <span>{t('ctaButton')}</span>
                        <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}