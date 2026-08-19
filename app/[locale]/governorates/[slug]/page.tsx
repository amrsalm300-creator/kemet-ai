import { getLocale } from 'next-intl/server';
import { getGovernorateBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function GovernorateDetailPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const { slug } = params;
  const gov = await getGovernorateBySlug(slug);

  if (!gov) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-6 text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl font-extrabold mb-6 text-red-500">
        {gov.name?.[locale] || gov.name?.en}
      </h1>
      <p className="text-gray-300 text-lg leading-relaxed">
        {gov.description?.[locale] || gov.description?.en}
      </p>
    </main>
  );
}