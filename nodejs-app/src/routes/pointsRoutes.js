import express from "express";
import PointsController from "../controllers/pointsController.js";
import PointsService from "../services/pointsService.js";
import PointsModel from "../models/pointsModel.js";
import UserModel from "../models/userModel.js";

const setPointsRoutes = (app) => {
  const router = express.Router();
  const pointsService = new PointsService(PointsModel, UserModel);
  const pointsController = new PointsController(pointsService);

  router.post("/points", pointsController.addPoints.bind(pointsController));
  router.get("/points", pointsController.getPoints.bind(pointsController));
  router.delete(
    "/points/expire",
    pointsController.expirePoints.bind(pointsController)
  );

  app.use("/api", router);
};

export default setPointsRoutes;
