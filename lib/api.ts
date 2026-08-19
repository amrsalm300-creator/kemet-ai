import { client } from './sanity';
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