import { z } from "zod";
import { parseDate } from "../utils/date";

const dateString = z.string().refine((value) => parseDate(value) !== null, {
  message: "must be a valid date in YYYY-MM-DD format"
});

const holidayRange = z.tuple([dateString, dateString]).refine(
  ([start, end]) => start <= end,
  { message: "start must be on or before end" }
);

export const scheduleSchema = z.object({
  startDate: dateString,
  totalClasses: z.number().int().positive(),
  classWeekdays: z.array(z.number().int().min(0).max(6)).min(1),
  holidays: z.array(dateString),
  holidayRanges: z.array(holidayRange)
}).strict();

export type ScheduleInput = z.infer<typeof scheduleSchema>;
