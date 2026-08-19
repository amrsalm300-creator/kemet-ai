import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'offer',
  title: 'العروض الحصرية (Offers)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان العرض',
      type: 'localeString', // استخدمنا النوع المخصص بتاعك عشان يدعم اللغات
    }),
    defineField({
      name: 'discount',
      title: 'نص الخصم (مثال: 30% OFF)',
      type: 'localeString', 
    }),
    defineField({
      name: 'description',
      title: 'وصف العرض',
      type: 'localeText', // استخدمنا النوع المخصص للنصوص الطويلة
    }),
    defineField({
      name: 'image',
      title: 'صورة العرض',
      type: 'image',
      options: {
        hotspot: true, // للسماح بتحديد الجزء الأهم في الصورة
      },
    }),
    defineField({
      name: 'isActive',
      title: 'تفعيل العرض',
      description: 'لو قفلته، العرض هيختفي من الموقع',
      type: 'boolean',
      initialValue: true,
    })
  ],
})