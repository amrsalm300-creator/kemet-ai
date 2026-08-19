import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en', 'de', 'es', 'fr', 'pt', 'ru'],
  defaultLocale: 'ar'
});