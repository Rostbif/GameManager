import mongoose from "mongoose";
import cron from "node-cron";
import PointsExpirationCronService from "../src/services/pointsExpirationCronService";
import PointsService from "../src/services/pointsService";
import PointsModel from "../src/models/pointsModel";
import UserModel from "../src/models/userModel";
// TBD - work on this. currently doesn't work

jest.mock("node-cron");

describe("PointsExpirationCronService", () => {
  let pointsExpirationCronService;
  let pointsService;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test");
    pointsService = new PointsService(PointsModel, UserModel);
    pointsExpirationCronService = new PointsExpirationCronService();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    PointsService.mockImplementation(() => pointsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("start", () => {
    it("should schedule a cron job to expire points", () => {
      pointsExpirationCronService.start();

      expect(cron.schedule).toHaveBeenCalledWith(
        "0 0 * * *",
        expect.any(Function)
      );
    });

    it("should run the points expiration job", async () => {
      const expirePointsMock = jest.fn();
      pointsService.expirePoints = expirePointsMock;

      pointsExpirationCronService.start();
      const scheduledFunction = cron.schedule.mock.calls[0][1];

      await scheduledFunction();

      expect(expirePointsMock).toHaveBeenCalled();
    });

    it("should log an error if the points expiration job fails", async () => {
      const consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation();
      pointsService.expirePoints = jest
        .fn()
        .mockRejectedValue(new Error("Test error"));

      pointsExpirationCronService.start();
      const scheduledFunction = cron.schedule.mock.calls[0][1];

      await scheduledFunction();

      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error running points expiration job:",
        expect.any(Error)
      );

      consoleErrorMock.mockRestore();
    });
  });

  // Add more tests for other methods...
});
