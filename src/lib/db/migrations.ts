import { pool } from './connection';

interface Migration {
  id: number;
  name: string;
  sql: string;
}

const migrations: Migration[] = [
  {
    id: 1,
    name: 'add_avatar_to_users',
    sql: `
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'avatar'
        ) THEN
          ALTER TABLE users ADD COLUMN avatar TEXT;
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'users' AND indexname = 'idx_users_email'
        ) THEN
          CREATE INDEX idx_users_email ON users(email);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'users' AND indexname = 'idx_users_created_at'
        ) THEN
          CREATE INDEX idx_users_created_at ON users(created_at);
        END IF;
      END $$;
    `
  },
  {
    id: 2,
    name: 'add_role_to_users',
    sql: `
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'role'
        ) THEN
          ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'users' AND indexname = 'idx_users_role'
        ) THEN
          CREATE INDEX idx_users_role ON users(role);
        END IF;
      END $$;
    `
  },
  {
    id: 3,
    name: 'create_contacts_table',
    sql: `
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
    `
  },
  {
    id: 4,
    name: 'add_reply_to_contacts',
    sql: `
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'contacts' AND column_name = 'reply'
        ) THEN
          ALTER TABLE contacts ADD COLUMN reply TEXT;
        END IF;
      END $$;
    `
  }
];

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function isMigrationApplied(id: number): Promise<boolean> {
  try {
    const result = await pool.query(
      'SELECT id FROM migrations WHERE id = $1',
      [id]
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

async function applyMigration(migration: Migration) {
  try {
    console.log(`Applying migration ${migration.id}: ${migration.name}`);
    await pool.query(migration.sql);
    await pool.query(
      'INSERT INTO migrations (id, name) VALUES ($1, $2)',
      [migration.id, migration.name]
    );
    console.log(`Migration ${migration.id} applied successfully`);
  } catch (error) {
    console.error(`Error applying migration ${migration.id}:`, error);
    throw error;
  }
}

export async function runMigrations() {
  try {
    console.log('Starting migrations...');
    await createMigrationsTable();
    for (const migration of migrations) {
      const applied = await isMigrationApplied(migration.id);
      if (!applied) {
        await applyMigration(migration);
      } else {
        console.log(`Migration ${migration.id} already applied, skipping`);
      }
    }
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
