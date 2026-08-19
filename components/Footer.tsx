'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <footer 
      className="bg-black text-gray-300 font-sans relative z-20 border-t border-red-900/40" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* العمود 1: عن المنصة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-500 tracking-wide">
              {t('aboutTitle')}
            </h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              {t('aboutText')}
            </p>
            
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <span>{t('poweredBy')}</span>
              <span className="font-extrabold text-white bg-neutral-900 px-2.5 py-1 rounded border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {t('companyName')}
              </span>
            </div>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div className={`space-y-3 ${isRtl ? 'md:border-r md:pr-8' : 'md:border-l md:pl-8'} border-red-900/30`}>
            <h3 className="text-lg font-bold text-amber-500 mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">{t('termsOfUse')}</Link></li>
              <li><Link href="/privacy" className="hover:text-red-500 transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href="/faq" className="hover:text-red-500 transition-colors">{t('faq')}</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">{t('contactUs')}</Link></li>
              <li><Link href="/about" className="hover:text-red-500 transition-colors">{t('aboutPlatform')}</Link></li>
            </ul>
          </div>

          {/* العمود 3: الوجهات الشهيرة */}
          <div className={`space-y-3 ${isRtl ? 'md:border-r md:pr-8' : 'md:border-l md:pl-8'} border-red-900/30`}>
            <h3 className="text-lg font-bold text-amber-500 mb-4">
              {t('destinationsTitle')}
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/luxor" className="hover:text-red-500 transition-colors">{t('destinations.luxorTrip')}</Link></li>
              <li><Link href="/siwa" className="hover:text-red-500 transition-colors">{t('destinations.siwaAdventures')}</Link></li>
              <li><Link href="/dahab" className="hover:text-red-500 transition-colors">{t('destinations.dahabBeaches')}</Link></li>
              <li><Link href="/marsa-alam" className="hover:text-red-500 transition-colors">{t('destinations.marsaAlam')}</Link></li>
              <li><Link href="/nile-cruises" className="hover:text-red-500 transition-colors">{t('destinations.nileCruises')}</Link></li>
            </ul>
          </div>

          {/* العمود 4: تواصل معنا */}
          <div className={`space-y-3 ${isRtl ? 'md:border-r md:pr-8' : 'md:border-l md:pl-8'} border-red-900/30`}>
            <h3 className="text-lg font-bold text-amber-500 mb-4">
              {t('contactUs')}
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <span>{t('location')}</span>
              </li>
              <li className="text-gray-400 text-xs">
                <span>{t('email')}</span>
              </li>
              <li className="text-gray-400 text-xs">
                <span>{t('phone')}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="bg-neutral-950 border-t border-neutral-800/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 font-sans">
            {t('rights')}
          </div>
        </div>
      </div>

    </footer>
  );
}