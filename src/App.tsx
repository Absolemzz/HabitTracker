import { useState, useRef, useEffect } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load habits from backend on initial render
  useEffect(() => {
    fetch('http://localhost:3001/habits')
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch(() => alert('Failed to load habits.'));
  }, []);

  // toggleHabit to sync with backend using your backend toggle route
  const toggleHabit = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/habits/${id}/toggle`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error();

      const updatedHabit = await res.json();
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit))
      );
    } catch {
      alert('Failed to update habit status.');
    }
  };

  const handleAddHabit = async () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return;

    const isDuplicate = habits.some(
      (habit) => habit.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      alert('Habit already exists!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, completed: false }),
      });

      if (!res.ok) throw new Error();

      const createdHabit = await res.json();
      setHabits((prev) => [...prev, createdHabit]);
      setNewHabit('');
      inputRef.current?.focus();
    } catch {
      alert('Failed to add habit.');
    }
  };

  const deleteHabit = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      const res = await fetch(`http://localhost:3001/habits/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
      } else {
        alert('Failed to delete habit.');
      }
    } catch {
      alert('Error deleting habit.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex items-start justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Habit Tracker
          </h1>
          <p className="text-sm text-gray-400">
            Your Journey to Consistent Progress
          </p>
        </div>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddHabit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Add
          </button>
        </div>

        <HabitList habits={habits} toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
      </div>
    </div>
  );
}

export default App;






