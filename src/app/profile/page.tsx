'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FlowFieldBackground from '@/components/FlowFieldBackground/FlowFieldBackground';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Package, Check, ShoppingBag, Camera, X } from 'lucide-react';
import Link from 'next/link';

type TabType = 'profile' | 'orders';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });
  const { user, isAuthenticated, updateProfile, loading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Проверяем URL параметры для переключения вкладок
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'orders'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
      // Загружаем аватарку если есть
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [isAuthenticated, user, router, loading]);

  // Загрузка заказов при переключении на вкладку заказов
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      loadOrders();
    }
  }, [activeTab, isAuthenticated]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/user/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');
    setUpdateError('');
    
    try {
      const result = await updateProfile(formData.name, formData.phone);
      
      if (result.success) {
        setUpdateMessage('Профиль успешно обновлен');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateError(result.error || 'Ошибка обновления профиля');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateError('Ошибка соединения с сервером');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (макс 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUpdateError('Размер файла не должен превышать 2MB');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setUpdateError('Можно загружать только изображения');
      return;
    }

    setIsUploadingAvatar(true);
    setUpdateError('');

    try {
      // Конвертируем в base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);

        // Отправляем на сервер
        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatar: base64String }),
        });

        if (response.ok) {
          setUpdateMessage('Аватарка обновлена');
          setTimeout(() => setUpdateMessage(''), 3000);
        } else {
          const data = await response.json();
          setUpdateError(data.error || 'Ошибка загрузки аватарки');
          setAvatarPreview(null);
        }
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      setUpdateError('Ошибка загрузки аватарки');
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    setUpdateError('');

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      if (response.ok) {
        setAvatarPreview(null);
        setUpdateMessage('Аватарка удалена');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        const data = await response.json();
        setUpdateError(data.error || 'Ошибка удаления аватарки');
      }
    } catch (error) {
      console.error('Avatar delete error:', error);
      setUpdateError('Ошибка удаления аватарки');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getStatusClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Обрабатывается': 'processing',
      'В пути': 'shipped',
      'Доставлен': 'delivered'
    };
    return statusMap[status] || 'processing';
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <h2>Загрузка профиля</h2>
              <p>Пожалуйста, подождите...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <FlowFieldBackground 
            color="#a3e635"
            trailOpacity={0.12}
            particleCount={800}
            speed={0.8}
          />
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <div className={styles.heroTag}>
                  <span className={styles.tagDot}></span>
                  Личный кабинет
                </div>
                <h1 className={styles.heroTitle}>
                  {user.name || 'Профиль'}
                </h1>
                <p className={styles.heroDescription}>
                  {user.email}
                </p>
                <div className={styles.heroStats}>
                  <div className={styles.statItem}>
                    <Package size={20} />
                    <span>{orders.length} заказов</span>
                  </div>
                  <div className={styles.statItem}>
                    <User size={20} />
                    <span>Активен</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroRight}>
                <div className={styles.avatarCard}>
                  <div className={styles.avatarContainer}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <User size={48} />
                      </div>
                    )}
                    {isUploadingAvatar && (
                      <div className={styles.avatarLoading}>
                        <div className={styles.loadingSpinner}></div>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.avatarActions}>
                    <label className={styles.avatarUploadBtn}>
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        className={styles.avatarRemoveBtn}
                        onClick={handleRemoveAvatar}
                        disabled={isUploadingAvatar}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.container}>
          <div className={styles.wrapper}>

          {/* Tabs Navigation */}
          <nav className={styles.tabsNav}>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>Личные данные</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} />
              <span>Мои заказы</span>
            </button>
          </nav>

          {/* Content */}
          <div className={styles.contentSection}>
            {activeTab === 'profile' && (
              <div className={styles.profileContent}>
                {updateMessage && (
                  <div className={styles.successAlert}>
                    <Check size={20} />
                    {updateMessage}
                  </div>
                )}

                {updateError && (
                  <div className={styles.errorAlert}>
                    {updateError}
                  </div>
                )}

                <div className={styles.contentGrid}>
                  {/* Profile Info Card */}
                  <div className={styles.infoCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Личная информация</h3>
                      <p className={styles.cardDescription}>Обновите свои данные</p>
                    </div>

                    <form className={styles.profileForm} onSubmit={handleSubmit}>
                      <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>
                            <User size={18} />
                            Имя
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={styles.inputField}
                            placeholder="Введите ваше имя"
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>
                            <Mail size={18} />
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className={styles.inputField}
                            disabled
                          />
                          <span className={styles.inputNote}>
                            Email нельзя изменить
                          </span>
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>
                            <Phone size={18} />
                            Телефон
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={styles.inputField}
                            placeholder="+7 (___) ___-__-__"
                          />
                        </div>
                      </div>

                      <div className={styles.formActions}>
                        <button
                          type="submit"
                          className={styles.saveButton}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Stats Cards */}
                  <div className={styles.statsCards}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Package size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <div className={styles.statValue}>{orders.length}</div>
                        <div className={styles.statLabel}>Всего заказов</div>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <ShoppingBag size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <div className={styles.statValue}>
                          {orders.filter(o => o.status === 'Доставлен').length}
                        </div>
                        <div className={styles.statLabel}>Доставлено</div>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Mail size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <div className={styles.statValue}>
                          {user.email.split('@')[0].substring(0, 8)}...
                        </div>
                        <div className={styles.statLabel}>Логин</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <>
                {ordersLoading ? (
                  <div className={styles.ordersLoading}>
                    <div className={styles.loadingSpinner}></div>
                    Загрузка заказов...
                  </div>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyOrders}>
                    <div className={styles.emptyIcon}>
                      <ShoppingBag size={48} />
                    </div>
                    <h3>У вас пока нет заказов</h3>
                    <p>
                      Начните делать покупки в нашем каталоге
                    </p>
                    <Link href="/catalog" className={styles.catalogLink}>
                      <Package size={20} />
                      Перейти в каталог
                    </Link>
                  </div>
                ) : (
                  <div className={styles.ordersList}>
                    {orders.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div className={styles.orderMeta}>
                            <h3>Заказ #{order.id}</h3>
                            <div className={styles.orderDate}>{order.date}</div>
                          </div>
                          <div className={`${styles.statusBadge} ${styles[getStatusClass(order.status)]}`}>
                            {order.status}
                          </div>
                        </div>

                        <div className={styles.orderItems}>
                          {order.items.map((item, idx) => (
                            <div key={idx} className={styles.orderItem}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemQuantity}>x{item.quantity}</span>
                              <span className={styles.itemPrice}>
                                {(item.price * item.quantity).toLocaleString()} ₽
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className={styles.orderFooter}>
                          <div className={styles.orderTotal}>
                            <span className={styles.totalLabel}>Итого:</span>
                            <span className={styles.totalAmount}>
                              {order.total.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
