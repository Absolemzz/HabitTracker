import type { Habit } from '../types';
import { CirclePlus } from 'lucide-react'; // Import CirclePlus icon

// Props interface for HabitList component
interface HabitListProps {
  habits: Habit[];
  // eslint-disable-next-line no-unused-vars
  toggleHabit: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  deleteHabit: (id: number) => void;
}

// Renders a list of habits or a placeholder if none exist //
function HabitList({ habits, toggleHabit, deleteHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p className="text-gray-400 text-center italic mt-4">
        No habits found. Add one to begin.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div
          key={habit.id}
          onClick={() => toggleHabit(habit.id)}
          className={`group flex items-center p-4 rounded-xl border border-gray-700 cursor-pointer transition-colors duration-200 ${
            habit.completed
              ? 'bg-blue-700 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {/* Habit name */}
          <span className="text-lg font-medium mr-2 capitalize-first">
            {habit.name}
          </span>

          {/* Status (with hover title for accessibility) */}
          <span
            className="text-sm opacity-80 ml-auto"
            title={habit.completed ? 'Completed' : 'Pending'}
          >
            {habit.completed ? 'Done' : '●'}
          </span>

          {/* Delete button (visible on hover) */}
          <button
            className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500 ml-2"
            onClick={(e) => {
              e.stopPropagation(); // prevent toggle when clicking delete
              deleteHabit(habit.id);
            }}
            aria-label={`Delete habit ${habit.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default HabitList;





