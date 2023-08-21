"use strict";

import moment from "moment";
import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  console.log(
    "\n\n<<<< Date & Time >>>>",
    moment().utcOffset("+0500").format("DD-MMM-YYYY hh:mm:ss a")
  );
  console.log("req.originalUrl: ", req.originalUrl);
  console.log("req.body: ", JSON.stringify(req.body));
  next();
};
