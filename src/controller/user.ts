import { Request, Response, NextFunction } from "express";

export const registerUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  res.json(body);
};
