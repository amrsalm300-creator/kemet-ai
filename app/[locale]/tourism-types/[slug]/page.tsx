import { setRequestLocale } from 'next-intl/server';
import { client } from '../../../../sanity/lib/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { urlFor } from '../../../../sanity/lib/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getTourismData(slug: string) {
  const query = `*[_type == "tourismType" && slug.current == $slug][0]`;
  return await client.fetch(query, { slug });
}

export default async function TourismTypePage(props: PageProps) {
  const params = await props.params;
  const { locale, slug } = params;

  setRequestLocale(locale);

  const data = await getTourismData(slug);
  if (!data) notFound();

  const title = data.title?.[locale] || data.title?.ar || '';
  const description = data.description?.[locale] || data.description?.ar || '';
  const bannerUrl = data.bannerImage ? urlFor(data.bannerImage).url() : '';

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pt-32 pb-20 overflow-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(50%)); }
        }
        .animate-scroll-ltr {
          animation: scroll-ltr 40s linear infinite;
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 40s linear infinite;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4">

        {/* 1. الصورة الرئيسية */}
        <section className="relative w-full rounded-3xl shadow-2xl mb-12 flex items-center justify-center group overflow-hidden bg-white">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={title}
              width={1920}
              height={1080}
              priority
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              <span className="text-white text-xl font-bold tracking-widest uppercase">
                Unique
              </span>
            </div>
          )}
        </section>

        {/* 2. العنوان والوصف الخاص بالصفحة ككل */}
        <section className="max-w-4xl mx-auto text-center mb-24">
          <span className="bg-red-600 text-white text-xs md:text-sm font-bold px-6 py-2 rounded-full shadow-lg mb-6 inline-block uppercase tracking-widest hover:-translate-y-1 transition-transform">
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-gray-600 text-base md:text-xl font-medium leading-relaxed">
            {description}
          </p>
        </section>

        {/* 3. السكاشن الديناميكية */}
        <div className="space-y-32">
          {data.contentSections?.map((section: any, index: number) => {
            
            // السكشن الترحيبي النصي (Hero Banner)
            if (section._type === 'heroBanner') {
              return (
                <div key={index} className="w-full max-w-5xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-[0_15px_30px_rgba(0,0,0,0.08)] border-t-8 border-red-600 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 text-center">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                    {section.heading?.[locale] || section.heading?.ar}
                  </h2>
                  <p className="text-lg md:text-2xl text-gray-600 font-medium leading-relaxed">
                    {section.subheading?.[locale] || section.subheading?.ar}
                  </p>
                </div>
              );
            }

            // أ. سكشن السلايدر 
            if (section._type === 'imageSlider') {
              const sliderImages = section.images ? [...section.images, ...section.images, ...section.images, ...section.images] : [];

              return (
                <div key={index} className="space-y-12 w-full overflow-hidden">
                  
                  {/* العنوان الأساسي للسكشن */}
                  {(section.sectionTitle?.ar || section.sectionTitle?.[locale]) && (
                    <div className="text-center max-w-4xl mx-auto mb-8">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase mb-4">
                        {section.sectionTitle?.[locale] || section.sectionTitle?.ar}
                      </h2>
                      <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="relative w-full overflow-hidden group py-6">
                    <div className={`flex w-max ${locale === 'ar' ? 'animate-scroll-rtl' : 'animate-scroll-ltr'} group-hover:[animation-play-state:paused]`}>
                      {sliderImages.map((img: any, iIdx: number) => (
                        <div key={iIdx} className="px-4 flex-shrink-0">
                          <div className="relative w-[280px] md:w-[400px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] cursor-pointer">
                            <Image src={urlFor(img).url()} alt="slider" fill className="object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // ب. سكشن الكروت
            if (section._type === 'cardsGrid') {
              const cardsCount = section.cards?.length || 0;
              const gridLayout = (cardsCount === 4 || cardsCount === 2) 
                ? "grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"; 

              return (
                <div key={index} className="space-y-12 w-full">
                  
                  {/* العنوان الأساسي للسكشن فوق الكروت */}
                  {(section.sectionTitle?.ar || section.sectionTitle?.[locale]) && (
                    <div className="text-center max-w-4xl mx-auto mb-8">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase mb-4">
                        {section.sectionTitle?.[locale] || section.sectionTitle?.ar}
                      </h2>
                      <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
                    </div>
                  )}

                  {/* الكروت مع تطبيق الشبكة الديناميكية */}
                  <div className={gridLayout}>
                    {section.cards?.map((card: any, cIdx: number) => {
                      
                      const CardContent = (
                        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-3 flex flex-col h-full cursor-pointer">
                          {card.cardImage && (
                            <div className="relative w-full aspect-video overflow-hidden">
                              <Image src={urlFor(card.cardImage).url()} alt="card" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="p-8 flex flex-col flex-grow text-center">
                            <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase">
                              {card.cardTitle?.[locale] || card.cardTitle?.ar}
                            </h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                              {card.cardDesc?.[locale] || card.cardDesc?.ar}
                            </p>
                          </div>
                        </div>
                      );

                      if (card.cardSlug) {
                        const href = card.cardSlug.startsWith('/') ? card.cardSlug : `/${locale}/${card.cardSlug}`;
                        return (
                          <Link key={cIdx} href={href} className="block h-full">
                            {CardContent}
                          </Link>
                        );
                      }

                      return (
                        <div key={cIdx} className="h-full">
                          {CardContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // ج. سكشن ألبوم الصور الثابت
            if (section._type === 'photoGallery') {
              return (
                <div key={index} className="space-y-12 w-full">
                  
                  {/* العنوان الأساسي للسكشن */}
                  {(section.sectionTitle?.ar || section.sectionTitle?.[locale]) && (
                    <div className="text-center max-w-4xl mx-auto mb-8">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase mb-4">
                        {section.sectionTitle?.[locale] || section.sectionTitle?.ar}
                      </h2>
                      <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
                    {section.galleryImages?.map((img: any, gIdx: number) => (
                      <div key={gIdx} className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                        <Image src={urlFor(img).url()} alt="gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // د. 💡 السكشن الجديد: Call to Action (CTA)
            if (section._type === 'ctaSection') {
              return (
                <div key={index} className="w-full max-w-5xl mx-auto bg-black rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden group text-center mt-16">
                  {/* إضاءة خلفية جمالية */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                  <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                      {section.heading?.[locale] || section.heading?.ar}
                    </h2>
                    
                    {/* عرض الوصف لو موجود */}
                    {(section.description?.[locale] || section.description?.ar) && (
                      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
                        {section.description?.[locale] || section.description?.ar}
                      </p>
                    )}

                    <div className="pt-8">
                      <Link 
                        href={section.buttonLink || '#'} 
                        className="inline-block bg-red-600 text-white font-bold text-lg md:text-xl px-12 py-4 rounded-full shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:bg-red-700 hover:shadow-[0_15px_30px_rgba(220,38,38,0.5)] hover:-translate-y-2 transition-all duration-300"
                      >
                        {section.buttonText?.[locale] || section.buttonText?.ar || 'اضغط هنا'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const locales = ['ar', 'en', 'fr', 'de', 'es', 'it', 'ru'];
  const query = `*[_type == "tourismType"]{ "slug": slug.current }`;
  const types = await client.fetch(query);

  const paths = [];
  for (const locale of locales) {
    for (const type of types) {
      if (type.slug) {
        paths.push({ locale, slug: type.slug });
      }
    }
  }
  return paths;
}