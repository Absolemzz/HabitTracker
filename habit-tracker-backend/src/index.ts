import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Interfaces
interface Habit {
  id: number;
  name: string;
  description?: string;
  completed: number;
}

interface MonthlySummary {
  completedDays: number[];
  partialDays: number[];
  totalCompleted: number;
  bestStreak: number;
  currentStreak: number;
}

let db: Database<sqlite3.Database>;

// Streak utility
function calculateStreaks(days: number[]): { bestStreak: number; currentStreak: number } {
  const sorted = [...days].sort((a, b) => a - b);
  let best = 0;
  let current = 0;
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      streak++;
    } else {
      best = Math.max(best, streak);
      streak = 1;
    }
  }
  best = Math.max(best, streak);

  const today = new Date().getDate();
  const reversed = sorted.reverse();
  let curStreak = 0;
  for (let i = 0; i < reversed.length; i++) {
    if (i === 0 && reversed[i] === today) {
      curStreak = 1;
    } else if (reversed[i] === today - curStreak) {
      curStreak++;
    } else {
      break;
    }
  }

  return { bestStreak: best, currentStreak: curStreak };
}

// Async handler wrapper
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Start server & DB
(async () => {
  try {
    db = await open({
      filename: process.env.DB_PATH || './habits.db',
      driver: sqlite3.Database,
    });

    // Habits table
    await db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0
      )  
    `);

    // Create tables
    await db.run(`
      CREATE TABLE IF NOT EXISTS monthly_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        completed_days TEXT NOT NULL,
        partial_days TEXT NOT NULL,
        total_completed INTEGER NOT NULL,
        best_streak INTEGER NOT NULL,
        current_streak INTEGER NOT NULL,
        UNIQUE(year, month)
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

// Routes
app.get('/habits', asyncHandler(async (req: Request, res: Response) => {
  const habits: Habit[] = await db.all('SELECT * FROM habits');
  res.json(habits);
}));

app.post('/habits', asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  const result = await db.run(
    'INSERT INTO habits (name, description, completed) VALUES (?, ?, ?)',
    [name, description || null, 0]
  );
  res.status(201).json({ id: result.lastID, name, description, completed: 0 });
}));

app.put('/habits/:id/toggle', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  await db.run('UPDATE habits SET completed = NOT completed WHERE id = ?', id);
  const updated = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!updated) {
    return res.status(500).json({ error: 'Failed to retrieve updated habit' });
  }

  // 🟣 Update Monthly Summary
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  let summary = await db.get('SELECT * FROM monthly_summaries WHERE year = ? AND month = ?', [year, month]);

  if (!summary) {
    await db.run(`
      INSERT INTO monthly_summaries (
        year, month, completed_days, partial_days, total_completed, best_streak, current_streak
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      year, month,
      JSON.stringify([]),
      JSON.stringify([]),
      0, 0, 0,
    ]);
    summary = await db.get('SELECT * FROM monthly_summaries WHERE year = ? AND month = ?', [year, month]);
  }

  let completedDays: number[] = JSON.parse(summary.completed_days);
  if (updated.completed === 1) {
    if (!completedDays.includes(day)) completedDays.push(day);
  } else {
    completedDays = completedDays.filter((d) => d !== day);
  }

  const totalCompleted = completedDays.length;
  const { bestStreak, currentStreak } = calculateStreaks(completedDays);

  await db.run(`
    UPDATE monthly_summaries
    SET completed_days = ?, total_completed = ?, best_streak = ?, current_streak = ?
    WHERE year = ? AND month = ?
  `, [
    JSON.stringify(completedDays),
    totalCompleted,
    bestStreak,
    currentStreak,
    year,
    month,
  ]);

  res.json(updated);
}));

app.delete('/habits/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit = await db.get('SELECT * FROM habits WHERE id = ?', id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  await db.run('DELETE FROM habits WHERE id = ?', id);
  res.status(200).json({ message: 'Habit deleted successfully' });
}));

app.get('/api/monthly-summary', asyncHandler(async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  if (isNaN(year) || isNaN(month)) {
    return res.status(400).json({ message: 'Invalid year or month' });
  }

  const summary = await db.get(
    `SELECT * FROM monthly_summaries WHERE year = ? AND month = ?`,
    [year, month]
  );

  if (!summary) {
    return res.status(404).json({ message: 'No data found for that month' });
  }

  res.json({
    completedDays: JSON.parse(summary.completed_days),
    partialDays: JSON.parse(summary.partial_days),
    totalCompleted: summary.total_completed,
    bestStreak: summary.best_streak,
    currentStreak: summary.current_streak,
  });
}));

// Error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

