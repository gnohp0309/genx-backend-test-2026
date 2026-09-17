import { invoiceSchema } from "../validators/invoice.schema";

export interface InvoiceResult {
  subtotal: number;
  discount: number;
  refund: number;
  total: number;
}

export function calcInvoice(rawInput: unknown): InvoiceResult {
  const input = invoiceSchema.parse(rawInput);
  const subtotal = input.courseType === "MONTHLY"
    ? input.basePrice * input.months!
    : input.basePrice;

  let discount = 0;
  if (input.promoCode === "SAVE10") discount = Math.floor(subtotal * 0.1);
  if (input.promoCode === "FLAT50K") discount = 50_000;
  discount = Math.min(discount, subtotal);

  const refund = input.canceledClasses * input.refundPerClass;
  const total = Math.max(0, subtotal - discount - refund);

  return { subtotal, discount, refund, total };
}
