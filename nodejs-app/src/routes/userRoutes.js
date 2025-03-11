import express from "express";
import UserController from "../controllers/userController.js";
import UserService from "../services/userService.js";
import UserModel from "../models/userModel.js";

const setUserRoutes = (app) => {
  const router = express.Router();
  const userService = new UserService(UserModel);
  const userController = new UserController(userService);

  router.post("/users", userController.createUser.bind(userController));
  router.get("/users", userController.getUsers.bind(userController));
  router.get("/users/:id", userController.getUser.bind(userController));

  app.use("/api", router);
};

export default setUserRoutes;
