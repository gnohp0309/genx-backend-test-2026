import type { RequestHandler } from "express";
import { generateSchedule } from "../services/schedule.service";

export const generateScheduleController: RequestHandler = (request, response, next) => {
  try {
    response.status(200).json(generateSchedule(request.body));
  } catch (error) {
    next(error);
  }
};
