import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/exercises', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM exercises');
    res.json(result.rows);
});

export default app;