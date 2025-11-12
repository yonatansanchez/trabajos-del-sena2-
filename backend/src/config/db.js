import pg from 'pg';

const { Pool } = pg;

let pool;

export const initDatabase = async () => {
  if (pool) {
    return pool;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en el archivo .env');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT ?? 30000)
  });

  try {
    await pool.query('SELECT 1');
    console.log('Conexión con la base de datos verificada exitosamente.');
  } catch (error) {
    console.error('Error al verificar la conexión con la base de datos:', error);
    throw error;
  }

  return pool;
};

export const getClient = async () => {
  if (!pool) {
    await initDatabase();
  }
  return pool.connect();
};

export const query = async (text, params) => {
  if (!pool) {
    await initDatabase();
  }
  return pool.query(text, params);
};
