import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT as string, 10),
  database: process.env.DATABASE_NAME,
});

export default pool;
