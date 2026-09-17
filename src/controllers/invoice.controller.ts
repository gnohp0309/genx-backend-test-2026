import type { RequestHandler } from "express";
import { calcInvoice } from "../services/invoice.service";

export const calcInvoiceController: RequestHandler = (request, response, next) => {
  try {
    response.status(200).json(calcInvoice(request.body));
  } catch (error) {
    next(error);
  }
};
