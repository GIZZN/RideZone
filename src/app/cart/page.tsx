'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FlowFieldBackground from '@/components/FlowFieldBackground/FlowFieldBackground';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Package, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки корзины');
      }

      const data = await response.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        setCartItems(cartItems.map(item => 
          item.product_id === productId ? { ...item, quantity } : item
        ));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.product_id !== productId));
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const handleCheckout = async () => {
    setIsOrdering(true);
    setOrderError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Ошибка создания заказа');
      }

      const data = await response.json();
      
      if (data.success) {
        setCartItems([]);
        router.push('/profile?tab=orders');
      } else {
        setOrderError(data.error || 'Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderError('Ошибка при создании заказа');
    } finally {
      setIsOrdering(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className={styles.cartPage}>
          <section className={styles.emptySection}>
            <FlowFieldBackground 
              color="#a3e635"
              trailOpacity={0.1}
              particleCount={400}
              speed={0.6}
            />
            <div className={styles.emptyContent}>
              <ShoppingCart size={80} className={styles.emptyIcon} />
              <h1 className={styles.emptyTitle}>Войдите в аккаунт</h1>
              <p className={styles.emptyText}>
                Чтобы добавлять товары в корзину, необходимо авторизоваться
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
        <main className={styles.cartPage}>
          <div className={styles.container}>
            <div className={styles.loadingState}>
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonInfo}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLine}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className={styles.cartPage}>
          <section className={styles.emptySection}>
            <FlowFieldBackground 
              color="#a3e635"
              trailOpacity={0.1}
              particleCount={400}
              speed={0.6}
            />
            <div className={styles.emptyContent}>
              <ShoppingCart size={80} className={styles.emptyIcon} />
              <h1 className={styles.emptyTitle}>Корзина пуста</h1>
              <p className={styles.emptyText}>
                Добавьте товары в корзину, чтобы оформить заказ
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
      <main className={styles.cartPage}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <div className={styles.titleSection}>
              <h1 className={styles.pageTitle}>Корзина</h1>
              <span className={styles.itemCount}>{cartItems.length} товаров</span>
            </div>
            <button onClick={clearCart} className={styles.clearAll}>
              <Trash2 size={18} />
              Очистить корзину
            </button>
          </div>

          {orderError && (
            <div className={styles.errorBanner}>
              {orderError}
              <button onClick={() => setOrderError('')}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className={styles.cartLayout}>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.productCard}>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => removeFromCart(item.product_id)}
                    title="Удалить"
                  >
                    <Trash2 size={18} />
                  </button>

                  <Link href={`/catalog/${item.product_id}`} className={styles.productImage}>
                    <img src={item.product_image} alt={item.product_name} />
                  </Link>

                  <div className={styles.productInfo}>
                    <Link href={`/catalog/${item.product_id}`}>
                      <h3 className={styles.productName}>{item.product_name}</h3>
                    </Link>
                    <div className={styles.productPrice}>{item.product_price.toLocaleString()} ₽ за шт.</div>
                  </div>

                  <div className={styles.productActions}>
                    <div className={styles.quantity}>
                      <button 
                        onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                        className={styles.quantityBtn}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className={styles.quantityBtn}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      {(item.product_price * item.quantity).toLocaleString()} ₽
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Итого</h2>
                
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryLine}>
                    <span>Товары ({cartItems.length})</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>Доставка</span>
                    <span className={styles.free}>Бесплатно</span>
                  </div>
                </div>

                <div className={styles.summaryTotal}>
                  <span>К оплате</span>
                  <span className={styles.totalAmount}>{totalPrice.toLocaleString()} ₽</span>
                </div>

                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={isOrdering}
                >
                  {isOrdering ? 'Оформление...' : 'Оформить заказ'}
                </button>

                <div className={styles.benefits}>
                  <div className={styles.benefit}>
                    <Package size={16} />
                    <span>Доставка 1-3 дня</span>
                  </div>
                  <div className={styles.benefit}>
                    <ShoppingCart size={16} />
                    <span>Безопасная оплата</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
