import { Router } from "express";
import { fetchAllUsers, getUser } from "../controller/user";
import AuthMiddleware from "../middlewares/Auth";

export default class UserAPI {
  router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    let router = this.router;

    router.get("/", AuthMiddleware, getUser);
    router.get("/search", AuthMiddleware, fetchAllUsers);
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/user";
  }
}
