import { QueryResult } from 'pg';
import { query } from './queries';
import { dbLogger, DB_LOGGING } from '../config/database';

// Функция для тестирования соединения
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    const row = (result as QueryResult).rows[0];
    dbLogger.info('Database connected successfully');
    dbLogger.debug('Connection details:', {
      current_time: row.current_time,
      pg_version: row.pg_version.split(' ')[0] // Показываем только версию PostgreSQL
    });
    return true;
  } catch (error) {
    dbLogger.error('Database connection failed');
    dbLogger.debug('Connection error details:', error);
    return false;
  }
}

// Проверка подключения при инициализации (только если включено тестирование)
if (DB_LOGGING.testConnection) {
  testConnection().then((connected) => {
    if (!connected) {
      dbLogger.error('БАЗА ДАННЫХ НЕ ПОДКЛЮЧЕНА!');
      dbLogger.info('Читайте инструкции в DATABASE_SETUP.md');
      dbLogger.info('Проверьте файл .env.local');
    }
  });
}
