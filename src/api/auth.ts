import { Router } from "express";
import { loginUser, registerUser } from "../controller/user";

export default class AuthAPI {
  router: Router;
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    let router = this.router;

    router.post("/register", registerUser);
    router.post("/login", loginUser);
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/auth";
  }
}
