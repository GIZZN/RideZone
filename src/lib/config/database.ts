// Конфигурация базы данных и логирования

// Управление логированием базы данных
export const DB_LOGGING = {
  enabled: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  level: process.env.DB_LOG_LEVEL || 'info', // 'silent', 'error', 'warn', 'info', 'debug'
  showConfig: process.env.DB_SHOW_CONFIG === 'true',
  testConnection: process.env.DB_TEST_CONNECTION !== 'false', // По умолчанию включено
};

// Логгер для базы данных
export const dbLogger = {
  error: (message: string, ...args: unknown[]) => {
    if (DB_LOGGING.enabled && ['error', 'warn', 'info', 'debug'].includes(DB_LOGGING.level)) {
      console.error(`❌ [DB ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (DB_LOGGING.enabled && ['warn', 'info', 'debug'].includes(DB_LOGGING.level)) {
      console.warn(`⚠️ [DB WARN] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (DB_LOGGING.enabled && ['info', 'debug'].includes(DB_LOGGING.level)) {
      console.log(`ℹ️ [DB INFO] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (DB_LOGGING.enabled && DB_LOGGING.level === 'debug') {
      console.log(`🔍 [DB DEBUG] ${message}`, ...args);
    }
  },
  
  config: (message: string, ...args: unknown[]) => {
    if (DB_LOGGING.showConfig) {
      console.log(`🔧 [DB CONFIG] ${message}`, ...args);
    }
  }
};

// Поддержка разных вариантов имен переменных окружения
export const getEnvVar = (names: string[]): string | undefined => {
  for (const name of names) {
    if (process.env[name]) {
      return process.env[name];
    }
  }
  return undefined;
};

// Получение переменных окружения для базы данных
export const getDatabaseConfig = () => {
  const POSTGRES_USER = getEnvVar(['POSTGRES_USER', 'DB_USER']);
  const POSTGRES_PASSWORD = getEnvVar(['POSTGRES_PASSWORD', 'DB_PASSWORD']);
  const POSTGRES_DATABASE = getEnvVar(['POSTGRES_DATABASE', 'DB_NAME']);
  const POSTGRES_HOST = getEnvVar(['POSTGRES_HOST', 'DB_HOST']);
  const POSTGRES_PORT = getEnvVar(['POSTGRES_PORT', 'DB_PORT']);

  // Проверка обязательных переменных окружения
  if (!POSTGRES_USER) {
    throw new Error('POSTGRES_USER (или DB_USER) не задан в переменных окружения');
  }
  if (!POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD (или DB_PASSWORD) не задан в переменных окружения');
  }
  if (!POSTGRES_DATABASE) {
    throw new Error('POSTGRES_DATABASE (или DB_NAME) не задан в переменных окружения');
  }
  if (!POSTGRES_HOST) {
    throw new Error('POSTGRES_HOST (или DB_HOST) не задан в переменных окружения');
  }
  if (!POSTGRES_PORT) {
    throw new Error('POSTGRES_PORT (или DB_PORT) не задан в переменных окружения');
  }

  return {
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
  };
};

// Настройки SSL для работы с существующим pg_hba.conf
export const getSSLConfig = (host: string) => {
  // Принудительное отключение SSL через переменную окружения
  if (process.env.POSTGRES_SSL === 'false' || process.env.DB_SSL === 'false') {
    return false;
  }
  
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  
  if (isLocalhost) {
    return false;
  }
  
  // Отключаем SSL для всех хостов (включая удаленные)
  // Это решает проблему с pg_hba.conf rejects connection
  return false;
};
