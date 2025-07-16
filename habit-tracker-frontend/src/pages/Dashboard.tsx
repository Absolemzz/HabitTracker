import { useState, useEffect } from 'react';
import axios from 'axios';

interface HabitSummary {
  completedDays: number[];
  partialDays: number[];
  totalCompleted: number;
  bestStreak: number;
  currentStreak: number;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const Dashboard = () => {
  const today = new Date();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [habitData, setHabitData] = useState<HabitSummary | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const monthName = new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' });

  const completedDays = habitData?.completedDays ?? [];
  const partialDays = habitData?.partialDays ?? [];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/monthly-summary', {
          params: { year: currentYear, month: currentMonthIndex },
        });
        setHabitData(res.data);
      } catch (error) {
        console.warn('No data for this month:', error);
        setHabitData(null);
      }
    };

    fetchSummary();
  }, [currentMonthIndex, currentYear]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between text-purple-400">
          <button onClick={handlePrevMonth} className="hover:text-purple-300">&larr; Prev</button>
          <div className="text-2xl font-semibold">{monthName} {currentYear}</div>
          <button onClick={handleNextMonth} className="hover:text-purple-300">Next &rarr;</button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-gray-400 font-semibold">{d}</div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected = selectedDay === day;
            const isToday =
              day === today.getDate() &&
              currentMonthIndex === today.getMonth() &&
              currentYear === today.getFullYear();

            const isCompleted = completedDays.includes(day);
            const isPartial = partialDays.includes(day);

            let bgColor = 'bg-gray-800';
            if (isCompleted) bgColor = 'bg-purple-700';
            else if (isPartial) bgColor = 'bg-purple-500/60';

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-10 rounded-md flex items-center justify-center text-white transition-colors relative
                  ${bgColor}
                  ${isSelected ? 'ring-2 ring-purple-500' : ''}
                  ${isToday ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Stats Summary */}
        {habitData && (
          <div className="space-y-2">
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between">
              <span>Habits Completed This Month</span>
              <span>{habitData.totalCompleted} / {daysInMonth}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between">
              <span>Best Streak</span>
              <span>{habitData.bestStreak} Days</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between">
              <span>Current Streak</span>
              <span>{habitData.currentStreak} Day{habitData.currentStreak !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;




