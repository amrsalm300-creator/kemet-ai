import React from 'react';
import Hero from '@/components/Hero';
import DestinationsSection from '@/components/DestinationsSection';
import TourismFilmstrip from '@/components/TourismFilmstrip';
import TourismTypes from '@/components/TourismTypes';
import SmartCalculator from '@/components/SmartCalculator';
import InteractiveMap from '@/components/InteractiveMap';

export default function Home() {
  return (
    <main className="w-full min-h-screen relative bg-white m-0 p-0 overflow-x-hidden">
      
      {/* 🚀 السكاشن تعمل بخلفية بيضاء بالكامل بدون أي صور خلفية ثابتة */}
      <div className="relative z-10 w-full bg-white">
        <Hero />
        <SmartCalculator />
        <DestinationsSection />
        <TourismFilmstrip />
        <TourismTypes />

        {/* 🗺️ سكشن الخريطة التفاعلية (بدون عنوان ثابت لكي تتولى الخريطة الترجمة ديناميكياً) */}
        <section className="w-full bg-white">
          <InteractiveMap />
        </section>
      </div>

    </main>
  );
}