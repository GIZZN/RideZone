'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type TabType = 'orders' | 'contacts';

interface Order {
  id: number;
  user_name: string;
  user_email: string;
  total: number;
  status: string;
  date: string;
  items_count: number;
}

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

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Проверка прав доступа
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [activeTab, user]);

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <>
        <Header />
        <main className={styles.adminPage}>
          <div className={styles.container}>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Проверка прав доступа...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setOrders([]);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      loadData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const updateContactStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      loadData();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const sendReply = async (id: number) => {
    if (!replyText.trim()) return;
    
    setSendingReply(true);
    try {
      await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply: replyText })
      });
      setReplyingTo(null);
      setReplyText('');
      loadData();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Ожидает',
      processing: 'В работе',
      completed: 'Завершён',
      new: 'Новое',
      replied: 'Отвечено'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    return styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`];
  };

  return (
    <div>
      <Header />
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Панель администратора</h1>
            <p className={styles.subtitle}>Управление заказами и обращениями</p>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Заказы ({orders.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'contacts' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Обращения ({contacts.filter(c => c.status === 'new').length})
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <>
              {activeTab === 'orders' && (
                <div className={styles.content}>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Клиент</th>
                          <th>Email</th>
                          <th>Товаров</th>
                          <th>Сумма</th>
                          <th>Дата</th>
                          <th>Статус</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td className={styles.cellId}>#{order.id}</td>
                            <td className={styles.cellUser}>{order.user_name}</td>
                            <td className={styles.cellEmail}>{order.user_email}</td>
                            <td className={styles.cellItems}>{order.items_count}</td>
                            <td className={styles.cellPrice}>{order.total.toLocaleString()} ₽</td>
                            <td className={styles.cellDate}>{order.date}</td>
                            <td>
                              <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actions}>
                                {order.status === 'pending' && (
                                  <button 
                                    className={styles.actionBtn}
                                    onClick={() => updateOrderStatus(order.id, 'processing')}
                                    title="Взять в работу"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                )}
                                {order.status === 'processing' && (
                                  <button 
                                    className={styles.actionBtn}
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    title="Завершить"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className={styles.content}>
                  <div className={styles.contactsList}>
                    {contacts.map(contact => (
                      <div key={contact.id} className={styles.contactCard}>
                        <div className={styles.contactHeader}>
                          <div className={styles.contactInfo}>
                            <h3 className={styles.contactName}>{contact.name}</h3>
                            <div className={styles.contactMeta}>
                              <span>{contact.email}</span>
                              <span>•</span>
                              <span>{contact.phone}</span>
                              <span>•</span>
                              <span>{contact.date}</span>
                            </div>
                          </div>
                          <span className={`${styles.status} ${getStatusClass(contact.status)}`}>
                            {getStatusLabel(contact.status)}
                          </span>
                        </div>
                        <div className={styles.contactMessage}>
                          <strong>Сообщение:</strong>
                          <p>{contact.message}</p>
                        </div>
                        
                        {contact.reply && (
                          <div className={styles.contactReply}>
                            <strong>Ответ поддержки:</strong>
                            <p>{contact.reply}</p>
                          </div>
                        )}

                        {replyingTo === contact.id ? (
                          <div className={styles.replyForm}>
                            <textarea
                              className={styles.replyTextarea}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Введите ответ..."
                              rows={4}
                            />
                            <div className={styles.replyActions}>
                              <button 
                                className={styles.sendBtn}
                                onClick={() => sendReply(contact.id)}
                                disabled={sendingReply || !replyText.trim()}
                              >
                                {sendingReply ? 'Отправка...' : 'Отправить'}
                              </button>
                              <button 
                                className={styles.cancelBtn}
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.contactActions}>
                            <button 
                              className={styles.replyBtn}
                              onClick={() => {
                                setReplyingTo(contact.id);
                                setReplyText(contact.reply || '');
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {contact.reply ? 'Изменить ответ' : 'Ответить'}
                            </button>
                            <button 
                              className={styles.markBtn}
                              onClick={() => updateContactStatus(contact.id, contact.status === 'new' ? 'replied' : 'new')}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {contact.status === 'new' ? 'Отметить прочитанным' : 'Отметить новым'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
