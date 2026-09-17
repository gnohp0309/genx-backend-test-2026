import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("REST API", () => {
  it("reports a healthy process for deployment checks", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns a generated schedule", async () => {
    const response = await request(app).post("/schedule/generate").send({
      startDate: "2026-01-01",
      totalClasses: 2,
      classWeekdays: [3],
      holidays: [],
      holidayRanges: []
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      endDate: "2026-01-08",
      fullSchedule: ["2026-01-01", "2026-01-08"]
    });
  });

  it("returns the invoice calculation", async () => {
    const response = await request(app).post("/invoice/calc").send({
      courseType: "MONTHLY",
      basePrice: 1_500_000,
      months: 2,
      promoCode: "SAVE10",
      canceledClasses: 1,
      refundPerClass: 40_000
    });
    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2_660_000);
  });

  it("returns the required 400 error shape", async () => {
    const response = await request(app).post("/invoice/calc").send({
      courseType: "MONTHLY",
      basePrice: 100,
      months: 4,
      promoCode: null,
      canceledClasses: 0,
      refundPerClass: 0
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      details: [{ field: "months", reason: "must be between 1 and 3 for MONTHLY" }]
    });
  });

  it("rejects malformed JSON using the same 400 format", async () => {
    const response = await request(app)
      .post("/schedule/generate")
      .set("Content-Type", "application/json")
      .send("{");
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details[0].field).toBe("body");
  });
});
