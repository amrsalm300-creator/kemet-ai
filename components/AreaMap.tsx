'use client';

interface AreaMapProps {
  lat: number;
  lng: number;
  currentLang: string;
}

export default function AreaMap({ lat, lng, currentLang }: AreaMapProps) {
  // إجبار الإحداثيات إنها تكون أرقام صريحة لمنع كسر الرابط
  const safeLat = Number(lat);
  const safeLng = Number(lng);

  if (!safeLat || !safeLng) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-gray-100 text-gray-500 font-bold border-2 border-black shadow-[6px_6px_0px_#dc2626]">
        جاري تحميل الخريطة... (تأكد من الأرقام في سانتي)
      </div>
    );
  }

  // الرابط المباشر لجوجل مابس
  const mapEmbedUrl = `https://www.google.com/maps?q=${safeLat},${safeLng}&hl=${currentLang || 'en'}&z=14&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* الخريطة */}
      <div className="w-full h-[450px] border-2 border-black shadow-[6px_6px_0px_#dc2626] overflow-hidden bg-gray-50">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* زرار الاتجاهات لجوجل مابس */}
      <a 
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm text-center border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all w-fit mx-auto flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        Get Directions (Google Maps)
      </a>
      
    </div>
  );
}