import { Pool } from 'pg';

if (!process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Faltam variáveis de ambiente críticas para o banco de dados.');
}

// Padrão Singleton: Evita vazamento de conexões no Next.js
const globalForPg = global as unknown as { pgPool: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST || 'postgres', // No Podman, aponta para o nome do container
    port: 5432,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
