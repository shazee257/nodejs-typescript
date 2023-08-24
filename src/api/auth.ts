import { Router } from "express";
import { registerUser } from "../controller/user";

export default class AuthAPI {
  router: Router;
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    let router = this.router;

    router.post("/register", registerUser);
    // router.post("/login", login);
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/auth";
  }
}
