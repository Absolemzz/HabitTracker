import { useState, useRef, useEffect } from 'react';
import HabitList from '../components/HabitList';
import DatePicker from '../DatePicker';
import type { Habit } from '../types';
import { Plus, Calendar } from 'lucide-react';

function HabitPage() {
  const MAX_HABITS = 7;
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('http://localhost:3001/habits')
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch(() => alert('Failed to load habits.'));
  }, []);

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
    if (habits.length >= MAX_HABITS) {
      alert('You’ve reached the daily limit of 7 habits.');
      return;
    }
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

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 flex items-start justify-center">
        <div className="w-full max-w-md space-y-6 bg-gray-900/80 border border-gray-800 backdrop-blur-md p-6 rounded-2xl shadow-md transition-all duration-300">

          {/* Date Picker */}
          <DatePicker selectedDate={selectedDate} onChange={(d) => d && setSelectedDate(d)} />

          {/* Add Habit Input */}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add a new habit..."
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            <button
              onClick={handleAddHabit}
              disabled={habits.length >= MAX_HABITS}
              className={`p-2 sm:p-2.5 rounded-lg transition-colors flex items-center justify-center shadow-md ${
                habits.length >= MAX_HABITS
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-700 hover:bg-purple-600 text-white'
              }`}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {habits.length >= MAX_HABITS && (
            <p className="text-sm text-red-500 text-center">
              Daily habit limit reached (7).
            </p>
          )}

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-400 font-medium">
                <span>{progressPercent === 100 ? 'All done!' : "Today's Progress"}</span>
                <span>{Math.round(progressPercent)}% ({completedCount} / {totalCount})</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded">
                <div
                  className="h-2 bg-purple-500 rounded transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {habits.length === 0 && (
            <div className="text-center text-gray-400 mt-4">
              <Calendar className="w-36 h-36 mx-auto text-gray-500" />
            </div>
          )}

          {/* Habit List */}
          <HabitList habits={habits} toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
        </div>
      </div>
    </div>
  );
}

export default HabitPage;
