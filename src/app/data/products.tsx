import React from 'react';
import type { Product, Category } from '../types';

// Централизованное хранилище товаров для всего приложения
export const productsData: Product[] = [
  {
    id: 1,
    name: 'Скейтборд Element Pro Series',
    price: 15999,
    image: '/images/products/placeholder1.jpg',
    category: 'Скейтборды',
    rating: 4.8,
    slug: 'element-pro-skateboard'
  },
  {
    id: 2,
    name: 'Лонгборд Sector 9 Cruiser',
    price: 24999,
    image: '/images/products/placeholder2.jpg',
    category: 'Лонгборды',
    rating: 4.6,
    slug: 'sector9-longboard'
  },
  {
    id: 3,
    name: 'Самокат Razor A5 Lux',
    price: 8999,
    image: '/images/products/placeholder3.jpg',
    category: 'Самокаты',
    rating: 4.9,
    slug: 'razor-a5-scooter'
  },
  {
    id: 4,
    name: 'Электросамокат Xiaomi Pro 2',
    price: 48999,
    image: '/images/products/placeholder4.jpg',
    category: 'Электросамокаты',
    rating: 4.7,
    slug: 'xiaomi-pro2-escooter'
  },
  {
    id: 5,
    name: 'Роликовые коньки Rollerblade',
    price: 12999,
    image: '/images/products/placeholder5.jpg',
    category: 'Ролики',
    rating: 4.5,
    slug: 'rollerblade-skates'
  },
  {
    id: 6,
    name: 'Защита для катания Pro-Tec',
    price: 3999,
    image: '/images/products/placeholder6.jpg',
    category: 'Защита',
    rating: 4.4,
    slug: 'protec-protection-set'
  },
  {
    id: 7,
    name: 'Скейтборд Santa Cruz Classic',
    price: 18999,
    image: '/images/products/placeholder7.jpg',
    category: 'Скейтборды',
    rating: 4.7,
    slug: 'santacruz-classic-skateboard'
  },
  {
    id: 8,
    name: 'Шлем Triple Eight Certified',
    price: 5999,
    image: '/images/products/placeholder9.jpg',
    category: 'Защита',
    rating: 4.6,
    slug: 'triple8-helmet'
  },
  {
    id: 9,
    name: 'Трюковой самокат Apex Pro',
    price: 16999,
    image: '/images/products/placeholder8.jpg',
    category: 'Самокаты',
    rating: 4.8,
    slug: 'apex-pro-stunt-scooter'
  },
  {
    id: 10,
    name: 'Электроскейт Boosted Mini',
    price: 65999,
    image: '/images/products/placeholder10.jpg',
    category: 'Электроскейты',
    rating: 4.9,
    slug: 'boosted-mini-eskateboard'
  },
  {
    id: 11,
    name: 'Пенниборд Fish Skateboards',
    price: 4999,
    image: '/images/products/placeholder11.jpg',
    category: 'Пенниборды',
    rating: 4.5,
    slug: 'fish-pennyboard'
  },
  {
    id: 12,
    name: 'Колеса для скейта Spitfire',
    price: 2999,
    image: '/images/products/placeholder12.jpg',
    category: 'Запчасти',
    rating: 4.3,
    slug: 'spitfire-wheels'
  }
];

// Категории товаров
export const categoriesData: Category[] = [
  { 
    id: 1, 
    name: 'Скейтборды', 
    slug: 'skateboards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="4" rx="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
      </svg>
    )
  },
  { 
    id: 2, 
    name: 'Лонгборды', 
    slug: 'longboards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"/>
        <circle cx="5" cy="17" r="2"/>
        <circle cx="19" cy="17" r="2"/>
      </svg>
    )
  },
  { 
    id: 3, 
    name: 'Самокаты', 
    slug: 'scooters',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="M6 19V8l8-4v15"/>
      </svg>
    )
  },
  { 
    id: 4, 
    name: 'Электросамокаты', 
    slug: 'escooters',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="M6 19V8l8-4v15"/>
        <path d="M13 6l-2 2 2 2"/>
      </svg>
    )
  },
  { 
    id: 5, 
    name: 'Ролики', 
    slug: 'rollerskates',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="10" rx="2"/>
        <circle cx="7" cy="18" r="2"/>
        <circle cx="17" cy="18" r="2"/>
      </svg>
    )
  },
  { 
    id: 6, 
    name: 'Защита', 
    slug: 'protection',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  { 
    id: 7, 
    name: 'Электроскейты', 
    slug: 'eskateboards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="4" rx="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <path d="M12 6v4"/>
      </svg>
    )
  },
  { 
    id: 8, 
    name: 'Пенниборды', 
    slug: 'pennyboards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12c0-2 2-4 6-4h4c4 0 6 2 6 4s-2 4-6 4h-4c-4 0-6-2-6-4z"/>
        <circle cx="7" cy="17" r="2"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
    )
  },
  { 
    id: 9, 
    name: 'Запчасти', 
    slug: 'parts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
      </svg>
    )
  }
];

// Список названий категорий для фильтров
export const categoryNames = ['Все', ...categoriesData.map(cat => cat.name)];

// Мапинг слагов к названиям категорий
export const categorySlugMap: { [key: string]: string } = {
  'skateboards': 'Скейтборды',
  'longboards': 'Лонгборды',
  'scooters': 'Самокаты',
  'escooters': 'Электросамокаты',
  'rollerskates': 'Ролики',
  'protection': 'Защита',
  'eskateboards': 'Электроскейты',
  'pennyboards': 'Пенниборды',
  'parts': 'Запчасти'
};

// Функции для работы с данными
export const getProductById = (id: number): Product | undefined => {
  return productsData.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'Все') {
    return productsData;
  }
  return productsData.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  return productsData.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCategoryBySlug = (slug: string): string => {
  return categorySlugMap[slug] || 'Все';
};
