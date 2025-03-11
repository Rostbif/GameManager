import mongoose from "mongoose";
import PurchasesService from "../src/services/purchasesService";
import PurchasesModel from "../src/models/purchasesModel";
import PointsModel from "../src/models/pointsModel";
import UserModel from "../src/models/userModel";
import ProductPurchase from "../src/models/purchasesModel";
import { jest } from "@jest/globals";

// jest.mock("mongoose", () => {
//   const actualMongoose = jest.requireActual("mongoose");
//   return {
//     ...actualMongoose,
//     startSession: jest.fn().mockResolvedValue({
//       startTransaction: jest.fn(),
//       commitTransaction: jest.fn(),
//       abortTransaction: jest.fn(),
//       endSession: jest.fn(),
//     }),
//   };
// });

describe("PurchasesService", () => {
  let purchasesService;
  // let session;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test?&replicaSet=rs0");
    //?&replicaSet=rs0
    purchasesService = new PurchasesService(
      PurchasesModel,
      PointsModel,
      UserModel
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  // beforeEach(async () => {
  //   session = await mongoose.startSession();
  //   session.startTransaction();
  // });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await PointsModel.deleteMany({});
    await PurchasesModel.deleteMany({});
    // await session.abortTransaction();
    // session.endSession();
    //jest.clearAllMocks();
  });

  describe("buyItem", () => {
    it("should buy an item and update user points", async () => {
      // mongoose.startSession.mockResolvedValue({
      //   startTransaction: jest.fn(),
      //   commitTransaction: jest.fn(),
      //   abortTransaction: jest.fn(),
      //   endSession: jest.fn(),
      // });

      const userId = new mongoose.Types.ObjectId();
      const price = 50;
      const user = new UserModel({
        _id: userId,
        name: "John lerg",
        pointsBalance: 100,
      });
      await user.save();

      const transaction = new PointsModel({
        userId,
        originalNumberOfPoints: 100,
        pointsRemaining: 100,
      });
      await transaction.save();

      const purchase = await purchasesService.buyItem(userId, price);

      expect(purchase).toHaveProperty("price", price);

      const updatedUser = await UserModel.findById(userId);
      expect(updatedUser.pointsBalance).toBe(50);

      const updatedTransaction = await PointsModel.findById(transaction._id);
      expect(updatedTransaction.pointsRemaining).toBe(50);
    });

    it("should abort transaction on error", async () => {
      const userId = new mongoose.Types.ObjectId();
      const price = 50;

      UserModel.findById = jest.fn().mockImplementation(() => {
        throw new Error("Test error");
      });

      await expect(purchasesService.buyItem(userId, price)).rejects.toThrow(
        "Test error"
      );

      const user = await UserModel.findById(userId);
      expect(user).toBeNull();
    });
  });

  describe("getPurchases", () => {
    it("should get all purchases for a specific user", async () => {
      const userId = new mongoose.Types.ObjectId();
      const purchase1 = new PurchasesModel({
        userId,
        price: 50,
        timestamp: new Date(),
      });
      const purchase2 = new PurchasesModel({
        userId,
        price: 100,
        timestamp: new Date(),
      });
      await purchase1.save();
      await purchase2.save();

      const purchases = await purchasesService.getPurchases(userId);
      expect(purchases.length).toBe(2);
      expect(purchases[0].userId.toString()).toBe(userId.toString());
      expect(purchases[1].userId.toString()).toBe(userId.toString());
    });

    it("should get all purchases when no user ID is provided", async () => {
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();
      const purchase1 = new PurchasesModel({
        userId: userId1,
        price: 50,
        timestamp: new Date(),
      });
      const purchase2 = new PurchasesModel({
        userId: userId2,
        price: 100,
        timestamp: new Date(),
      });
      await purchase1.save();
      await purchase2.save();

      const purchases = await purchasesService.getPurchases();
      expect(purchases.length).toBe(2);
    });
  });
});
