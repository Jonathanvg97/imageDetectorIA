import { Client } from "pg";
import { envs } from "./envs";

const client = new Client({
  connectionString: envs.DATABASE_URL,
  ssl: false,
});

const initDb = async () => {
  try {
    await client.connect();

    // Crear tabla consumption si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS consumption (
        clientIp TEXT PRIMARY KEY,
        count INT NOT NULL DEFAULT 0
      );
    `);
    // Crear tabla users si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        picture TEXT,
        password TEXT
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // Salir con error si algo sale mal
  } finally {
    await client.end();
  }
};

initDb();
