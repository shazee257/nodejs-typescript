import { Router } from "express";
import { getUser } from "../controller/user";

export default class UserAPI {
  router: Router;
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    let router = this.router;

    router.get("/", getUser);
    // router.post("/login", login);
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/user";
  }
}
