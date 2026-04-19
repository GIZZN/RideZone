'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackgroundPaths from '@/components/BackgroundPaths/BackgroundPaths';
import FlowFieldBackground from '@/components/FlowFieldBackground/FlowFieldBackground';
import styles from './page.module.css';
import { Zap, Package, Shield, Heart, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type CatalogType = 'extreme' | 'collection';

const extremeProducts = [
  { id: 1, name: 'Скейтборд Professional X', price: 15990, category: 'Скейтбординг', image: '/images/products/placeholder1.jpg', badge: 'Популярный' },
  { id: 2, name: 'Защитный комплект полный', price: 8500, category: 'Защитная экипировка', image: '/images/products/placeholder2.jpg', badge: 'Новинка' },
  { id: 3, name: 'BMX Elite Series', price: 45000, category: 'BMX велосипеды', image: '/images/products/placeholder3.jpg', badge: null },
  { id: 4, name: 'Шлем Carbon Professional', price: 12900, category: 'Защитная экипировка', image: '/images/products/placeholder4.jpg', badge: 'Топ продаж' },
  { id: 5, name: 'Роликовые коньки Aggressive', price: 18500, category: 'Роликовые коньки', image: '/images/products/placeholder5.jpg', badge: null },
  { id: 6, name: 'Самокат Stunt Professional', price: 22000, category: 'Трюковые самокаты', image: '/images/products/placeholder6.jpg', badge: 'Популярный' },
];

const collectionProducts = [
  { id: 7, name: 'Винтажный скейтборд 1985', price: 89000, category: 'Винтажные изделия', image: '/images/products/placeholder7.jpg', badge: 'Раритет' },
  { id: 8, name: 'Лимитированная серия Supreme', price: 125000, category: 'Лимитированные серии', image: '/images/products/placeholder8.jpg', badge: 'Эксклюзив' },
  { id: 9, name: 'Автограф профессионала', price: 250000, category: 'Автографы', image: '/images/products/placeholder9.jpg', badge: 'Уникальный' },
  { id: 10, name: 'Первая серия выпуска 1990', price: 65000, category: 'Винтажные изделия', image: '/images/products/placeholder10.jpg', badge: null },
  { id: 11, name: 'Коллаборация Nike SB', price: 95000, category: 'Коллаборации', image: '/images/products/placeholder11.jpg', badge: 'Редкий' },
  { id: 12, name: 'Прототип модели 2000', price: 180000, category: 'Прототипы', image: '/images/products/placeholder12.jpg', badge: 'Раритет' },
];

export default function CatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CatalogType>('extreme');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();
  
  const products = activeTab === 'extreme' ? extremeProducts : collectionProducts;

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = new Set<number>(
          data.favorites.map((item: { product_id: string }) => parseInt(item.product_id))
        );
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (product: typeof extremeProducts[0]) => {
    if (!isAuthenticated) {
      alert('Войдите в аккаунт, чтобы добавлять товары в избранное');
      return;
    }

    const isFavorite = favorites.has(product.id);

    if (isFavorite) {
      // Remove from favorites
      try {
        const response = await fetch(`/api/favorites?productId=${product.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(product.id);
            return newSet;
          });
        }
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      // Add to favorites
      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
          }),
        });

        if (response.ok) {
          setFavorites(prev => new Set(prev).add(product.id));
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  const addToCart = async (product: typeof extremeProducts[0]) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(prev => new Set(prev).add(product.id));

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setAddedToCart(prev => new Set(prev).add(product.id));
        setTimeout(() => {
          setAddedToCart(prev => {
            const newSet = new Set(prev);
            newSet.delete(product.id);
            return newSet;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  return (
    <>
      <Header />
      <main className={styles.catalogPage}>
        {/* Hero Section */}
        <section className={styles.catalogHero}>
          <FlowFieldBackground 
            color="#a3e635"
            trailOpacity={0.12}
            particleCount={800}
            speed={0.8}
          />
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <span className={styles.heroLabelDot}></span>
              Премиум товары
            </div>
            <h1 className={styles.heroTitle}>Каталог</h1>
            <p className={styles.heroSubtitle}>
              Выберите категорию и найдите идеальный товар
            </p>
            
            {/* Tab Switcher in Hero */}
            <div className={styles.heroTabSwitcher} data-active={activeTab}>
              <button
                className={`${styles.heroTabButton} ${activeTab === 'extreme' ? styles.heroTabButtonActive : ''}`}
                onClick={() => setActiveTab('extreme')}
              >
                <Zap size={20} />
                <span>Экстрим</span>
                <span className={styles.heroTabCount}>{extremeProducts.length}</span>
              </button>
              <button
                className={`${styles.heroTabButton} ${activeTab === 'collection' ? styles.heroTabButtonActive : ''}`}
                onClick={() => setActiveTab('collection')}
              >
                <Package size={20} />
                <span>Коллекции</span>
                <span className={styles.heroTabCount}>{collectionProducts.length}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className={styles.productsSection}>
          <div className={styles.container}>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  {product.badge && (
                    <div className={styles.productBadge}>{product.badge}</div>
                  )}
                  
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                    <div className={styles.productOverlay}>
                      <button 
                        className={`${styles.productActionBtn} ${favorites.has(product.id) ? styles.productActionBtnActive : ''}`}
                        onClick={() => toggleFavorite(product)}
                      >
                        <Heart size={20} fill={favorites.has(product.id) ? '#a3e635' : 'none'} />
                      </button>
                      <button 
                        className={`${styles.productActionBtn} ${addedToCart.has(product.id) ? styles.productActionBtnSuccess : ''}`}
                        onClick={() => addToCart(product)}
                        disabled={addingToCart.has(product.id)}
                      >
                        {addingToCart.has(product.id) ? (
                          <div className={styles.spinner}></div>
                        ) : addedToCart.has(product.id) ? (
                          <Check size={20} />
                        ) : (
                          <ShoppingCart size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productCategory}>{product.category}</div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.productFooter}>
                      <div className={styles.productPrice}>{product.price.toLocaleString()} ₽</div>
                      <Link href={`/catalog/${product.id}`} className={styles.productLink}>
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.catalogCta}>
          <BackgroundPaths />
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <div className={styles.ctaIcon}>
                <Shield size={48} />
              </div>
              <h2 className={styles.ctaTitle}>Не нашли что искали?</h2>
              <p className={styles.ctaText}>
                Свяжитесь с нами, и мы поможем подобрать идеальный товар
              </p>
              <button className={styles.ctaButton}>Связаться с нами</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}