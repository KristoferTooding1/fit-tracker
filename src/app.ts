import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

interface CreateExerciseBody {
    name: string;
    category?: string;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/exercises', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM exercises');
    res.json(result.rows);
});

app.post('/exercises', async (req: Request<{}, {}, CreateExerciseBody>, res: Response) => {
    const { name, category } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const result = await pool.query(
        'INSERT INTO exercises (name, category) VALUES ($1, $2) RETURNING *',
        [name, category ?? null]
    );

    res.status(201).json(result.rows[0]);
});

export default app;