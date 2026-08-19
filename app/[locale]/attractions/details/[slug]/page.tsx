import { client } from '@/lib/sanity'; 
import { notFound } from 'next/navigation';
import AreaMap from '@/components/AreaMap';
import Link from 'next/link';

const dictionary = {
  ar: { untitled: 'بدون عنوان', quickFacts: 'معلومات سريعة', videoTour: 'جولة مرئية للمكان', locationMap: 'الموقع على الخريطة', nearbyAreas: 'المناطق المجاورة' },
  en: { untitled: 'Untitled', quickFacts: 'Quick Facts', videoTour: 'Video Tour', locationMap: 'Location on Map', nearbyAreas: 'Nearby Areas' },
  de: { untitled: 'Ohne Titel', quickFacts: 'Schnelle Fakten', videoTour: 'Videotour', locationMap: 'Standort auf der Karte', nearbyAreas: 'In der Nähe' },
};

function getYouTubeEmbedUrl(url: any, locale: string) {
  if (!url) return '';
  const urlStr = typeof url === 'string' ? url : (url[locale] || url['en'] || url['ar'] || Object.values(url)[0] || '');
  if (typeof urlStr !== 'string') return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlStr.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : urlStr;
}

interface Fact { label: string; value: string; }
interface NearbyArea { name: string; slug: string; image?: any; }
interface AttractionData { name: string; title: string; description: string; facts: Fact[]; lat: number; lng: number; youtubeUrl: any; nearbyAreas: NearbyArea[]; }

async function getAttraction(slug: string, locale: string): Promise<AttractionData | null> {
  const query = `*[_type == "area" && slug.current == $slug][0]{
    "name": coalesce(name[$locale], name['en'], name['ar'], name),
    "title": coalesce(title[$locale], title['en'], title['ar'], title),
    "description": coalesce(description[$locale], description['en'], description['ar'], description),
    "facts": facts[]{ "label": coalesce(label[$locale], label['en'], label['ar'], label), "value": coalesce(value[$locale], value['en'], value['ar'], value) },
    lat, lng, "youtubeUrl": coalesce(youtubeUrl[$locale], youtubeUrl['en'], youtubeUrl['ar'], youtubeUrl),
    "nearbyAreas": nearbyAreas[]->{ "name": coalesce(name[$locale], name['en'], name['ar'], name), "slug": slug.current, image }
  }`;
  return client.fetch(query, { slug, locale });
}

interface PageProps { params: Promise<{ locale: string; slug: string; }>; }

export default async function AttractionDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const isRtl = locale === 'ar';
  const t = dictionary[locale as keyof typeof dictionary] || dictionary['en'];
  const attraction = await getAttraction(slug, locale);

  if (!attraction) return notFound();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 md:p-10 pt-28 md:pt-36 font-sans overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center border-b-4 border-red-600 pb-6 md:pb-8 px-2">
            <h1 className="text-4xl md:text-6xl font-black text-black uppercase drop-shadow-[4px_4px_0_#ff0000] tracking-wider text-center break-words py-2 leading-tight">
              {attraction.name || t.untitled}
            </h1>
            {attraction.title && <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 md:mt-6 text-center max-w-3xl leading-relaxed">{attraction.title}</h2>}
          </div>
          {attraction.description && <p className="text-lg md:text-xl text-center max-w-3xl mx-auto text-gray-800 font-medium pt-2 md:pt-4 px-2">{attraction.description}</p>}
        </div>

        {attraction.facts && attraction.facts.length > 0 && (
          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 text-center">{t.quickFacts}</h2>
            <div className="flex flex-col gap-4 md:gap-6">
              {attraction.facts.map((fact, index) => (
                <div key={index} className="bg-white text-black p-4 md:p-6 border-4 border-black shadow-[4px_4px_0_0_#ff0000] flex flex-col sm:flex-row sm:items-center justify-between gap-1 md:gap-4">
                  <h3 className="text-lg md:text-xl font-bold text-red-600 shrink-0 text-start">{fact.label}</h3>
                  <p className="text-base md:text-lg font-extrabold text-start sm:text-end break-words">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {attraction.youtubeUrl && (
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 text-center mt-8 md:mt-12">{t.videoTour}</h2>
            <div className="bg-white p-1 md:p-2 border-2 md:border-4 border-black shadow-[6px_6px_0_0_#ff0000] mx-auto max-w-5xl">
              <div className="relative w-full aspect-video border border-black md:border-2">
                <iframe src={getYouTubeEmbedUrl(attraction.youtubeUrl, locale)} className="absolute top-0 left-0 w-full h-full" style={{ border: 0 }} allowFullScreen={true}></iframe>
              </div>
            </div>
          </div>
        )}

        {attraction.lat && attraction.lng && (
          <div className="space-y-6 md:space-y-8 pt-6 md:pt-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 text-center">{t.locationMap}</h2>
            <div className="max-w-4xl mx-auto pb-10">
              <AreaMap lat={attraction.lat} lng={attraction.lng} currentLang={locale} />
            </div>
          </div>
        )}

        {attraction.nearbyAreas && attraction.nearbyAreas.length > 0 && (
          <div className="space-y-6 pt-10 border-t-4 border-black">
            <h2 className="text-2xl md:text-3xl font-bold text-black text-center">{t.nearbyAreas}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {attraction.nearbyAreas.map((area, idx) => (
                <Link key={idx} href={`/${locale}/attractions/details/${area.slug}`} className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#ff0000] transition-all block text-center font-bold">
                  <span>{area.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}