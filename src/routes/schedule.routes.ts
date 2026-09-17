import { Router } from "express";
import { generateScheduleController } from "../controllers/schedule.controller";

export const scheduleRouter = Router();
scheduleRouter.post("/generate", generateScheduleController);
