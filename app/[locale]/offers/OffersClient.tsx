'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function OffersClient({ offers, locale, translations }: any) {
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = locale === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '1',
  });

  const openDetails = (offer: any) => {
    setSelectedOffer(offer);
    setIsDetailsModalOpen(true);
  };

  const openBooking = () => {
    setIsDetailsModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const closeAll = () => {
    setIsDetailsModalOpen(false);
    setIsBookingModalOpen(false);
    setTimeout(() => setSelectedOffer(null), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          offerTitle: selectedOffer.title?.[locale] || selectedOffer.title?.ar,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitting(false);
        closeAll();
        alert(isArabic ? 'تم استلام طلبك بنجاح! سيتم التواصل معك قريباً.' : 'Booking received! We will contact you soon.');
        setFormData({ name: '', phone: '', email: '', guests: '1' });
      } else {
        throw new Error('فشل في الإرسال');
      }
    } catch (error) {
      setIsSubmitting(false);
      alert(isArabic ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-black pt-32 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_10px_10px_rgba(255,0,0,0.3)] mb-4">
            {translations.title}
          </h1>
          <p className="text-xl text-white font-medium">
            {translations.subtitle}
          </p>
        </div>

        {/* الكروت الرئيسية - الصورة تملى الكارت بالكامل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {offers.map((offer: any) => (
            <div 
              key={offer._id} 
              onClick={() => openDetails(offer)}
              className="relative bg-black rounded-2xl overflow-hidden shadow-[15px_15px_0px_0px_rgba(220,38,38,1)] border-4 border-black transform transition-transform hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_rgba(220,38,38,1)] cursor-pointer group h-[420px] flex flex-col justify-end p-6"
            >
              {/* الصورة تملى الكارت بالكامل في الخلفية */}
              {offer.imageUrl ? (
                <Image 
                  src={offer.imageUrl} 
                  alt={offer.title?.[locale] || 'صورة العرض'} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center text-red-600 font-bold bg-black">
                  {isArabic ? 'لا توجد صورة' : 'No Image'}
                </div>
              )}

              {/* طبقة تدرج لأسفل عشان العنوان والزرار يكونوا واضحين فوق الصورة */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

              {offer.discount && (
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white font-black py-2 px-5 rounded-xl border-2 border-black transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {offer.discount[locale] || offer.discount.ar || '0% OFF'}
                </div>
              )}
              
              {/* محتوى الكارت من تحت */}
              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-black text-white mb-4 line-clamp-1 drop-shadow-md">
                  {offer.title?.[locale] || offer.title?.ar}
                </h3>
                
                <button className="w-full bg-red-600 text-white font-black text-lg py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                  {isArabic ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* نافذة التفاصيل (Modal 1) */}
        {isDetailsModalOpen && selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="relative w-full max-w-5xl bg-white rounded-3xl p-8 md:p-12 border-8 border-black shadow-[25px_25px_0px_0px_rgba(220,38,38,1)] animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              
              <button 
                onClick={closeAll} 
                className="absolute -top-6 -right-6 w-14 h-14 bg-red-600 text-white rounded-full border-4 border-black text-2xl font-black flex items-center justify-center hover:bg-black transition-colors shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] z-20 cursor-pointer"
                title="إغلاق"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full md:w-1/2 h-72 md:h-[450px] bg-black rounded-2xl border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  {selectedOffer.imageUrl && (
                    <Image src={selectedOffer.imageUrl} alt="عرض" fill className="object-cover" />
                  )}
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    {selectedOffer.discount && (
                       <span className="inline-block bg-red-600 text-white font-black px-5 py-2 rounded-lg border-2 border-black w-max mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg">
                         {selectedOffer.discount[locale] || selectedOffer.discount.ar}
                       </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-black text-black mb-6 leading-tight">
                      {selectedOffer.title?.[locale] || selectedOffer.title?.ar}
                    </h2>
                    <div className="text-black font-bold text-lg mb-8 whitespace-pre-wrap max-h-60 overflow-y-auto pr-2 leading-relaxed">
                      {selectedOffer.description?.[locale] || selectedOffer.description?.ar}
                    </div>
                  </div>
                  
                  <button 
                    onClick={openBooking}
                    className="w-full bg-red-600 text-white font-black text-2xl py-5 rounded-xl border-b-8 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 active:border-b-0 active:translate-y-2 transition-all cursor-pointer"
                  >
                    {isArabic ? 'احجز هذا العرض الآن' : 'Book This Offer Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* نافذة نموذج الحجز (Modal 2) */}
        {isBookingModalOpen && selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="relative w-full max-w-2xl bg-black rounded-3xl p-8 border-8 border-red-600 shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] animate-in slide-in-from-bottom-10 duration-300">
              
              <button onClick={closeAll} className="absolute -top-6 -right-6 w-12 h-12 bg-white text-black rounded-full border-4 border-red-600 text-xl font-black flex items-center justify-center hover:bg-gray-200 transition-colors z-10 cursor-pointer">
                ✕
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">{isArabic ? 'تأكيد الحجز' : 'Confirm Booking'}</h2>
                <p className="text-red-500 font-bold">{selectedOffer.title?.[locale] || selectedOffer.title?.ar}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2">{isArabic ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white text-black border-4 border-black p-4 rounded-xl font-bold outline-none focus:border-red-600 transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-2">{isArabic ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+201..." className="w-full bg-white text-black border-4 border-black p-4 rounded-xl font-bold outline-none focus:border-red-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">{isArabic ? 'عدد الأفراد' : 'Number of Guests'}</label>
                    <input required type="number" min="1" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-white text-black border-4 border-black p-4 rounded-xl font-bold outline-none focus:border-red-600 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white text-black border-4 border-black p-4 rounded-xl font-bold outline-none focus:border-red-600 transition-colors" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white font-black text-2xl py-5 mt-4 rounded-xl border-b-8 border-white shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] hover:bg-red-700 active:border-b-0 active:translate-y-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (isArabic ? 'جاري الإرسال...' : 'Sending...') : (isArabic ? 'تأكيد وإرسال الطلب' : 'Confirm & Send Request')}
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}