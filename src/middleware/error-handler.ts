import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: error.issues.map((issue) => ({
          field: issue.path.length ? issue.path.join(".") : "body",
          reason: issue.message
        }))
      }
    });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: [{ field: "body", reason: "must be valid JSON" }]
      }
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error"
    }
  });
};
