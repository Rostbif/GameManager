import express from "express";
import PurchasesController from "../controllers/purchasesController.js";
import PurchasesService from "../services/purchasesService.js";
import PurchasesModel from "../models/purchasesModel.js";
import PointsModel from "../models/pointsModel.js";
import UserModel from "../models/userModel.js";

const setPurchasesRoutes = (app) => {
  const router = express.Router();
  const purchasesService = new PurchasesService(
    PurchasesModel,
    PointsModel,
    UserModel
  );
  const purchasesController = new PurchasesController(purchasesService);

  router.post(
    "/purchase",
    purchasesController.buyItem.bind(purchasesController)
  );
  router.get(
    "/purchases",
    purchasesController.getPurchases.bind(purchasesController)
  );
  router.get(
    "/purchases/:userId",
    purchasesController.getPurchasesOfUser.bind(purchasesController)
  );

  app.use("/api", router);
};

export default setPurchasesRoutes;
