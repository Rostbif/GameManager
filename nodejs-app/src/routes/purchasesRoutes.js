import express from "express";
import PurchasesController from "../controllers/purchasesController.js";
import PurchasesService from "../services/purchasesService.js";
import PurchasesModel from "../models/purchasesModel.js";
import PointsModel from "../models/pointsModel.js";

const setPurchasesRoutes = (app) => {
  const router = express.Router();
  const purchasesService = new PurchasesService(PurchasesModel, PointsModel);
  const purchasesController = new PurchasesController(purchasesService);

  router.post(
    "/purchase",
    purchasesController.buyItem.bind(purchasesController)
  );
  router.get(
    "/purchases/:userId",
    purchasesController.getPurchases.bind(purchasesController)
  );

  app.use("/api", router);
};

export default setPurchasesRoutes;

// const express = require('express');
// const PurchasesController = require('../controllers/purchasesController');

// const setPurchasesRoutes = (app) => {
//     const purchasesController = new PurchasesController();

//     app.post('/purchase', purchasesController.buyItem.bind(purchasesController));
//     app.get('/purchases', purchasesController.getPurchases.bind(purchasesController));
// };

// module.exports = setPurchasesRoutes;
