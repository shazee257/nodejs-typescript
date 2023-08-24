import { Request, Response, NextFunction, Application, Router } from "express";
import AuthAPI from "./auth";
import UserAPI from "./user";

export default class API {
  app: Application;
  router: Router;
  routeGroups: any[];

  constructor(app: Application) {
    this.app = app;
    this.router = Router();
    this.routeGroups = [];
  }

  loadRouteGroups() {
    this.routeGroups.push(new AuthAPI());
    this.routeGroups.push(new UserAPI());
  }

  setContentType(req: Request, res: Response, next: NextFunction) {
    res.set("Content-Type", "application/json");
    next();
  }

  registerGroups() {
    this.loadRouteGroups();
    this.routeGroups.forEach((rg) => {
      console.log("Route group: " + rg.getRouterGroup());
      this.app.use(
        "/api" + rg.getRouterGroup(),
        this.setContentType,
        rg.getRouter()
      );
    });
  }
}
