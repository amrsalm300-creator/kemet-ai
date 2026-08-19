'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isArabic = locale === 'ar';

  const navItems = [
    { name: t('home'), href: `/${locale}` },
    { name: t('exclusiveOffers'), href: `/${locale}/offers` },
    { name: isArabic ? 'المحافظات' : 'Governorates', href: `/${locale}/governorates` },
    { name: t('explore'), href: '#' },
    { name: t('map'), href: '#' },
    { name: t('hotels'), href: '#' },
    { name: t('trips'), href: '#' },
    { name: t('community'), href: '#' },
    { name: t('blog'), href: `/${locale}/blog` },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 bg-black text-white border-b-4 border-[#1f1f1f] shadow-[0_15px_35px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)] px-8 py-3 transition-all duration-300" 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link href={`/${locale}`} className="flex items-center shrink-0 cursor-pointer">
          <Image 
            src="/logo.webp" 
            alt="Kemet AI Logo" 
            width={140} 
            height={45} 
            className="object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] transition-transform duration-200 hover:scale-105"
            priority 
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className="text-white hover:text-red-500 font-bold text-sm tracking-wide transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="bg-[#111] text-white border border-white/20 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-red-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] transition-colors cursor-pointer"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="ru">Русский</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>

          <div className="md:hidden">
            <button className="text-white text-2xl">☰</button>
          </div>
        </div>

      </div>
    </header>
  );
}