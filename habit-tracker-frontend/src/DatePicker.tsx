import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, isToday } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date;
  // eslint-disable-next-line no-unused-vars
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const formatted = isToday(selectedDate)
    ? `Today (${format(selectedDate, 'EEE')})`
    : format(selectedDate, 'EEEE (MMM d)');

  return (
    <div className="w-full flex justify-start">
      <div className="relative">
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat="MMMM d, yyyy"
          showPopperArrow={false}
          calendarClassName="!bg-gray-900/80 !backdrop-blur-md !text-white !shadow-lg border border-gray-700"
          popperClassName="z-50"
          dayClassName={(date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isOutsideMonth = date.getMonth() !== selectedDate.getMonth();
            const isTodayDate = date.toDateString() === new Date().toDateString();

            return [
              'rounded-full transition-colors text-sm',
              isSelected
                ? '!bg-blue-600 !text-white !border-none !outline-none'
                : isTodayDate
                  ? 'bg-gray-700 text-white hover:bg-blue-600'
                  : 'text-white hover:bg-gray-700',
              isOutsideMonth ? 'text-gray-500' : ''
            ].join(' ');
          }}
          customInput={
            <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 text-sm cursor-pointer">
              <Calendar className="w-4 h-4 text-gray-300" />
              <span>{formatted}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DatePicker;











