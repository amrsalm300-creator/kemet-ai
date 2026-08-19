import { type SchemaTypeDefinition, defineType, defineField } from 'sanity'
import area from './area'

// 1. تعريف اللغات المدعومة
const supportedLanguages = [
  { id: 'ar', title: 'العربية', isDefault: true },
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
  { id: 'ru', title: 'Русский' },
  { id: 'fr', title: 'Français' },
  { id: 'es', title: 'Español' },
  { id: 'pt', title: 'Português' }
]

// 2. تعريف السكيما الخاصة بالنصوص القصيرة (localeString)
const localeString = defineType({
  name: 'localeString',
  title: 'نص متعدد اللغات',
  type: 'object',
  fieldsets: [
    {
      title: 'الترجمات (Translations)',
      name: 'translations',
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: supportedLanguages.map(lang => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
    fieldset: lang.isDefault ? undefined : 'translations'
  }))
})

// 3. تعريف السكيما الخاصة بالنصوص الطويلة (localeText)
const localeText = defineType({
  name: 'localeText',
  title: 'نص طويل متعدد اللغات',
  type: 'object',
  fieldsets: [
    {
      title: 'الترجمات (Translations)',
      name: 'translations',
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: supportedLanguages.map(lang => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
    fieldset: lang.isDefault ? undefined : 'translations'
  }))
})

// 4. تعريف العروض الحصرية (offer)
const offer = defineType({
  name: 'offer',
  title: 'العروض الحصرية (Offers)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان العرض',
      type: 'localeString',
    }),
    defineField({
      name: 'discount',
      title: 'نص الخصم (مثال: 30% OFF)',
      type: 'localeString', 
    }),
    defineField({
      name: 'description',
      title: 'وصف العرض',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'صورة العرض',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isActive',
      title: 'تفعيل العرض',
      type: 'boolean',
      initialValue: true,
    })
  ],
})

// 5. تعريف أنواع السياحة (tourismType) بالتصميم المتقدم
const tourismType = defineType({
  name: 'tourismType',
  title: 'أنواع السياحة المتقدمة',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'عنوان نوع السياحة', 
      type: 'localeString' 
    }),
    defineField({
      name: 'slug',
      title: 'الرابط التعريفي (Slug)',
      type: 'slug',
      options: { 
        source: 'title.ar', 
        maxLength: 96 
      },
    }),
    defineField({ 
      name: 'bannerImage', 
      title: 'صورة الغلاف الرئيسية', 
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'description', 
      title: 'الوصف التعريفي', 
      type: 'localeText' 
    }),
    
    // سكاشن ديناميكية متقدمة
    defineField({
      name: 'contentSections',
      title: 'سكاشن الصفحة (سلايدر، كروت، ألبوم، CTA)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroBanner',
          title: 'بانر ترحيبي متحرك',
          fields: [
            { name: 'heading', title: 'العنوان الرئيسى', type: 'localeString' },
            { name: 'subheading', title: 'العنوان الفرعي', type: 'localeText' },
          ]
        },
        {
          type: 'object',
          name: 'imageSlider',
          title: 'سلايدر صور متحرك',
          fields: [
            { name: 'sectionTitle', title: 'عنوان السكشن', type: 'localeString' },
            { 
              name: 'images', 
              title: 'صور السلايدر', 
              type: 'array', 
              of: [{ type: 'image', options: { hotspot: true } }] 
            }
          ]
        },
        {
          type: 'object',
          name: 'cardsGrid',
          title: 'شبكة كروت مميزة (Cards)',
          fields: [
            { name: 'sectionTitle', title: 'عنوان السكشن', type: 'localeString' },
            {
              name: 'cards',
              title: 'الكروت',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  { name: 'cardTitle', title: 'عنوان الكارد', type: 'localeString' },
                  { name: 'cardDesc', title: 'وصف الكارد', type: 'localeText' },
                  { name: 'cardImage', title: 'صورة الكارد', type: 'image', options: { hotspot: true } },
                  { 
                    name: 'cardSlug', 
                    title: 'رابط الكارت (Slug)', 
                    type: 'string',
                    description: 'اكتب الرابط هنا (مثال: /destinations/cairo أو cairo)' 
                  }
                ]
              }]
            }
          ]
        },
        {
          type: 'object',
          name: 'photoGallery',
          title: 'ألبوم صور (Gallery)',
          fields: [
            { name: 'sectionTitle', title: 'عنوان الألبوم', type: 'localeString' },
            { 
              name: 'galleryImages', 
              title: 'صور الألبوم', 
              type: 'array', 
              of: [{ type: 'image', options: { hotspot: true } }] 
            }
          ]
        },
        {
          type: 'object',
          name: 'ctaSection',
          title: 'دعوة لاتخاذ إجراء (Call To Action)',
          fields: [
            { name: 'heading', title: 'العنوان الرئيسي', type: 'localeString' },
            { name: 'description', title: 'الوصف (اختياري)', type: 'localeText' },
            { name: 'buttonText', title: 'نص الزر', type: 'localeString' },
            { 
              name: 'buttonLink', 
              title: 'رابط الزر', 
              type: 'string', 
              description: 'مثال: /contact أو https://wa.me/201000000000' 
            }
          ]
        }
      ]
    }),
  ],
})

// 6. تصدير جميع الـ Types لـ Sanity
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, localeText, area, offer, tourismType],
}