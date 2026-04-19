import { Pool, PoolClient } from 'pg';
import { getDatabaseConfig, getSSLConfig, dbLogger } from '../config/database';

// Получаем конфигурацию базы данных
const dbConfig = getDatabaseConfig();

// Конфигурация подключения к PostgreSQL
export const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: getSSLConfig(dbConfig.host),
  // Настройки пула соединений
  max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '2000'),
});

// Обработка ошибок пула
pool.on('error', (err) => {
  dbLogger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для получения клиента (для сложных операций)
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

// Функция для закрытия пула соединений (для graceful shutdown)
export async function closePool(): Promise<void> {
  await pool.end();
  dbLogger.info('Database pool closed');
}

// Логирование конфигурации при инициализации
dbLogger.config('PostgreSQL Configuration:');
dbLogger.config(`Host: ${dbConfig.host}:${dbConfig.port}`);
dbLogger.config(`Database: ${dbConfig.database}`);
dbLogger.config(`User: ${dbConfig.user}`);
dbLogger.config(`SSL: ${JSON.stringify(getSSLConfig(dbConfig.host))}`);

// Автоматический запуск миграций при инициализации
let migrationsRun = false;

export async function ensureMigrations() {
  if (migrationsRun) return;
  
  try {
    const { runMigrations } = await import('./migrations');
    await runMigrations();
    migrationsRun = true;
    dbLogger.info('Database migrations completed');
  } catch (error) {
    dbLogger.error('Failed to run migrations:', error);
    // Не падаем, чтобы приложение могло запуститься
  }
}

// Запускаем миграции при первом подключении
pool.once('connect', () => {
  ensureMigrations().catch(err => {
    dbLogger.error('Migration error on first connect:', err);
  });
});

export default pool;
