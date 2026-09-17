import { formatDate, mondayBasedWeekday, nextUtcDate, parseDate } from "../utils/date";
import { scheduleSchema } from "../validators/schedule.schema";

export interface ScheduleResult {
  endDate: string;
  fullSchedule: string[];
}

export function generateSchedule(rawInput: unknown): ScheduleResult {
  const input = scheduleSchema.parse(rawInput);
  const weekdays = new Set([...input.classWeekdays].sort((a, b) => a - b));
  const holidays = new Set(input.holidays);
  const ranges = input.holidayRanges.map(([start, end]) => ({ start, end }));
  const fullSchedule: string[] = [];
  let current = parseDate(input.startDate)!;

  while (fullSchedule.length < input.totalClasses) {
    const day = formatDate(current);
    const isHoliday = holidays.has(day) || ranges.some(({ start, end }) => start <= day && day <= end);

    if (weekdays.has(mondayBasedWeekday(current)) && !isHoliday) {
      fullSchedule.push(day);
    }

    if (fullSchedule.length < input.totalClasses) {
      current = nextUtcDate(current);
    }
  }

  return {
    endDate: fullSchedule[fullSchedule.length - 1],
    fullSchedule
  };
}
