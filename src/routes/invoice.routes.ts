import { Router } from "express";
import { calcInvoiceController } from "../controllers/invoice.controller";

export const invoiceRouter = Router();
invoiceRouter.post("/calc", calcInvoiceController);
