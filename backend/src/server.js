import http from 'http';
import app from './app.js';
import { initDatabase } from './config/db.js';

const PORT = process.env.PORT ?? 4000;

const bootstrap = async () => {
  try {
    await initDatabase();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    if (error.message.includes('DATABASE_URL no está definida')) {
      console.error('Por favor, asegúrate de que el archivo .env existe en la carpeta /backend y contiene la variable DATABASE_URL.');
    }
    process.exit(1);
  }
};

bootstrap();
