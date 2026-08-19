import { defineType } from 'sanity'

const supportedLanguages = [
  { id: 'ar', title: 'العربية', isDefault: true },
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
  { id: 'ru', title: 'Русский' },
  { id: 'fr', title: 'Français' },
  { id: 'es', title: 'Español' },
  { id: 'pt', title: 'Português' }
]

export default defineType({
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