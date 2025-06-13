import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Interface for Habit
interface Habit {
  id: number;
  name: string;
  description?: string;
  completed: number;
}

// Initialize SQLite DB
let db: Database<sqlite3.Database>;
(async () => {
  try {
    db = await open({
      filename: process.env.DB_PATH || './habits.db',
      driver: sqlite3.Database,
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0
      )
    `);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
  }
})();

// Async handler wrapper to fix TS2345
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// GET all habits
app.get('/habits', asyncHandler(async (req: Request, res: Response) => {
  const habits: Habit[] = await db.all('SELECT * FROM habits');
  res.json(habits);
}));

// POST new habit
app.post('/habits', asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body as { name?: string; description?: string };
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  const result = await db.run(
    'INSERT INTO habits (name, description, completed) VALUES (?, ?, ?)',
    [name, description || null, 0]
  );
  res.status(201).json({ id: result.lastID, name, description, completed: 0 });
}));

// PUT toggle habit completion
app.put('/habits/:id/toggle', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit: Habit | undefined = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  await db.run('UPDATE habits SET completed = NOT completed WHERE id = ?', id);
  const updated: Habit | undefined = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!updated) {
    return res.status(500).json({ error: 'Failed to retrieve updated habit' });
  }
  res.json(updated);
}));

// DELETE habit by id
app.delete('/habits/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  await db.run('DELETE FROM habits WHERE id = ?', id);
  res.status(200).json({ message: 'Habit deleted successfully' });
}));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});