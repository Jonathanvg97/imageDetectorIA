// db.ts
import { Pool } from "pg";
import { envs } from "../envs";

const pool = new Pool({
  connectionString: envs.DATABASE_URL,
  ssl: false,
});

export default pool;
