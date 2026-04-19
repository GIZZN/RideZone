'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { Heart, ShoppingCart, Star, Shield, Package, Zap, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const allProducts = [
  { id: 1, name: 'Скейтборд Pro X', price: '15 990', category: 'Скейтбординг', image: '/images/products/placeholder1.jpg', badge: 'Хит', type: 'extreme', description: 'Профессиональный скейтборд для опытных райдеров', features: ['Дека из канадского клена', '7-слойная конструкция', 'Подшипники ABEC-9', 'Вес: 2.8 кг'] },
  { id: 2, name: 'Защита полная', price: '8 500', category: 'Защита', image: '/images/products/placeholder2.jpg', badge: 'New', type: 'extreme', description: 'Комплект защиты для максимальной безопасности', features: ['Наколенники и налокотники', 'Защита запястий', 'Дышащий материал', 'Регулируемые ремни'] },
  { id: 3, name: 'BMX Elite', price: '45 000', category: 'BMX', image: '/images/products/placeholder3.jpg', badge: null, type: 'extreme', description: 'Профессиональный BMX для трюков и стрита', features: ['Рама из хромомолибдена', 'Колеса 20 дюймов', 'Двойные стенки ободов', 'Вес: 11.5 кг'] },
  { id: 4, name: 'Шлем Carbon Pro', price: '12 900', category: 'Защита', image: '/images/products/placeholder4.jpg', badge: 'Топ', type: 'extreme', description: 'Карбоновый шлем с максимальной защитой', features: ['Карбоновая оболочка', 'Вентиляция 12 отверстий', 'Съемная подкладка', 'Сертификат безопасности'] },
  { id: 5, name: 'Ролики Aggressive', price: '18 500', category: 'Ролики', image: '/images/products/placeholder5.jpg', badge: null, type: 'extreme', description: 'Агрессивные ролики для парка и стрита', features: ['Жесткий ботинок', 'Сменные колеса 58мм', 'Усиленная рама', 'Подшипники ABEC-7'] },
  { id: 6, name: 'Самокат Stunt', price: '22 000', category: 'Самокаты', image: '/images/products/placeholder6.jpg', badge: 'Хит', type: 'extreme', description: 'Трюковой самокат для профессионалов', features: ['Алюминиевая дека', 'Руль 60см', 'Колеса 110мм', 'Вес: 3.2 кг'] },
  { id: 7, name: 'Винтажный скейт 1985', price: '89 000', category: 'Винтаж', image: '/images/products/placeholder7.jpg', badge: 'Раритет', type: 'collection', description: 'Редкий скейтборд 1985 года в отличном состоянии', features: ['Оригинальная дека', 'Коллекционное состояние', 'Сертификат подлинности', 'Уникальный дизайн'] },
  { id: 8, name: 'Лимитка Supreme', price: '125 000', category: 'Лимитед', image: '/images/products/placeholder8.jpg', badge: 'Эксклюзив', type: 'collection', description: 'Лимитированная серия Supreme, всего 500 экземпляров', features: ['Номерная серия', 'Оригинальная упаковка', 'Голограмма подлинности', 'Инвестиционная ценность'] },
  { id: 9, name: 'Автограф легенды', price: '250 000', category: 'Автографы', image: '/images/products/placeholder9.jpg', badge: 'Уникат', type: 'collection', description: 'Скейтборд с автографом легендарного райдера', features: ['Сертифицированный автограф', 'Фото с подписанием', 'Музейное качество', 'Единственный экземпляр'] },
  { id: 10, name: 'Первая серия 1990', price: '65 000', category: 'Винтаж', image: '/images/products/placeholder10.jpg', badge: null, type: 'collection', description: 'Первая серия культового бренда 1990 года', features: ['Оригинальная краска', 'Все компоненты родные', 'Редкая находка', 'Отличное состояние'] },
  { id: 11, name: 'Коллаборация Nike', price: '95 000', category: 'Коллаборации', image: '/images/products/placeholder11.jpg', badge: 'Редкость', type: 'collection', description: 'Эксклюзивная коллаборация с Nike SB', features: ['Лимитированный тираж', 'Уникальный дизайн', 'Оригинальная коробка', 'Сертификат'] },
  { id: 12, name: 'Пэксклюзивные перчатки', price: '180 000', category: 'Лимитед', image: '/images/products/placeholder12.jpg', badge: 'Эксклюзив', type: 'collection', description: 'Прототип модели, не вышедшей в производство', features: ['Единственный экземпляр', 'Историческая ценность', 'Документация', 'Музейный экспонат'] },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const product = allProducts.find(p => p.id === productId);
  const { isAuthenticated } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    if (isAuthenticated && product) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, product]);

  const checkFavoriteStatus = async () => {
    // This would need a new API endpoint to check if product is in favorites
    // For now, we'll skip this check
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    if (isFavorite) {
      // Remove from favorites
      try {
        const response = await fetch(`/api/favorites?productId=${product.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsFavorite(false);
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
            price: parseInt(product.price.replace(/\s/g, '')),
            image: product.image,
            category: product.category,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: parseInt(product.price.replace(/\s/g, '')),
          image: product.image,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        setIsAddedToCart(true);
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <main className={styles.productPage}>
          <div className={styles.container}>
            <div className={styles.notFound}>
              <h1>Товар не найден</h1>
              <Link href="/catalog" className={styles.backLink}>
                <ArrowLeft size={20} />
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = [product.image, product.image, product.image];

  return (
    <>
      <Header />
      <main className={styles.productPage}>
        <section className={styles.productContent}>
          <div className={styles.container}>
            <Link href="/catalog" className={styles.backLink}>
              <ArrowLeft size={20} />
              Назад
            </Link>
            
            <div className={styles.productGrid}>
              <div className={styles.productImages}>
                <div className={styles.mainImage}>
                  {product.badge && (
                    <div className={styles.productBadge}>{product.badge}</div>
                  )}
                  <img src={images[selectedImage]} alt={product.name} />
                </div>
                <div className={styles.thumbnails}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`${styles.thumbnail} ${selectedImage === idx ? styles.thumbnailActive : ''}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.productDetails}>
                <div className={styles.productCategory}>
                  {product.type === 'extreme' ? <Zap size={16} /> : <Package size={16} />}
                  {product.category}
                </div>
                
                <h1 className={styles.productTitle}>{product.name}</h1>
                
                <div className={styles.productRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#a3e635" color="#a3e635" />
                  ))}
                  <span className={styles.ratingText}>(48 отзывов)</span>
                </div>

                <p className={styles.productDescription}>{product.description}</p>

                <div className={styles.productFeatures}>
                  <h3 className={styles.featuresTitle}>Особенности:</h3>
                  <ul className={styles.featuresList}>
                    {product.features.map((feature, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <Shield size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.productPrice}>
                  <span className={styles.priceAmount}>{product.price} ₽</span>
                  <span className={styles.priceLabel}>В наличии</span>
                </div>

                <div className={styles.productActions}>
                  <div className={styles.quantitySelector}>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{quantity}</span>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button 
                    className={`${styles.addToCartBtn} ${isAddedToCart ? styles.addToCartBtnSuccess : ''}`}
                    onClick={addToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className={styles.spinner}></div>
                        Добавление...
                      </>
                    ) : isAddedToCart ? (
                      <>
                        <Check size={20} />
                        Добавлено
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Добавить в корзину
                      </>
                    )}
                  </button>

                  <button 
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteBtnActive : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart size={20} fill={isFavorite ? '#a3e635' : 'none'} />
                  </button>
                </div>

                <div className={styles.productInfo}>
                  <div className={styles.infoItem}>
                    <Shield size={20} />
                    <div>
                      <div className={styles.infoTitle}>Гарантия качества</div>
                      <div className={styles.infoText}>12 месяцев</div>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Package size={20} />
                    <div>
                      <div className={styles.infoTitle}>Доставка</div>
                      <div className={styles.infoText}>1-3 дня</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
