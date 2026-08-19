'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface VideoItem {
  id: string;
  url: string;
  slug: string;
  titleKey: string; // مفتاح الترجمة لكل فيديو
}

const videoKeys = [
  { id: '3Z1e8I75_QM', url: 'https://www.youtube.com/watch?v=D-r4Gt1cCPA', titleKey: 'video1', slug: '#' },
  { id: 'SeNCF11hLEY', url: 'https://www.youtube.com/watch?v=0VD3WE02PCE', titleKey: 'video2', slug: '#' },
  { id: 'GXTpPMAuNxg', url: 'https://www.youtube.com/watch?v=GXTpPMAuNxg', titleKey: 'video3', slug: '#' },
  { id: 'FcNCWMmTRcg', url: 'https://www.youtube.com/watch?v=FcNCWMmTRcg', titleKey: 'video4', slug: '#' },
  { id: 'BapSQFJPMM0', url: 'https://www.youtube.com/watch?v=BapSQFJPMM0', titleKey: 'video5', slug: '#' },
  { id: 'sjcibYQ7U78', url: 'https://www.youtube.com/watch?v=sjcibYQ7U78', titleKey: 'video6', slug: '#' },
  { id: 'hB9XVJ4lzjI', url: 'https://www.youtube.com/watch?v=hB9XVJ4lzjI', titleKey: 'video7', slug: '#' },
  { id: 'CMR-ReioQtQ', url: 'https://www.youtube.com/watch?v=CMR-ReioQtQ', titleKey: 'video8', slug: '#' },
  { id: 'E4UI-vmPMWg', url: 'https://www.youtube.com/watch?v=E4UI-vmPMWg', titleKey: 'video9', slug: '#' },
  { id: 'Z2xkAvCzjJA', url: 'https://www.youtube.com/watch?v=Z2xkAvCzjJA', titleKey: 'video10', slug: '#' },
];

export default function TourismFilmstrip() {
  const t = useTranslations('TourismFilmstrip');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // تكرار القائمة لخلق تأثير الشريط المستمر
  const doubleVideos = [...videoKeys, ...videoKeys];

  return (
    <section className="relative bg-white py-12 px-2 overflow-hidden border-t-4 border-b-4 border-red-600 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      
      {/* CSS أنيميشن الشريط */}
      <style jsx>{`
        @keyframes filmScrollLTR {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .film-track {
          display: flex !important;
          width: max-content !important;
          animation: filmScrollLTR 35s linear infinite !important;
        }
        .film-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* عنوان السكشن */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-wider">
          {t('mainTitle')} <span className="text-red-600">{t('mainTitleHighlight')}</span>
        </h2>
        <p className="text-gray-600 mt-2 text-base md:text-lg font-medium">
          {t('subtitle')}
        </p>
      </div>

      {/* شريط سينمائي رئيسي واحد */}
      <div className="relative w-full bg-neutral-900 border-y-4 border-red-600 py-6 overflow-hidden shadow-inner">
        
        {/* ثقوب الفيلم العلوية */}
        <div className="w-full flex justify-between px-2 mb-4 pointer-events-none opacity-80 overflow-hidden" dir="ltr">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={`top-${i}`} className="w-4 h-3 bg-white/10 rounded-sm border border-red-900/80 flex-shrink-0 mx-1" />
          ))}
        </div>

        {/* مسار الحركة الرئيسي LTR */}
        <div className="w-full overflow-hidden" dir="ltr">
          <div className="film-track">
            {doubleVideos.map((vid, idx) => {
              const videoTitle = t(`videos.${vid.titleKey}`);
              return (
                <div
                  key={`${vid.id}-${idx}`}
                  className="w-72 md:w-80 mx-3 flex-shrink-0 bg-black p-3 border-2 border-red-600 rounded-lg shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-transform duration-300 hover:scale-105"
                  dir="rtl"
                >
                  {/* إطار الصورة - للضغط وفتح الكارت الكبير للمشاهدة */}
                  <div
                    className="relative aspect-video bg-black rounded border border-white/20 overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedVideo(vid)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`}
                      alt={videoTitle}
                      className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,1)] border-2 border-white transform group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* التفاصيل وزر الانتقال للصفحة */}
                  <div className="mt-3 flex flex-col items-center gap-2 text-center">
                    <h3
                      className="text-white font-bold text-sm md:text-base truncate w-full tracking-wide cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => setSelectedVideo(vid)}
                    >
                      {videoTitle}
                    </h3>

                    <a
                      href={vid.slug}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded border border-white/30 transition-colors shadow-[0_4px_10px_rgba(220,38,38,0.5)]"
                    >
                      <span>{t('detailsButton')}</span>
                      <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ثقوب الفيلم السفلية */}
        <div className="w-full flex justify-between px-2 mt-4 pointer-events-none opacity-80 overflow-hidden" dir="ltr">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={`bot-${i}`} className="w-4 h-3 bg-white/10 rounded-sm border border-red-900/80 flex-shrink-0 mx-1" />
          ))}
        </div>

      </div>

      {/* ============================================================ */}
      {/* المودال الاحترافي (الكارت الكبير المخصص لمشاهدة الفيديو) */}
      {/* ============================================================ */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          
          {/* كارت التشغيل بتصميم 3D فخم */}
          <div className="relative w-full max-w-4xl bg-neutral-950 border-2 border-red-600 rounded-xl p-4 md:p-6 shadow-[0_0_50px_rgba(220,38,38,0.7)] animate-in fade-in zoom-in duration-200">
            
            {/* زر الإغلاق (X) */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-black transition-colors z-10 font-bold"
              aria-label={t('closeButton')}
            >
              ✕
            </button>

            {/* عنوان الفيديو في الكارت */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center tracking-wide">
              {t(`videos.${selectedVideo.titleKey}`)}
            </h3>

            {/* إطار تشغيل اليوتيوب الكبير */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-red-600/50 shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={t(`videos.${selectedVideo.titleKey}`)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* أزرار التحكم والعمليات داخل الكارت */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <span className="text-xs text-gray-400">
                {t('platformName')}
              </span>

              <div className="flex gap-3">
                <a
                  href={selectedVideo.slug}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded border border-white/20 transition-all shadow-[0_4px_15px_rgba(220,38,38,0.5)]"
                >
                  {t('goToLandmarkButton')}
                </a>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-semibold text-sm rounded border border-white/10 transition-all"
                >
                  {t('closeButton')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}