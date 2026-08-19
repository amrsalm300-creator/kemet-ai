import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'area',
  title: 'المناطق (Areas)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المنطقة (مثال: المعادي)',
      type: 'localeString',
    }),
    defineField({
      name: 'slug',
      title: 'الرابط (Slug) - (يُكتب بالإنجليزية فقط للـ SEO)',
      type: 'slug',
      options: {
        source: 'name.en', 
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'العنوان الجانبي (مثال: تصميم مواقع في المعادي)',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'وصف سريع للمنطقة',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'صورة خلفية المنطقة',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'facts',
      title: 'حقائق سريعة',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'العنوان', type: 'localeString' },
            { name: 'value', title: 'القيمة', type: 'localeString' },
          ],
        },
      ],
    }),
    defineField({
      name: 'videoPlaceholder',
      title: 'صورة غلاف الفيديو',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'رابط فيديو اليوتيوب (متعدد اللغات لكل دولة)',
      type: 'localeString',
    }),
    defineField({
      name: 'lat',
      title: 'خط العرض (Latitude)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'lng',
      title: 'خط الطول (Longitude)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'nearbyAreas',
      title: 'المناطق المجاورة (للربط الداخلي SEO)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'area' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name.ar',
      subtitle: 'slug.current',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'بدون اسم',
        subtitle: subtitle ? `Slug: ${subtitle}` : 'No Slug',
        media: media,
      }
    },
  },
})