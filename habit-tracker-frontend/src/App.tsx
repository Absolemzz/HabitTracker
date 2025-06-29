import { useState, useRef, useEffect } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types';
import { Plus, Calendar } from 'lucide-react';

// Main app component for managing and displaying habits //
function App() {
  // State for storing habits and new habit input //
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  // Ref to focus input after adding a habit for better UX //
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch habits from backend on component mount // MODIFIED
  useEffect(() => {
    fetch('http://localhost:3001/habits')
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch(() => alert('Failed to load habits.'));
  }, []);

  // Toggle a habit's completion status and sync with backend //
  const toggleHabit = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/habits/${id}/toggle`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error();

      const updatedHabit = await res.json();
      // Update state to reflect toggled habit without mutating original array //
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit))
      );
    } catch {
      alert('Failed to update habit status.');
    }
  };

  // Add a new habit, checking for duplicates and resetting input //
  const handleAddHabit = async () => {
    const trimmed = newHabit.trim();
    // Skip empty inputs to avoid invalid submissions //
    if (!trimmed) return;

    // Case-insensitive check to prevent duplicate habits //
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
      // Append new habit to state and clear input //
      setHabits((prev) => [...prev, createdHabit]);
      setNewHabit('');
      // Auto-focus input for quick addition of another habit // 
      inputRef.current?.focus();
    } catch {
      alert('Failed to add habit.');
    }
  };

  // Delete a habit after user confirmation // 
  const deleteHabit = async (id: number) => {
    // Prompt user to confirm deletion to prevent accidental removes // 
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      const res = await fetch(`http://localhost:3001/habits/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Remove habit from state by filtering out the deleted ID // 
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
      } else {
        alert('Failed to delete habit.');
      }
    } catch {
      alert('Error deleting habit.');
    }
  };

  return (
    // Full-screen container with starry background for visual appeal // 
    <div
      className="min-h-screen bg-black text-white p-6 flex items-start justify-center"
      style={{
        backgroundImage: "url('/bg-stars.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Centered card for the main app content */}
      <div className="w-full max-w-md space-y-6 bg-black/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        {/* Header with title and tagline */}
        <div className="text-center space-y-1">
          <h1 className="capitalize-first text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            daily habits
          </h1>
          <p className="text-sm text-gray-400">
            Your Journey to Consistent Progress
          </p>
        </div>

        {/* Input and button for adding new habits */}
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            ref={inputRef}
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <button
            onClick={handleAddHabit}
            className="px-2 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors flex items-center justify-center shadow-md"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Empty state with a calendar icon */}
        {habits.length === 0 && (
        <div className="text-center text-gray-400 mt-4">
            <Calendar className="w-36 h-36 mx-auto text-gray-500" />
          </div>
        )}

        {/* Render the list of habits */}
        <HabitList
          habits={habits}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
        />
      </div>
    </div>
  );
}

export default App;










