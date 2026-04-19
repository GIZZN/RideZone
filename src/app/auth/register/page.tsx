'use client';

import React, { useState } from 'react';
import styles from '../login/page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, ArrowRight, Shield, Zap, Check } from 'lucide-react';
import FlowFieldBackground from '@/components/FlowFieldBackground/FlowFieldBackground';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      try {
        const result = await register(formData.name, formData.email, formData.password);
        
        if (result.success) {
          router.push('/profile');
        } else {
          setApiError(result.error || 'Ошибка регистрации');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setApiError('Ошибка соединения с сервером');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.page}>
      <FlowFieldBackground 
        color="#a3e635"
        trailOpacity={0.12}
        particleCount={600}
        speed={0.8}
      />
      
      <div className={styles.authContainer}>
        <div className={styles.authGrid}>
          {/* Левая часть - информация */}
          <div className={styles.authLeft}>
            <Link href="/" className={styles.logo}>
              <h1>RideZone</h1>
            </Link>
            
            <div className={styles.authInfo}>
              <div className={styles.authBadge}>
                <span className={styles.badgeDot}></span>
                Регистрация в системе
              </div>
              
              <h2 className={styles.authTitle}>
                Создание учетной<br />
                <span className={styles.titleAccent}>записи</span>
              </h2>
              
              <p className={styles.authDescription}>
                Зарегистрируйтесь для получения доступа к полному функционалу платформы и персональному кабинету
              </p>
              
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Check size={16} />
                  </div>
                  <span>Полный доступ к каталогу</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Check size={16} />
                  </div>
                  <span>Персональный кабинет</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Check size={16} />
                  </div>
                  <span>Управление заказами</span>
                </div>
              </div>
            </div>
            
            {/* Декоративные карточки */}
            <div className={styles.decorCards}>
              <div className={styles.decorCard}>
                <div className={styles.decorCardIcon}>
                  <Shield size={24} />
                </div>
                <div className={styles.decorCardText}>
                  <div className={styles.decorCardValue}>100%</div>
                  <div className={styles.decorCardLabel}>Безопасность</div>
                </div>
              </div>
              
              <div className={styles.decorCard}>
                <div className={styles.decorCardIcon}>
                  <Zap size={24} />
                </div>
                <div className={styles.decorCardText}>
                  <div className={styles.decorCardValue}>3000+</div>
                  <div className={styles.decorCardLabel}>Клиентов</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Правая часть - форма */}
          <div className={styles.authRight}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h3>Регистрация</h3>
                <p>Заполните форму для создания учетной записи</p>
              </div>
              
              {apiError && (
                <div className={styles.apiError}>
                  {apiError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">
                    <User size={18} />
                    <span>Полное имя</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? styles.errorInput : ''}
                    placeholder="Введите ваше имя"
                  />
                  {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <Mail size={18} />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.errorInput : ''}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    <Lock size={18} />
                    <span>Пароль</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.errorInput : ''}
                    placeholder="••••••••"
                  />
                  {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">
                    <Lock size={18} />
                    <span>Подтвердите пароль</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? styles.errorInput : ''}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  <span>{isLoading ? 'Обработка...' : 'Создать учетную запись'}</span>
                  <ArrowRight size={20} />
                </button>
              </form>

              <div className={styles.formFooter}>
                <p className={styles.signupPrompt}>
                  Уже зарегистрированы? <Link href="/auth/login">Войти в систему</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
