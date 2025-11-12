import fs from 'fs';
import path from 'path';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const seed = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('Error: La variable de entorno DATABASE_URL no está definida.');
    console.error('Asegúrate de que el archivo .env exista en la carpeta /backend y contenga la URL de la base de datos.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Conectando a la base de datos...');
    const client = await pool.connect();
    console.log('Conexión exitosa.');

    // Construir la ruta al archivo seed.sql
    // __dirname no está disponible en módulos ES, así que usamos import.meta.url
    const currentDir = path.dirname(new URL(import.meta.url).pathname.substring(1)); // Quita la barra inicial en Windows
    const seedFilePath = path.join(currentDir, 'seed.sql');
    
    console.log(`Leyendo el archivo de seed: ${seedFilePath}`);
    const seedQuery = fs.readFileSync(seedFilePath, 'utf8');

    console.log('Ejecutando script de seed...');
    await client.query(seedQuery);
    
    console.log('¡Éxito! La base de datos ha sido poblada con los productos de ejemplo.');
    client.release();
  } catch (err) {
    console.error('Error durante el proceso de seed:', err.stack);
  } finally {
    await pool.end();
    console.log('Conexión con la base de datos cerrada.');
  }
};

seed();
