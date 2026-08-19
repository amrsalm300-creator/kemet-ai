import { client } from './sanity';

// دالة لجلب جميع المحافظات (تدعم الحقول المتعددة للغات الـ 7)
export async function getGovernorates() {
  const query = `*[_type == "governorate"] {
    _id,
    "slug": slug.current,
    name,
    description,
    image
  }`;
  
  const governorates = await client.fetch(query);
  return governorates;
}

// دالة لجلب محافظة واحدة تفصيلية بناءً على الـ Slug ورابط اللغة
export async function getGovernorateBySlug(slug: string) {
  const query = `*[_type == "governorate" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    name,
    description,
    image
  }`;
  
  const governorate = await client.fetch(query, { slug });
  return governorate;
}