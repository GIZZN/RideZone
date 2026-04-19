'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackgroundPaths from '@/components/BackgroundPaths/BackgroundPaths';
import { useAuth } from '@/context/AuthContext';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  reply?: string;
  status: string;
  date: string;
}

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      setCurrentEmail(user.email);
      loadUserContacts(user.email);
    }
  }, [user]);

  const loadUserContacts = async (email: string) => {
    if (!email) return;
    
    setLoadingContacts(true);
    try {
      const response = await fetch('/api/contacts');
      const allContacts = await response.json();
      const filtered = allContacts.filter((c: Contact) => c.email === email);
      setUserContacts(filtered);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setCurrentEmail(formData.email);
        setFormData({ ...formData, message: '' });
        await loadUserContacts(formData.email);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.contactPage}>
        <BackgroundPaths />
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.infoHeader}>
                <h1 className={styles.pageTitle}>Свяжитесь с нами</h1>
                <p className={styles.pageSubtitle}>
                  Мы всегда рады ответить на ваши вопросы и помочь с выбором
                </p>
              </div>
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Адрес</h3>
                    <p className={styles.infoText}>г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Телефон</h3>
                    <p className={styles.infoText}>+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Email</h3>
                    <p className={styles.infoText}>info@ridezone.ru</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Режим работы</h3>
                    <p className={styles.infoText}>Пн-Пт: 9:00 - 20:00 | Сб-Вс: 10:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.contactForm}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Имя</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="Ваше имя" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder="your@email.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>Телефон</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} placeholder="+7 (999) 123-45-67" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Сообщение</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} className={styles.textarea} placeholder="Ваше сообщение..." rows={6} required />
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {(userContacts.length > 0 || currentEmail) && (
        <div className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.contactsHistory}>
              <div className={styles.historyHeader}>
                <h2 className={styles.historyTitle}>
                  {userContacts.length > 0 ? 'Ваши обращения' : 'История обращений'}
                </h2>
                {currentEmail && (
                  <button 
                    className={styles.refreshButton}
                    onClick={() => loadUserContacts(currentEmail)}
                    disabled={loadingContacts}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {loadingContacts ? 'Обновление...' : 'Обновить'}
                  </button>
                )}
              </div>

              {loadingContacts ? (
                <div className={styles.loadingMessage}>Загрузка обращений...</div>
              ) : userContacts.length > 0 ? (
                <div className={styles.contactsList}>
                  {userContacts.map(contact => (
                    <div key={contact.id} className={styles.contactCard}>
                      <div className={styles.contactCardHeader}>
                        <div className={styles.contactCardInfo}>
                          <span className={styles.contactId}>Обращение #{contact.id}</span>
                          <span className={styles.contactDate}>{contact.date}</span>
                        </div>
                        <span className={`${styles.contactStatus} ${contact.status === 'replied' ? styles.statusReplied : styles.statusNew}`}>
                          {contact.status === 'replied' ? 'Отвечено' : 'В обработке'}
                        </span>
                      </div>

                      <div className={styles.contactCardMessage}>
                        <strong>Ваше сообщение:</strong>
                        <p>{contact.message}</p>
                      </div>

                      {contact.reply ? (
                        <div className={styles.contactCardReply}>
                          <strong>Ответ поддержки:</strong>
                          <p>{contact.reply}</p>
                        </div>
                      ) : (
                        <div className={styles.contactCardNoReply}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Ожидает ответа
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : currentEmail ? (
                <div className={styles.emptyMessage}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>У вас пока нет обращений</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
