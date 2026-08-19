import { getLocale } from 'next-intl/server';
import { getGovernorates } from '@/lib/api';
import Link from 'next/link';

export default async function GovernoratesPage() {
  const locale = await getLocale();
  const governorates = await getGovernorates();

  return (
    <main className="max-w-7xl mx-auto py-16 px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          {locale === 'ar' ? 'المحافظات السياحية في مصر' : 'Tourist Governorates in Egypt'}
        </h1>
        <p className="text-gray-400 text-lg">
          {locale === 'ar' 
            ? 'استكشف أجمل الوجهات والمحافظات عبر منصتنا' 
            : 'Explore the most beautiful destinations and governorates'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {governorates?.map((gov: any) => (
          <Link 
            key={gov._id} 
            href={`/${locale}/governorates/${gov.slug}`}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-red-600 transition-all duration-300 block group"
          >
            <h2 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors mb-3">
              {gov.name?.[locale] || gov.name?.en || 'Governorate'}
            </h2>
            <p className="text-gray-400 text-sm line-clamp-3">
              {gov.description?.[locale] || gov.description?.en || ''}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}