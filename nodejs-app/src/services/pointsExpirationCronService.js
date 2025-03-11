import cron from "node-cron";
import PointsService from "./pointsService.js";
import PointsModel from "../models/pointsModel.js";
import UserModel from "../models/userModel.js";

class PointsExpirationCronService {
  constructor() {
    this.pointsService = new PointsService(PointsModel, UserModel);
  }

  start() {
    // Schedule the job to run every 24 hours with expiration time of 6 weeks
    let schedule = "0 0 * * *";
    // Testing: Schedule the job to run every 1 minute
    // schedule = "*/1 * * * *";

    cron.schedule(schedule, async () => {
      console.log("Running points expiration job...");
      try {
        let expirationTime = new Date(Date.now() - 6 * 7 * 24 * 60 * 60 * 1000);
        // for Testing: (1 minute expiration date)
        //expirationTime = new Date(Date.now() - 5 * 60 * 1000); // 1 minute ago for testing

        await this.pointsService.expirePoints(expirationTime);
        console.log("Points expiration job completed.");
      } catch (error) {
        console.error("Error running points expiration job:", error);
      }
    });
  }
}

export default PointsExpirationCronService;
