import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Mail, Phone, ShoppingBag, Heart, Package, User, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>RideZone</h3>
            <p className={styles.tagline}>Экстрим и коллекции</p>
          </div>
          
          <div className={styles.linksGrid}>
            <Link href="/catalog" className={styles.linkCard}>
              <ShoppingBag size={20} />
              <span>Каталог</span>
            </Link>
            <Link href="/favorites" className={styles.linkCard}>
              <Heart size={20} />
              <span>Избранное</span>
            </Link>
            <Link href="/cart" className={styles.linkCard}>
              <Package size={20} />
              <span>Корзина</span>
            </Link>
            <Link href="/profile" className={styles.linkCard}>
              <User size={20} />
              <span>Профиль</span>
            </Link>
          </div>
          
          <div className={styles.contact}>
            <a href="tel:+74951234567" className={styles.contactItem}>
              <Phone size={16} />
              <span>+7 (495) 123-45-67</span>
              <ArrowRight size={16} className={styles.arrow} />
            </a>
            <a href="mailto:info@ridezone.ru" className={styles.contactItem}>
              <Mail size={16} />
              <span>info@ridezone.ru</span>
              <ArrowRight size={16} className={styles.arrow} />
            </a>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 RideZone. Все права защищены.</p>
          <div className={styles.policy}>
            <a href="#">Политика</a>
            <a href="#">Условия</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 