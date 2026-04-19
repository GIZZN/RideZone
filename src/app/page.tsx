'use client';

import React, { useEffect } from 'react';
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FlowFieldBackground from "@/components/FlowFieldBackground/FlowFieldBackground";
import BackgroundPaths from "@/components/BackgroundPaths/BackgroundPaths";
import Link from 'next/link';
import { 
  ArrowRight, 
  Zap, 
  Star, 
  Clock, 
  Shield, 
  Target, 
  Package, 
  Sparkles, 
  Award,
  Check,
  Mail
} from 'lucide-react';

export default function Home() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(`.${styles.animateOnScroll}`);
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      
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
                Эксклюзивные товары для экстрима и колекционирования
              </div>
              <h1 className={styles.heroTitle}>
                Экстрим.<br />
                <span className={styles.titleAccent}>Коллекции.</span><br />
                Адреналин.
              </h1>
              <p className={styles.heroDescription}>
                Уникальные товары для экстремальных видов спорта и редкие коллекционные предметы. 
                Стиль в каждой детали, качество в каждом движении.
              </p>
              <div className={styles.heroActions}>
                <Link href="/catalog" className={styles.btnPrimary}>
                  Каталог продукции
                </Link>
                <Link href="/contact" className={styles.btnSecondary}>
                  <span>Наш сапорт</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            
            <div className={styles.heroRight}>
              {/* Большая карточка с ротацией */}
              <div className={styles.mainCard}>
                <div className={styles.cardBadge}>NEW</div>
                <div className={styles.cardImage}>
                  <div className={styles.imageGlow}></div>
                  <Award size={120} strokeWidth={1.5} />
                </div>
                <div className={styles.cardLabel}>Коллекционное</div>
              </div>

              {/* Маленькие карточки */}
              <div className={styles.smallCards}>
                <div className={styles.smallCard}>
                  <div className={styles.smallCardIcon}>
                    <Zap size={24} />
                  </div>
                  <div className={styles.smallCardText}>
                    <span className={styles.smallCardValue}>500+</span>
                    <span className={styles.smallCardLabel}>Товаров</span>
                  </div>
                </div>

                <div className={styles.smallCard}>
                  <div className={styles.smallCardIcon}>
                    <Star size={24} />
                  </div>
                  <div className={styles.smallCardText}>
                    <span className={styles.smallCardValue}>VIP</span>
                    <span className={styles.smallCardLabel}>товар</span>
                  </div>
                </div>
              </div>

              {/* Статистика внизу */}
              <div className={styles.statsBar}>
                <div className={styles.statBarItem}>
                  <span className={styles.statBarValue}>24/7</span>
                  <span className={styles.statBarLabel}>Поддержка</span>
                </div>
                <div className={styles.statBarDivider}></div>
                <div className={styles.statBarItem}>
                  <span className={styles.statBarValue}>100%</span>
                  <span className={styles.statBarLabel}>Гарантия</span>
                </div>
              </div>

              {/* Декоративные элементы */}
              <div className={styles.floatingOrb}></div>
              <div className={styles.floatingOrb2}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine}></div>
          <span>Прокрутите вниз</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={`${styles.featuresGrid} ${styles.animateOnScroll}`}>
            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>01</div>
              <div className={styles.featureIcon}>
                <Sparkles size={32} />
              </div>
              <h3 className={styles.featureTitle}>Эксклюзив</h3>
              <p className={styles.featureText}>
                Редкие и уникальные товары, которые вы не найдете больше нигде
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>02</div>
              <div className={styles.featureIcon}>
                <Clock size={32} />
              </div>
              <h3 className={styles.featureTitle}>Качество</h3>
              <p className={styles.featureText}>
                Проверенные бренды и оригинальная продукция с гарантией подлинности
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>03</div>
              <div className={styles.featureIcon}>
                <Target size={32} />
              </div>
              <h3 className={styles.featureTitle}>Коллекции</h3>
              <p className={styles.featureText}>
                Лимитированные серии и раритетные экземпляры для истинных ценителей
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>04</div>
              <div className={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.featureTitle}>Безопасность</h3>
              <p className={styles.featureText}>
                Сертифицированная продукция и полная поддержка на всех этапах
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <h2 className={styles.sectionTitle}>Категории продукции</h2>
            <p className={styles.sectionSubtitle}>Выберите нужное направление</p>
          </div>

          <div className={`${styles.categoriesGrid} ${styles.animateOnScroll}`}>
            <Link href="/catalog?category=filters" className={styles.categoryCard}>
              <div className={styles.categoryTop}>
                <div className={styles.categoryIconWrapper}>
                  <Shield size={40} />
                </div>
                <div className={styles.categoryCount}>120+</div>
              </div>
              <div className={styles.categoryBottom}>
                <h3 className={styles.categoryTitle}>Экстрим</h3>
                <p className={styles.categoryDescription}>
                  Снаряжение для экстремальных видов спорта и активного отдыха
                </p>
                <div className={styles.categoryLink}>
                  <span>Смотреть</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            <Link href="/catalog?category=pumps" className={styles.categoryCard}>
              <div className={styles.categoryTop}>
                <div className={styles.categoryIconWrapper}>
                  <Package size={40} />
                </div>
                <div className={styles.categoryCount}>85+</div>
              </div>
              <div className={styles.categoryBottom}>
                <h3 className={styles.categoryTitle}>Коллекции</h3>
                <p className={styles.categoryDescription}>
                  Редкие и лимитированные предметы для коллекционеров
                </p>
                <div className={styles.categoryLink}>
                  <span>Смотреть</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            <Link href="/catalog?category=systems" className={styles.categoryCard}>
              <div className={styles.categoryTop}>
                <div className={styles.categoryIconWrapper}>
                  <Target size={40} />
                </div>
                <div className={styles.categoryCount}>95+</div>
              </div>
              <div className={styles.categoryBottom}>
                <h3 className={styles.categoryTitle}>Экипировка</h3>
                <p className={styles.categoryDescription}>
                  Профессиональная экипировка и защита для экстремалов
                </p>
                <div className={styles.categoryLink}>
                  <span>Смотреть</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            <Link href="/catalog?category=accessories" className={styles.categoryCard}>
              <div className={styles.categoryTop}>
                <div className={styles.categoryIconWrapper}>
                  <Star size={40} />
                </div>
                <div className={styles.categoryCount}>200+</div>
              </div>
              <div className={styles.categoryBottom}>
                <h3 className={styles.categoryTitle}>Аксессуары</h3>
                <p className={styles.categoryDescription}>
                  Стильные аксессуары и мерч для настоящих экстремалов
                </p>
                <div className={styles.categoryLink}>
                  <span>Смотреть</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={`${styles.statsGrid} ${styles.animateOnScroll}`}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>3000+</div>
              <div className={styles.statLabel}>Довольных экстремалов</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Поддержка клиентов</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>5 лет</div>
              <div className={styles.statLabel}>На рынке экстрима</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={`${styles.ctaCard} ${styles.animateOnScroll}`}>
          <BackgroundPaths />
          
          <div className={styles.ctaGrid}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaBadge}>
                <span className={styles.ctaBadgeDot}></span>
                Начните сейчас
              </div>
              <h2 className={styles.ctaTitle}>
                Готовы к приключениям?
              </h2>
              <p className={styles.ctaText}>
                Получите профессиональную консультацию и подберите идеальное снаряжение для экстрима или уникальный предмет для коллекции
              </p>
              
              <div className={styles.ctaFeatures}>
                <div className={styles.ctaFeature}>
                  <Check size={20} />
                  <span>Бесплатная консультация</span>
                </div>
                <div className={styles.ctaFeature}>
                  <Check size={20} />
                  <span>Гарантия подлинности</span>
                </div>
                <div className={styles.ctaFeature}>
                  <Check size={20} />
                  <span>Эксклюзивные товары</span>
                </div>
              </div>
            </div>

            <div className={styles.ctaRight}>
              <div className={styles.ctaMainCard}>
                <div className={styles.ctaMainCardHeader}>
                  <div className={styles.ctaMainCardBadge}>
                    <span className={styles.ctaMainCardBadgeDot}></span>
                    Премиум коллекция
                  </div>
                </div>
                
                <div className={styles.ctaMainCardStats}>
                  <div className={styles.ctaMainCardStat}>
                    <div className={styles.ctaMainCardStatValue}>3000+</div>
                    <div className={styles.ctaMainCardStatLabel}>Экстремалов</div>
                  </div>
                  <div className={styles.ctaMainCardStat}>
                    <div className={styles.ctaMainCardStatValue}>100%</div>
                    <div className={styles.ctaMainCardStatLabel}>Оригинал</div>
                  </div>
                </div>

                <div className={styles.ctaMainCardActions}>
                  <Link href="/catalog" className={styles.ctaCardBtnPrimary}>
                    <span>Каталог</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/contact" className={styles.ctaCardBtnSecondary}>
                    <Mail size={18} />
                    <span>Связаться</span>
                  </Link>
                </div>
              </div>

              <div className={styles.ctaSecondaryCards}>
                <div className={styles.ctaSmallCard}>
                  <div className={styles.ctaSmallCardIcon}>
                    <Shield size={24} />
                  </div>
                  <div className={styles.ctaSmallCardText}>
                    <div className={styles.ctaSmallCardTitle}>Сертификат</div>
                    <div className={styles.ctaSmallCardSubtitle}>ISO 9001:2015</div>
                  </div>
                </div>

                <div className={styles.ctaSmallCard}>
                  <div className={styles.ctaSmallCardIcon}>
                    <Clock size={24} />
                  </div>
                  <div className={styles.ctaSmallCardText}>
                    <div className={styles.ctaSmallCardTitle}>Поддержка</div>
                    <div className={styles.ctaSmallCardSubtitle}>24/7 онлайн</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
