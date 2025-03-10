import cron from "node-cron";
import PointsService from "./pointsService.js";
import PointsModel from "../models/pointsModel.js";
import UserModel from "../models/userModel.js";

class PointsExpirationCronService {
  constructor() {
    this.pointsService = new PointsService(PointsModel, UserModel);
  }

  start() {
    // Schedule the job to run every 24 hours
    cron.schedule("0 0 * * *", async () => {
      console.log("Running points expiration job...");
      await this.pointsService.expirePoints();
      console.log("Points expiration job completed.");
    });
  }
}

export default PointsExpirationCronService;
