import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { slideUp } from "@/lib/animations";
import type { Event } from "@shared/schema";

export default function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-8"
      {...slideUp}
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[hsl(201,96%,72%)] flex items-center">
          <CalendarIcon className="mr-3" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-[hsl(201,96%,72%)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-10"></div>;
          }

          const dayEvents = getEventsForDay(day);
          const isToday = isCurrentMonth && day === today.getDate();
          const hasEvents = dayEvents.length > 0;

          return (
            <motion.button
              key={`day-${day}-${currentDate.getMonth()}-${currentDate.getFullYear()}`}
              className={`
                calendar-day h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 relative
                ${isToday ? 'bg-[hsl(201,96%,72%)] text-black' : 'hover:bg-[var(--glass-border)]'}
                ${hasEvents && !isToday ? 'bg-[hsl(206,73%,73%)] text-black' : ''}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
              {hasEvents && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(201,96%,72%)] rounded-full"></div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[hsl(201,96%,72%)] rounded-full"></div>
          <span className="text-sm text-gray-300">Today's Events</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[hsl(206,73%,73%)] rounded-full"></div>
          <span className="text-sm text-gray-300">Scheduled Events</span>
        </div>
      </div>
    </motion.div>
  );
}
