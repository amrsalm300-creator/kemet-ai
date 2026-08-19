export const tourismType = {
  name: 'tourismType',
  title: 'أنواع السياحة',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'عنوان نوع السياحة',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'الرابط التعريفي (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'صورة البانر',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'الوصف التفصيلي',
      type: 'text',
    },
    {
      name: 'sections',
      title: 'سكاشن المحتوى',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'sectionTitle', title: 'عنوان السكشن', type: 'string' },
            { name: 'sectionContent', title: 'محتوى السكشن', type: 'text' },
          ],
        },
      ],
    },
  ],
};