import { describe, expect, it } from "vitest";
import { calcInvoice } from "../src/services/invoice.service";

const baseInput = {
  courseType: "MONTHLY",
  basePrice: 1_500_000,
  months: 2,
  promoCode: "SAVE10",
  canceledClasses: 1,
  refundPerClass: 40_000
};

describe("calcInvoice", () => {
  it("calculates the sample monthly invoice", () => {
    expect(calcInvoice(baseInput)).toEqual({
      subtotal: 3_000_000,
      discount: 300_000,
      refund: 40_000,
      total: 2_660_000
    });
  });

  it("accepts a full course without months", () => {
    expect(calcInvoice({
      ...baseInput,
      courseType: "FULL_COURSE",
      months: undefined,
      promoCode: null,
      canceledClasses: 0
    })).toEqual({ subtotal: 1_500_000, discount: 0, refund: 0, total: 1_500_000 });
  });

  it("floors the SAVE10 discount", () => {
    expect(calcInvoice({ ...baseInput, basePrice: 101, months: 1, canceledClasses: 0 }).discount).toBe(10);
  });

  it("clamps FLAT50K discount to subtotal", () => {
    expect(calcInvoice({
      ...baseInput,
      basePrice: 30_000,
      months: 1,
      promoCode: "FLAT50K",
      canceledClasses: 0
    })).toEqual({ subtotal: 30_000, discount: 30_000, refund: 0, total: 0 });
  });

  it("clamps total at zero when refund exceeds payable amount", () => {
    expect(calcInvoice({
      ...baseInput,
      basePrice: 100,
      months: 1,
      promoCode: null,
      canceledClasses: 2,
      refundPerClass: 100
    })).toEqual({ subtotal: 100, discount: 0, refund: 200, total: 0 });
  });

  it("rejects missing and out-of-range months for MONTHLY", () => {
    expect(() => calcInvoice({ ...baseInput, months: undefined })).toThrow();
    expect(() => calcInvoice({ ...baseInput, months: 0 })).toThrow();
    expect(() => calcInvoice({ ...baseInput, months: 4 })).toThrow();
  });

  it("rejects negative prices, refunds, and canceled counts", () => {
    expect(() => calcInvoice({ ...baseInput, basePrice: -1 })).toThrow();
    expect(() => calcInvoice({ ...baseInput, refundPerClass: -1 })).toThrow();
    expect(() => calcInvoice({ ...baseInput, canceledClasses: -1 })).toThrow();
  });

  it("rejects an unknown promo code", () => {
    expect(() => calcInvoice({ ...baseInput, promoCode: "HALF" })).toThrow();
  });

  it("rejects a fractional canceled class count", () => {
    expect(() => calcInvoice({ ...baseInput, canceledClasses: 1.5 })).toThrow();
  });
});
