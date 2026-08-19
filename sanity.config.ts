import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schemaTypes'
import { assist } from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'Kemet AI Studio',
  
  // بنجيب الـ ID من ملف .env.local، ولو مش موجود بنحط قيمة افتراضية مؤقتة
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kqicvwbx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  // مسار لوحة التحكم
  basePath: '/studio',  
  
  plugins: [
    structureTool(),
    assist(), // تفعيل أداة الترجمة والتوليد التلقائي داخل الحقول
  ],
  
  schema: schema,
})