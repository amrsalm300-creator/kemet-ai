'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import InteractiveMap from '@/components/InteractiveMap';

export default function DestinationsPage() {
  const t = useTranslations('DestinationsPage'); // تأكد من إضافة هذا النطاق في ملفات الـ JSON

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* الهيدر */}
      <div className="text-center space-y-3">
        <div className="inline-block bg-neutral-900 border border-amber-500/30 px-4 py-1 rounded-full text-xs text-amber-400 font-semibold mb-2">
          {t('badge')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* الخريطة */}
      <InteractiveMap />

    </div>
  );
}