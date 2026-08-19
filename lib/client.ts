import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // هتجيبه من ملف .env
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // استخدم تاريخ اليوم أو تاريخ إنشاء المشروع
  useCdn: false, // خليها false عشان البيانات تتحدث فوراً
})