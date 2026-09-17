import { z } from "zod";

export const invoiceSchema = z.object({
  courseType: z.enum(["MONTHLY", "FULL_COURSE"]),
  basePrice: z.number().finite().nonnegative(),
  months: z.number().int().optional(),
  promoCode: z.enum(["SAVE10", "FLAT50K"]).nullable(),
  canceledClasses: z.number().int().nonnegative(),
  refundPerClass: z.number().finite().nonnegative()
}).strict().superRefine((input, context) => {
  if (input.courseType === "MONTHLY" &&
      (input.months === undefined || input.months < 1 || input.months > 3)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["months"],
      message: "must be between 1 and 3 for MONTHLY"
    });
  }

  const subtotal = input.basePrice * (input.courseType === "MONTHLY" ? (input.months ?? 1) : 1);
  if (!Number.isFinite(subtotal)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["basePrice"],
      message: "subtotal exceeds numeric range"
    });
  }
  if (!Number.isFinite(input.canceledClasses * input.refundPerClass)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["refundPerClass"],
      message: "refund exceeds numeric range"
    });
  }
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
