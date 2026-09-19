import { Pool } from 'pg';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'fituser',
    password: 'fitpass',
    database: 'fittracker',
});

export default pool;