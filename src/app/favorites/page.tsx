'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FlowFieldBackground from '@/components/FlowFieldBackground/FlowFieldBackground';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

interface FavoriteItem {
  id: number;
  user_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
  created_at: string;
}

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки избранного');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления из избранного');
      }

      setFavorites(favorites.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const handleAddToCart = async (item: FavoriteItem) => {
    const cartItem = {
      id: parseInt(item.product_id),
      name: item.product_name,
      price: item.product_price,
      image: item.product_image
    };
    await addToCart(cartItem);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className={styles.favoritesPage}>
          <section className={styles.emptySection}>
            <FlowFieldBackground 
              color="#a3e635"
              trailOpacity={0.1}
              particleCount={400}
              speed={0.6}
            />
            <div className={styles.emptyContent}>
              <Heart size={80} className={styles.emptyIcon} />
              <h1 className={styles.emptyTitle}>Войдите в аккаунт</h1>
              <p className={styles.emptyText}>
                Чтобы добавлять товары в избранное, необходимо авторизоваться
              </p>
              <Link href="/auth/login" className={styles.emptyButton}>
                Войти
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.favoritesPage}>
          <section className={styles.favoritesContent}>
            <div className={styles.container}>
              <div className={styles.favoritesHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.headerIconWrapper}>
                    <div className={styles.headerIconBg}></div>
                    <Heart size={28} className={styles.headerIcon} />
                  </div>
                  <div className={styles.headerInfo}>
                    <h1 className={styles.headerTitle}>Избранное</h1>
                    <p className={styles.headerSubtitle}>Загрузка...</p>
                  </div>
                </div>
              </div>

              <div className={styles.favoritesGrid}>
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                      <div className={styles.skeletonCategory}></div>
                      <div className={styles.skeletonTitle}></div>
                      <div className={styles.skeletonFooter}>
                        <div className={styles.skeletonPrice}></div>
                        <div className={styles.skeletonLink}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className={styles.favoritesPage}>
          <div className={styles.container}>
            <div className={styles.error}>{error}</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (favorites.length === 0) {
    return (
      <>
        <Header />
        <main className={styles.favoritesPage}>
          <section className={styles.emptySection}>
            <FlowFieldBackground 
              color="#a3e635"
              trailOpacity={0.1}
              particleCount={400}
              speed={0.6}
            />
            <div className={styles.emptyContent}>
              <Heart size={80} className={styles.emptyIcon} />
              <h1 className={styles.emptyTitle}>Избранное пусто</h1>
              <p className={styles.emptyText}>
                Добавьте товары в избранное, чтобы не потерять их
              </p>
              <Link href="/catalog" className={styles.emptyButton}>
                Перейти в каталог
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.favoritesPage}>
        <section className={styles.favoritesContent}>
          <div className={styles.container}>
            <div className={styles.favoritesHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.headerIconWrapper}>
                  <div className={styles.headerIconBg}></div>
                  <Heart size={28} className={styles.headerIcon} />
                </div>
                <div className={styles.headerInfo}>
                  <h1 className={styles.headerTitle}>Избранное</h1>
                  <p className={styles.headerSubtitle}>
                    {favorites.length} {favorites.length === 1 ? 'товар' : favorites.length < 5 ? 'товара' : 'товаров'}
                  </p>
                </div>
              </div>
              <Link href="/catalog" className={styles.headerButton}>
                Продолжить покупки
              </Link>
            </div>

            <div className={styles.favoritesGrid}>
              {favorites.map((item) => (
                <div key={item.id} className={styles.favoriteCard}>
                  {item.product_category && (
                    <div className={styles.productBadge}>{item.product_category}</div>
                  )}
                  
                  <Link href={`/catalog/${item.product_id}`} className={styles.cardImage}>
                    <img src={item.product_image} alt={item.product_name} />
                    <div className={styles.cardOverlay}>
                      <button 
                        className={styles.overlayBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(item);
                        }}
                      >
                        <ShoppingCart size={20} />
                      </button>
                      <button 
                        className={styles.overlayBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFromFavorites(item.product_id);
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </Link>

                  <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>
                      <Package size={14} />
                      {item.product_category}
                    </div>
                    
                    <Link href={`/catalog/${item.product_id}`}>
                      <h3 className={styles.cardTitle}>{item.product_name}</h3>
                    </Link>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardPrice}>
                        {item.product_price.toLocaleString()} ₽
                      </div>
                      <Link href={`/catalog/${item.product_id}`} className={styles.cardLink}>
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
