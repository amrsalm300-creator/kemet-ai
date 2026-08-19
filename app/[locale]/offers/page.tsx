import { client } from '@/lib/client';
import { getTranslations, getLocale } from 'next-intl/server';
import OffersClient from './OffersClient';
async function getActiveOffers() {
  const query = `*[_type == "offer" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    discount,
    description,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

export default async function OffersPage() {
  const t = await getTranslations('Offers');
  const locale = await getLocale(); 
  const offers = await getActiveOffers();

  // تمرير البيانات لملف العميل (Client Component)
  return <OffersClient offers={offers} locale={locale} translations={{
    title: t('title'),
    subtitle: t('subtitle')
  }} />;
}