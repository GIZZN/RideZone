import { PoolClient } from 'pg';
import { pool } from './connection';
import { dbLogger } from '../config/database';

// Функция для выполнения запросов
export async function query(text: string, params?: unknown[]): Promise<unknown> {
  try {
    const client = await pool.connect();
    try {
      dbLogger.debug(`Executing query: ${text}`, params);
      const result = await client.query(text, params);
      dbLogger.debug(`Query result: ${result.rowCount} rows`);
      return result;
    } catch (error) {
      dbLogger.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    handleConnectionError(error);
    throw error;
  }
}

// Функция для выполнения транзакций
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    dbLogger.debug('Transaction started');
    const result = await callback(client);
    await client.query('COMMIT');
    dbLogger.debug('Transaction committed');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    dbLogger.error('Transaction rolled back due to error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Обработка ошибок подключения с понятными сообщениями
function handleConnectionError(error: unknown) {
  if (!(error instanceof Error) || !('code' in error)) {
    return;
  }

  const dbConfig = {
    host: process.env.POSTGRES_HOST || process.env.DB_HOST,
    port: process.env.POSTGRES_PORT || process.env.DB_PORT,
    database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
    user: process.env.POSTGRES_USER || process.env.DB_USER,
  };

  switch (error.code) {
    case '28P01':
      dbLogger.error('PostgreSQL Authentication Error: Неверный пользователь или пароль');
      dbLogger.info('Проверьте настройки в .env.local:');
      dbLogger.info(`Пользователь: ${dbConfig.user}`);
      break;
      
    case '28000':
      dbLogger.error('PostgreSQL SSL/Authentication Error: Проблема с SSL или pg_hba.conf');
      dbLogger.info('Для удаленной БД убедитесь что:');
      dbLogger.info('1. SSL включен (попробуйте добавить POSTGRES_SSL=true в .env)');
      dbLogger.info('2. pg_hba.conf разрешает подключения с вашего IP');
      dbLogger.info('3. База данных поддерживает SSL соединения');
      dbLogger.debug(`Хост: ${dbConfig.host}, Порт: ${dbConfig.port}`);
      break;
      
    case 'ECONNREFUSED':
      dbLogger.error('PostgreSQL Connection Refused: PostgreSQL не запущен');
      dbLogger.info(`Проверьте что PostgreSQL работает на ${dbConfig.host}:${dbConfig.port}`);
      break;
      
    case '3D000':
      dbLogger.error('Database does not exist: База данных не найдена');
      dbLogger.info(`Создайте базу данных: CREATE DATABASE ${dbConfig.database};`);
      break;
      
    default:
      dbLogger.error('Unknown database error:', error);
  }
}
