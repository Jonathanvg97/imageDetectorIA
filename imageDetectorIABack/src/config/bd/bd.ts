// db.ts
import { Pool } from "pg";
import { envs } from "../envs";

const pool = new Pool({
  connectionString: envs.DATABASE_URL,
  ssl: false,
});

// Función para probar la conexión a la base de datos
export const checkDatabaseConnection = async () => {
  try {
    // Ejecutar una consulta simple para verificar la conexión
    await pool.query("SELECT NOW()");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Lanza el error para evitar iniciar el servidor si hay un problema
  }
};

export default pool;
