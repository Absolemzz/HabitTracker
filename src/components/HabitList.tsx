import type { Habit } from '../types';

// Props interface for HabitList component
interface HabitListProps {
  habits: Habit[];
  // eslint-disable-next-line no-unused-vars
  toggleHabit: (id: number) => void;
}

// Component to render a list of habits
function HabitList({ habits, toggleHabit }: HabitListProps) {
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
          <span className="flex-1 text-base font-medium">{habit.name}</span>
          <span className="text-sm opacity-80">
            {habit.completed ? 'Done' : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HabitList;
