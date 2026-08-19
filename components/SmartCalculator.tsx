'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SmartCalculator() {
  const t = useTranslations();

  const [destination, setDestination] = useState('cairo');
  const [budget, setBudget] = useState(5000);
  const [loading, setLoading] = useState(false);
  
  // بيانات التحليل الواردة من الـ AI
  const [result, setResult] = useState({
    flightCost: 1500,
    flightDesc: 'رحلة تنقلات ومواصلات',
    hotelCost: 3500,
    hotelDesc: 'إقامة فندقية مقترحة',
    companyName: 'عروض Kemet AI الخاصة'
  });

  const safeT = (key: string, fallback: string, values?: Record<string, any>) => {
    try {
      const fullKey = `SmartCalculator.${key}`;
      const val = values ? t(fullKey as any, values) : t(fullKey as any);
      return val && val !== fullKey ? val : fallback;
    } catch {
      if (values) {
        let res = fallback;
        Object.keys(values).forEach((vKey) => {
          res = res.replace(new RegExp(`{${vKey}}`, 'g'), values[vKey]);
        });
        return res;
      }
      return fallback;
    }
  };

  const destinationName = safeT(`destinations.${destination}`, destination);

  // جلب البيانات الدقيقة من الـ AI عند تغير الوجهة أو الميزانية
  useEffect(() => {
    const fetchAiCalculation = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai-calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: destinationName, budget })
        });
        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        }
      } catch (err) {
        console.error('Error fetching calculation:', err);
      } finally {
        setLoading(false);
      }
    };

    // استخدام Debounce بسيط عشان مايبعتش طلبات كتير أثناء تحريك السلايدر بسرعة
    const timer = setTimeout(() => {
      fetchAiCalculation();
    }, 400);

    return () => clearTimeout(timer);
  }, [destination, budget]);

  return (
    <section className="py-16 px-4 bg-white text-gray-900 border-t border-gray-100">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* مؤشر التحميل أثناء بحث الذكاء الاصطناعي */}
        {loading && (
          <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
            جاري البحث عن أفضل العروض... 🤖
          </div>
        )}

        {/* القسم الأيمن: المدخلات */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
              {safeT('title', 'حاسبة الرحلات الذكية')}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm">
              {safeT('subtitle', 'ابحث بأفضل ميزانية واكتشف أقوى عروض شركات السياحة بدقة')}
            </p>
          </div>

          {/* اختيار الوجهة */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700">
              {safeT('destinationLabel', 'اختر الوجهة السياحية')}
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-red-600 transition-all cursor-pointer"
            >
              <option value="cairo">{safeT('destinations.cairo', 'القاهرة والجيزة')}</option>
              <option value="luxor">{safeT('destinations.luxor', 'الأقصر وأسوان')}</option>
              <option value="aswan">{safeT('destinations.aswan', 'أسوان والنوبة')}</option>
              <option value="siwa">{safeT('destinations.siwa', 'واحة سيوة')}</option>
              <option value="redsea">{safeT('destinations.redsea', 'البحر الأحمر وشرم الشيخ')}</option>
            </select>
          </div>

          {/* شريط الميزانية */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700">
                {safeT('budgetLabel', 'ميزانية الرحلة التقريبية')}
              </label>
              <span className="text-red-600 font-black text-lg">
                {budget.toLocaleString()} {safeT('currency', 'جنيه')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label={safeT('budgetLabel', 'ميزانية الرحلة التقريبية')}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* عرض الشركة المقترحة بواسطة الـ AI */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs font-bold text-red-900 flex justify-between items-center">
            <span>العرض الموصى به من:</span>
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[11px] font-black">
              {result.companyName}
            </span>
          </div>
        </div>

        {/* القسم الأيسر: النتائج المقترحة والإجمالي */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-gray-50/80 border border-gray-200 rounded-2xl p-6 justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block mb-4">
              {safeT('resultsTitle', 'التحليل المالي المقترح لرحلتك')}
            </span>

            {/* تكلفة الطيران / التنقلات */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex justify-between items-center mb-3 shadow-sm">
              <div>
                <span className="block text-[10px] text-gray-400 font-semibold">
                  {safeT('flightLabel', 'التنقلات والمواصلات')}
                </span>
                <span className="block text-xs md:text-sm font-bold text-gray-900 mt-0.5">
                  {result.flightDesc}
                </span>
              </div>
              <span className="text-red-600 font-bold text-xs whitespace-nowrap">
                {(result.flightCost || 0).toLocaleString()} {safeT('currency', 'جنيه')}
              </span>
            </div>

            {/* الإقامة والفنادق */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
              <div>
                <span className="block text-[10px] text-gray-400 font-semibold">
                  {safeT('hotelLabel', 'الإقامة الفندقية')}
                </span>
                <span className="block text-xs md:text-sm font-bold text-gray-900 mt-0.5">
                  {result.hotelDesc}
                </span>
              </div>
              <span className="text-red-600 font-bold text-xs whitespace-nowrap">
                {(result.hotelCost || 0).toLocaleString()} {safeT('currency', 'جنيه')}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">
              {safeT('totalEstimated', 'إجمالي الميزانية المحددة')}
            </span>
            <span className="text-lg font-black text-gray-900">
              {budget.toLocaleString()} {safeT('currency', 'جنيه')}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}