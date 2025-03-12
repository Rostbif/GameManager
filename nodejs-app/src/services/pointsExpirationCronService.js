import cron from "node-cron";
import PointsService from "./pointsService.js";
import PointsModel from "../models/pointsModel.js";
import UserModel from "../models/userModel.js";

class PointsExpirationCronService {
  constructor() {
    // Initialize PointsService with PointsModel and UserModel
    this.pointsService = new PointsService(PointsModel, UserModel);
  }

  start() {
    // Schedule the job to run every 24 hours with expiration time of 6 weeks
    let schedule = "0 0 * * *";
    // Testing: Schedule the job to run every 1 minute
    //schedule = "*/1 * * * *";

    // Schedule the cron job
    cron.schedule(schedule, async () => {
      console.log("Running points expiration job...");
      try {
        // Calculate expiration time (6 weeks ago)
        let expirationTime = new Date(Date.now() - 6 * 7 * 24 * 60 * 60 * 1000);
        // for Testing: (1 minute expiration date)
        //expirationTime = new Date(Date.now() - 5 * 60 * 1000); // 1 minute ago for testing

        // Expire points using PointsService
        await this.pointsService.expirePoints(expirationTime);
        console.log("Points expiration job completed.");
      } catch (error) {
        // Log any errors that occur during the job
        console.error("Error running points expiration job:", error);
      }
    });
  }
}

export default PointsExpirationCronService;
