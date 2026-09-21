import React, { useState } from 'react';
import { Calendar, Flame } from 'lucide-react';

interface DayActivity {
  count: number;
  submissions: number;
  level: number;
}

interface ActivityHeatmapProps {
  days: Record<string, DayActivity>;
  totalSolved: number;
  totalSubmissions: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  days,
  totalSolved,
  totalSubmissions,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // Generate 52 weeks (364 days) leading up to today
  const generateCalendarGrid = () => {
    const grid: Array<Array<{ dateStr: string; activity?: DayActivity }>> = [];
    const today = new Date();
    // Normalize to end of today
    today.setHours(23, 59, 59, 999);

    const totalDays = 52 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    // Adjust start date to previous Sunday or Monday so weeks align
    const dayOfWeek = startDate.getDay(); // 0 is Sunday
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);

    for (let w = 0; w < 53; w++) {
      const week: Array<{ dateStr: string; activity?: DayActivity }> = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        week.push({
          dateStr,
          activity: days[dateStr],
        });
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate > today) break;
      }
      grid.push(week);
      if (currentDate > today) break;
    }

    return grid;
  };

  const weeks = generateCalendarGrid();

  const getCellColor = (level?: number) => {
    switch (level) {
      case 4:
        return 'bg-[#244D38] ring-1 ring-[#244D38] shadow-sm shadow-[#244D38]/30';
      case 3:
        return 'bg-[#4E8A61]';
      case 2:
        return 'bg-[#82B392]';
      case 1:
        return 'bg-[#B6D7C2] border border-[#A1CCA3]';
      default:
        return 'bg-[#EDE7DC] dark:bg-stone-800 border border-[#E2DAD0] dark:border-stone-700/60 hover:bg-[#DFD7CB] dark:hover:bg-stone-700';
    }
  };

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-[#17211B] dark:text-white tracking-tight">Practice Activity Heatmap</h3>
          <span className="text-[11px] text-[#5F665F] dark:text-stone-400 font-medium hidden sm:inline">
            (Last 12 Months)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#5F665F] dark:text-stone-400">
          <span>
            <strong className="text-[#244D38] dark:text-emerald-400 font-bold">{totalSolved}</strong> problems solved
          </span>
          <span className="text-stone-400">•</span>
          <span>
            <strong className="text-[#17211B] dark:text-slate-200 font-bold">{totalSubmissions}</strong> submissions
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((cell) => {
                const isHovered = hoveredDay?.date === cell.dateStr;
                return (
                  <div
                    key={cell.dateStr}
                    onMouseEnter={() =>
                      setHoveredDay({
                        date: cell.dateStr,
                        count: cell.activity?.count || 0,
                      })
                    }
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3 h-3 rounded-[3px] transition-all cursor-pointer ${getCellColor(
                      cell.activity?.level
                    )} ${isHovered ? 'scale-125 z-10' : ''}`}
                    title={`${cell.dateStr}: ${cell.activity?.count || 0} solved`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Legend */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5DED4] dark:border-stone-800 text-[11px] text-[#5F665F] dark:text-stone-400">
        <div>
          {hoveredDay ? (
            <span className="text-[#17211B] dark:text-slate-300 font-mono">
              <strong className="text-[#244D38] dark:text-emerald-400">{hoveredDay.count}</strong> problems solved on{' '}
              {new Date(hoveredDay.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          ) : (
            <span className="text-stone-400">Hover over any day to see activity details</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#EDE7DC] dark:bg-stone-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#B6D7C2]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#82B392]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#4E8A61]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#244D38]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
