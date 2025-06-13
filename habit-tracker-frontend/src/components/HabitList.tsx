import type { Habit } from '../types';

// Props interface for HabitList component
interface HabitListProps {
  habits: Habit[];
  // eslint-disable-next-line no-unused-vars
  toggleHabit: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  deleteHabit: (id: number) => void; // add delete prop
}

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
          className={`flex items-center p-3 rounded-xl border border-gray-700 cursor-pointer transition-colors duration-200 ${
            habit.completed
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {/* Delete button */}
          <button
            className="text-white text-lg font-bold mr-3 select-none hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation(); // prevent toggle when clicking delete
              deleteHabit(habit.id);
            }}
            aria-label={`Delete habit ${habit.name}`}
          >
            &times;
          </button>

          {/* Habit name */}
          <span className="flex-1 text-base font-medium">{habit.name}</span>

          {/* Status */}
          <span className="text-sm opacity-80">
            {habit.completed ? 'Done' : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HabitList;


