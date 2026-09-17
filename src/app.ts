import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { invoiceRouter } from "./routes/invoice.routes";
import { scheduleRouter } from "./routes/schedule.routes";

export const app = express();

app.use(express.json());
app.get("/health", (_request, response) => response.status(200).json({ status: "ok" }));
app.use("/schedule", scheduleRouter);
app.use("/invoice", invoiceRouter);
app.use(errorHandler);
