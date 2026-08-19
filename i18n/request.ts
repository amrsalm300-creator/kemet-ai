import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// دالة لدمج الكائنات بشكل عميق وآمن لضمان عمل الـ Fallback بكفاءة
function deepMerge(target: any, source: any) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target) || !isObject(target[key])) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // 1. تحميل اللغة الأساسية كمرجع رئيسي (Fallback)
  const defaultLocale = routing.defaultLocale || 'en';
  let defaultMessages = {};
  try {
    defaultMessages = (await import(`../messages/${defaultLocale}.json`)).default;
  } catch (error) {
    defaultMessages = {};
  }

  // 2. تحميل لغة المستخدم الحالية
  let userMessages = {};
  try {
    userMessages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    userMessages = {};
  }

  // 3. دمج اللغتين: اللغة الأساسية هي القاعدة ويتم سد أي نقص أو تحديثها بترجمات المستخدم
  const messages = deepMerge(defaultMessages, userMessages);

  return {
    locale,
    messages
  };
});