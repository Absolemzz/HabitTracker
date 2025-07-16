/* eslint-disable no-unused-vars */
import type { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  toggleHabit: (id: number) => void;
  deleteHabit: (id: number) => void;
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
    <div className="space-y-2 sm:space-y-3">
      {habits.map((habit) => (
        <div
          key={habit.id}
          onClick={() => toggleHabit(habit.id)}
          className={`group flex items-center px-3 py-2 sm:p-4 rounded-xl border border-gray-700 cursor-pointer transition-colors duration-200 ${
            habit.completed
              ? 'bg-purple-700 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          <span className="font-poppins text-sm sm:text-lg font-medium tracking-tight mr-2 capitalize-first">
            {habit.name}
          </span>

          <span
            className="text-xs sm:text-sm opacity-80 ml-auto"
            title={habit.completed ? 'Completed' : 'Pending'}
          >
            {habit.completed ? 'Done' : '●'}
          </span>

          <button
            className="text-white text-base sm:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500 ml-2"
            onClick={(e) => {
              e.stopPropagation();
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







