import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import dbConnect from "./config/dbConnect";
import cookieSession from "cookie-session";
import Log from "./middlewares/log";
import ErrorHandling from "./middlewares/errorHandling";
import API from "../src/api/index";

const PORT: number = Number(process.env.PORT);
const HOST: string = process.env.HOST || "localhost";

const app: Application = express();
dbConnect();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use("/uploads", express.static("uploads"));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })
);

app.use(Log);

new API(app).registerGroups();

app.use(ErrorHandling.notFound);
app.use(ErrorHandling.errorHandler);

server.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}/`)
);
