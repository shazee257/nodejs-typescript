import { verify } from "jsonwebtoken";
import { STATUS_CODES } from "../utils/constant";
import { NextFunction, Request, Response } from "express";

function AuthMiddleware(req: any, res: Response, next: NextFunction) {
  const accessToken = req.header("accessToken") || req.session?.accessToken;
  if (!accessToken)
    return next({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Authorization failed!",
    });

  verify(
    accessToken,
    process.env.JWT_SECRET as string,
    function (err: any, decoded: any) {
      if (err) {
        return next({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Invalid token!",
        });
      }
      req.user = { ...decoded };
      next();
    }
  );
}

export default AuthMiddleware;
