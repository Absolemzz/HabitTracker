// Root UI container for the Habit Tracker
import { useState, useRef } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types';

// Mock habit data for testing
const initialHabits: Habit[] = [
  { id: 1, name: 'Drink Water', completed: true },
  { id: 2, name: 'Exercise', completed: false },
  { id: 3, name: 'Read Book', completed: true },
];

function App() {
  // State to manage habits
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  // State for the new habit input
  const [newHabit, setNewHabit] = useState('');

  // Ref for input to auto-focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle habit completion by ID
  const toggleHabit = (id: number) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  // Adds new habit handler
  const handleAddHabit = () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return; // prevent empty input

    // Check for duplicate habit name (case-insensitive)
    const isDuplicate = habits.some(
      (habit) => habit.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      alert('Habit already exists!');
      return;
    }

    const newId = habits.length > 0 ? habits[habits.length - 1].id + 1 : 1;
    const newHabitItem: Habit = {
      id: newId,
      name: trimmed,
      completed: false,
    };

    setHabits([...habits, newHabitItem]);
    setNewHabit('');

    // Auto-focus input after adding
    inputRef.current?.focus();
  };

  return (
    // Full-screen dark layout with centered content
    <div className="min-h-screen bg-gray-950 text-white p-6 flex items-start justify-center">
      {/* Main container for content */}
      <div className="w-full max-w-md space-y-6">
        {/* App title and subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Habit Tracker
          </h1>
          <p className="text-sm text-gray-400">
            Your Journey to Consistent Progress
          </p>
        </div>

        {/* New Habit Input Section */}
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

        {/* Habit list */}
        <HabitList habits={habits} toggleHabit={toggleHabit} />
      </div>
    </div>
  );
}

export default App;


