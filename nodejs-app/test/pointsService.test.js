import mongoose from "mongoose";
import PointsService from "../src/services/pointsService";
import PointsModel from "../src/models/pointsModel";
import UserModel from "../src/models/userModel";

describe("PointsService", () => {
  let pointsService;
  let session;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test");
    pointsService = new PointsService(PointsModel, UserModel);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    session = await mongoose.startSession();
    session.startTransaction();
  });

  afterEach(async () => {
    await session.abortTransaction();
    session.endSession();
    jest.clearAllMocks();
  });

  describe("addPoints", () => {
    it("should add points to the user", async () => {
      const userId = new mongoose.Types.ObjectId();
      const points = 100;
      const user = new UserModel({ _id: userId, pointsBalance: 0 });
      await user.save();

      const transaction = await pointsService.addPoints(userId, points);

      expect(transaction).toHaveProperty("originalNumberOfPoints", points);
      expect(transaction).toHaveProperty("pointsRemaining", points);

      const updatedUser = await UserModel.findById(userId);
      expect(updatedUser.pointsBalance).toBe(points);
    });

    it("should abort transaction on error", async () => {
      const userId = new mongoose.Types.ObjectId();
      const points = 100;

      PointsModel.mockImplementation(() => {
        throw new Error("Test error");
      });

      await expect(pointsService.addPoints(userId, points)).rejects.toThrow(
        "Test error"
      );

      const user = await UserModel.findById(userId);
      expect(user).toBeNull();
    });
  });

  // Add more tests for other methods...
});
