import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

interface CreateExerciseBody {
    name: string;
    category?: string;
}
interface WorkoutExerciseInput {
    exercise_id: number;
    sets: number;
    reps: number;
    weight_kg: number;
}

interface CreateWorkoutBody {
    date: string;
    notes?: string;
    exercises: WorkoutExerciseInput[];
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

app.post('/workouts', async (req: Request<{}, {}, CreateWorkoutBody>, res: Response) => {
    const { date, notes, exercises } = req.body;

    if (!date || !exercises || exercises.length === 0) {
        return res.status(400).json({ error: 'date and at least one exercise are required' });
    }

    const workoutResult = await pool.query(
        'INSERT INTO workouts (date, notes) VALUES ($1, $2) RETURNING *',
        [date, notes ?? null]
    );
    const workout = workoutResult.rows[0];

    for (const ex of exercises) {
        await pool.query(
            'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight_kg) VALUES ($1, $2, $3, $4, $5)',
            [workout.id, ex.exercise_id, ex.sets, ex.reps, ex.weight_kg]
        );
    }

    res.status(201).json({ ...workout, exercises });
});

export default app;