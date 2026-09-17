import { describe, expect, it } from "vitest";
import { generateSchedule } from "../src/services/schedule.service";

const baseInput = {
  startDate: "2026-01-01",
  totalClasses: 3,
  classWeekdays: [1, 3],
  holidays: [] as string[],
  holidayRanges: [] as [string, string][]
};

describe("generateSchedule", () => {
  it("includes startDate when it is a class weekday", () => {
    expect(generateSchedule(baseInput)).toEqual({
      endDate: "2026-01-08",
      fullSchedule: ["2026-01-01", "2026-01-06", "2026-01-08"]
    });
  });

  it("starts on the next matching weekday when startDate does not match", () => {
    expect(generateSchedule({ ...baseInput, totalClasses: 1, classWeekdays: [0] })).toEqual({
      endDate: "2026-01-05",
      fullSchedule: ["2026-01-05"]
    });
  });

  it("normalizes unsorted and duplicate weekdays", () => {
    expect(generateSchedule({ ...baseInput, classWeekdays: [3, 1, 3, 1] }).fullSchedule).toEqual([
      "2026-01-01", "2026-01-06", "2026-01-08"
    ]);
  });

  it("skips standalone holidays", () => {
    expect(generateSchedule({ ...baseInput, holidays: ["2026-01-01"] }).fullSchedule).toEqual([
      "2026-01-06", "2026-01-08", "2026-01-13"
    ]);
  });

  it("treats both endpoints of a holiday range as days off", () => {
    expect(generateSchedule({
      ...baseInput,
      startDate: "2026-01-05",
      totalClasses: 1,
      classWeekdays: [0],
      holidayRanges: [["2026-01-05", "2026-01-12"]]
    }).endDate).toBe("2026-01-19");
  });

  it("handles a standalone holiday overlapping a range", () => {
    expect(generateSchedule({
      ...baseInput,
      totalClasses: 1,
      holidays: ["2026-01-01"],
      holidayRanges: [["2026-01-01", "2026-01-05"]]
    }).endDate).toBe("2026-01-06");
  });

  it("rejects malformed and impossible dates", () => {
    expect(() => generateSchedule({ ...baseInput, startDate: "2026-02-30" })).toThrow();
    expect(() => generateSchedule({ ...baseInput, holidays: ["01/01/2026"] })).toThrow();
  });

  it("rejects an empty weekday list and nonpositive class count", () => {
    expect(() => generateSchedule({ ...baseInput, classWeekdays: [] })).toThrow();
    expect(() => generateSchedule({ ...baseInput, totalClasses: 0 })).toThrow();
  });

  it("rejects reversed holiday ranges", () => {
    expect(() => generateSchedule({
      ...baseInput,
      holidayRanges: [["2026-02-05", "2026-01-26"]]
    })).toThrow();
  });

  it("generates all 16 sessions around a long break", () => {
    const result = generateSchedule({
      ...baseInput,
      totalClasses: 16,
      holidayRanges: [["2026-01-26", "2026-02-05"]]
    });
    expect(result.fullSchedule).toHaveLength(16);
    expect(result.endDate).toBe("2026-03-10");
    expect(result.fullSchedule).not.toContain("2026-02-03");
    expect(result.fullSchedule).not.toContain("2026-02-05");
  });
});
