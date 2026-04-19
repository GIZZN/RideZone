// Основной экспорт всех функций базы данных
export { pool, getClient, closePool } from './connection';
export { query, transaction } from './queries';
export { testConnection } from './testing';

// Экспорт pool как default для обратной совместимости
export { default } from './connection';
