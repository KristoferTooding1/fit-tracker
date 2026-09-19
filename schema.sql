   CREATE TABLE exercises (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     category TEXT
   );

   CREATE TABLE workouts (
     id SERIAL PRIMARY KEY,
     date DATE NOT NULL,
     notes TEXT
   );

   CREATE TABLE workout_exercises (
     id SERIAL PRIMARY KEY,
     workout_id INTEGER NOT NULL REFERENCES workouts(id),
     exercise_id INTEGER NOT NULL REFERENCES exercises(id),
     sets INTEGER,
     reps INTEGER,
     weight_kg NUMERIC
   );