'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, CATEGORIES } from '@/lib/blogData';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const filteredPosts = selectedCategory === 'الكل'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* الهيدر والعنوان */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-red-500 bg-red-950/80 px-3 py-1 rounded-full border border-red-800/50">
            النشرة الإخبارية والمدونة
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-amber-500">
            أخبار السياحة والاستكشافات
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm">
            متابعة حية ولحظية لأحدث أخبار الفعاليات، الاكتشافات الأثرية، والوجهات السياحية.
          </p>
        </div>

        {/* شريط التصنيفات (Categories Filter) */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800 border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* شبكة عرض المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-900/60 transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{post.publishedAt}</span>
                    <span>• {post.readTime}</span>
                  </div>

                  <h2 className="text-lg font-bold text-white hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link 
                  href={`/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>اقرأ الخبر كاملًا</span>
                  <span>←</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">
            لا توجد مقالات حالياً في تصنيف "{selectedCategory}".
          </div>
        )}

      </div>
    </div>
  );
}