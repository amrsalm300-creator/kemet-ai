'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface DestinationConfig {
  id: string;
  translationKey: 'cairoGiza' | 'luxorAswan' | 'redSea' | 'sinai' | 'siwa' | 'alex';
  category: 'history' | 'beach' | 'adventure';
  image: string;
  slug: string;
}

const destinationsConfig: DestinationConfig[] = [
  { id: 'cairo-giza', translationKey: 'cairoGiza', category: 'history', image: '/cairogiza.webp', slug: 'cairo-giza' },
  { id: 'luxor-aswan', translationKey: 'luxorAswan', category: 'history', image: '/luxoraswan.webp', slug: 'luxor-aswan' },
  { id: 'red-sea', translationKey: 'redSea', category: 'beach', image: '/theredseahurghada.webp', slug: 'red-sea' },
  { id: 'sinai', translationKey: 'sinai', category: 'beach', image: '/southsinai.webp', slug: 'south-sinai' },
  { id: 'siwa-west', translationKey: 'siwa', category: 'adventure', image: '/siwathewesterndesert.webp', slug: 'siwa-oasis' },
  { id: 'alex-north', translationKey: 'alex', category: 'beach', image: '/alexandria.webp', slug: 'alexandria-north-coast' }
];

const arabicFallbacks: Record<string, any> = {
  badge: 'وجهات ساحرة في محراب التاريخ والطبيعة',
  sectionTitle: 'استكشف أجمل الوجهات السياحية في مصر',
  sectionSubtitle: 'رحلة لا تُنسى عبر أروع المعالم الأثرية والشواطئ الخلابة والواحات الساحرة',
  tabs: {
    all: 'جميع الوجهات',
    history: 'تاريخية وثقافية',
    beach: 'شواطئ وبحر أحمر',
    adventure: 'سفاري ومغامرات'
  },
  exploreButton: 'استكشف تفاصيل الرحلة',
  items: {
    cairoGiza: {
      title: 'القاهرة والجيزة - مهد الحضارة',
      englishTitle: 'Cairo & Giza',
      categoryLabel: 'تاريخ وحضارة',
      description: 'اكتشف أهرامات الجيزة الخالدة، ومهد التاريخ العريق في أزقة القاهرة الفاطمية والمتحف المصري الكبير.',
      bestTime: 'أفضل وقت: أكتوبر إلى أبريل',
      highlights: ['أهرامات الجيزة وأبو الهول', 'المتحف المصري الكبير', 'خان الخليلي وشارع المعز']
    },
    luxorAswan: {
      title: 'الأقصر وأسوان - عاصمة التاريخ',
      englishTitle: 'Luxor & Aswan',
      categoryLabel: 'تاريخ وحضارة',
      description: 'متحف مفتوح يضم ثلث آثار العالم، مع رحلة نيلية ساحرة بين المعابد الفرعونية الخالدة وسحر الطبيعة النوبية.',
      bestTime: 'أفضل وقت: نوفمبر إلى فبراير',
      highlights: ['معبد الكرنك', 'وادي الملوك والملكات', 'جزيرة النباتات بأسوان']
    },
    redSea: {
      title: 'البحر الأحمر والغردقة',
      englishTitle: 'Red Sea & Hurghada',
      categoryLabel: 'شواطئ ومنتجعات',
      description: 'المياه الفيروزية الصافية والشعاب المرجانية الفريدة، مع أفضل مواقع الغوص والرياضات البحرية الفاخرة.',
      bestTime: 'أفضل وقت: طوال العام (مايو - سبتمبر للصيف)',
      highlights: ['رحلات السفاري البحرية', 'الشعاب المرجانية الملونة', 'منتجعات فاخرة']
    },
    sinai: {
      title: 'جنوب سيناء ودهب وشرم الشيخ',
      englishTitle: 'South Sinai',
      categoryLabel: 'شواطئ ومغامرات',
      description: 'سحر جبال سيناء الشامخة مع شواطئ دهب الهادئة ومنتجعات شرم الشيخ العالمية.',
      bestTime: 'أفضل وقت: سبتمبر إلى مايو',
      highlights: ['صعود جبل موسى', 'البلو هول في دهب', 'محمية راس محمد']
    },
    siwa: {
      title: 'واحة سيوة والصحراء الغربية',
      englishTitle: 'Siwa Oasis',
      categoryLabel: 'سفاري ومغامرات',
      description: 'جنة الصحراء الغربية، عيون المياه الكبريتية الطبيعية، وأشجار النخيل الممتدة وسط رمال الذهب.',
      bestTime: 'أفضل وقت: أكتوبر إلى مارس',
      highlights: ['عيون المياه الكبريتية', 'بحيرات الملح الساحرة', 'سفاري بحر الرمال الأعظم']
    },
    alex: {
      title: 'الإسكندرية والساحل الشمالي',
      englishTitle: 'Alexandria & North Coast',
      categoryLabel: 'شواطئ وعراقة',
      description: 'عروس البحر الأبيض المتوسط، تمزج بين عبق التاريخ اليوناني الروماني وجمال الشواطئ الساحرة.',
      bestTime: 'أفضل وقت: يونيو إلى سبتمبر',
      highlights: ['مكتبة الإسكندرية', 'قلعة قايتباي', 'كورنيش الإسكندرية']
    }
  }
};

export default function DestinationsSection() {
  const t = useTranslations('DestinationsSection');
  const locale = useLocale(); // جلب اللغة النشطة حالياً
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'beach' | 'adventure'>('all');

  const safeT = (path: string, fallback: any) => {
    try {
      const val = t(path as any);
      return val && val !== path && !val.includes(path) ? val : fallback;
    } catch {
      return fallback;
    }
  };

  const safeRawHighlights = (translationKey: string, defaultList: string[]) => {
    try {
      const raw = t.raw(`items.${translationKey}.highlights` as any);
      if (Array.isArray(raw) && raw.length > 0) return raw as string[];
    } catch {}
    return defaultList;
  };

  const filteredDestinations = activeTab === 'all' 
    ? destinationsConfig 
    : destinationsConfig.filter(item => item.category === activeTab);

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-transparent relative z-10 flex flex-col items-center select-none" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="w-full max-w-6xl flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-600/30 rounded-full mb-3 text-red-500 text-xs font-bold tracking-widest uppercase">
          <span>✨</span>
          <span>{safeT('badge', arabicFallbacks.badge)}</span>
        </div>
        
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-wide mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {safeT('sectionTitle', arabicFallbacks.sectionTitle)}
        </h2>
        
        <p className="text-gray-400 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
          {safeT('sectionSubtitle', arabicFallbacks.sectionSubtitle)}
        </p>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8 bg-[#0b0c0e]/90 p-2 rounded-xl border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          {[
            { key: 'all', label: safeT('tabs.all', arabicFallbacks.tabs.all) },
            { key: 'history', label: safeT('tabs.history', arabicFallbacks.tabs.history) },
            { key: 'beach', label: safeT('tabs.beach', arabicFallbacks.tabs.beach) },
            { key: 'adventure', label: safeT('tabs.adventure', arabicFallbacks.tabs.adventure) },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => {
          const defaults = arabicFallbacks.items[dest.translationKey] || {};
          
          const title = safeT(`items.${dest.translationKey}.title`, defaults.title);
          const englishTitle = safeT(`items.${dest.translationKey}.englishTitle`, defaults.englishTitle);
          const categoryLabel = safeT(`items.${dest.translationKey}.categoryLabel`, defaults.categoryLabel);
          const description = safeT(`items.${dest.translationKey}.description`, defaults.description);
          const bestTime = safeT(`items.${dest.translationKey}.bestTime`, defaults.bestTime);
          
          const highlightsRaw = safeRawHighlights(dest.translationKey, defaults.highlights || []);

          return (
            <div
              key={dest.id}
              className="group bg-[#060607]/90 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.95)] hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:border-red-600/80 flex flex-col justify-between relative"
            >
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="w-full h-52 relative overflow-hidden bg-black">
                  <img
                    src={dest.image}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060607] via-transparent to-black/40" />
                  
                  <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-red-600/40 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {categoryLabel}
                  </span>

                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 text-gray-300 text-[10px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                    📅 {bestTime}
                  </span>
                </div>

                <div className="p-6 text-right">
                  <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors mb-1">
                    {title}
                  </h3>
                  <span className="block text-xs font-mono text-gray-500 font-bold mb-3">
                    {englishTitle}
                  </span>

                  <p className="text-xs text-gray-400 leading-relaxed font-medium mb-4 line-clamp-2">
                    {description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-start mb-2">
                    {highlightsRaw.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-[#111113] border border-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded font-bold"
                      >
                        • {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                {/* 👇 تم تعديل الرابط ليصبح مباشراً بالشكل: /ar/cairo-giza بدون destinations */}
                <Link
                  href={`/${locale}/${dest.slug}`}
                  className="w-full py-3 bg-[#121215] hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 border border-white/10 hover:border-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-[0_4px_15px_rgba(220,38,38,0.4)]"
                >
                  <span>{safeT('exploreButton', arabicFallbacks.exploreButton)}</span>
                  <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}