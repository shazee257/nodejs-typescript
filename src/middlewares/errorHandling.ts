import { Schema, model } from "mongoose";
import { Request, Response, NextFunction } from "express";

const logSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  body: { type: String },
  statusCode: { type: Number },
  endPoint: { type: String },
  message: String,
  stack: String,
});

const LogModel = model("Log", logSchema);

class ErrorHandling {
  static notFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  }

  static async errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(err.statusCode);
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    const error = new Error(err?.message || "Internal Server Error");

    const log = new LogModel({
      body: JSON.stringify(req.body),
      statusCode,
      endPoint: req?.originalUrl,
      message: error?.message,
      stack: error?.stack,
    });

    // save the log document
    try {
      await log.save();
    } catch (error) {
      console.log("Error saving log: ", error);
    }

    return res.status(statusCode).json({
      message: error?.message,
      stack: error?.stack,
    });
  }
}

export default ErrorHandling;
