import mongoose from "mongoose";
import User from "../src/models/userModel";
import PointsTransaction from "../src/models/pointsModel";
import ProductPurchase from "../src/models/purchasesModel";
import UserService from "../src/services/userService";
import redisClient from "../src/utils/redisClient";

describe("UserService", () => {
  let userService;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test");
    userService = new UserService(User);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await redisClient.quit(); // Close the Redis connection
  });

  afterEach(async () => {
    await User.deleteMany({});
    await redisClient.flushAll(); // Clear the Redis cache
  });

  it("should create a new user", async () => {
    const userData = {
      name: "John Doe",
    };
    const user = await userService.createUser(userData);
    expect(user).toHaveProperty("name", "John Doe");
  });

  it("should get a user by ID", async () => {
    const user = new User({
      name: "Jane Doe",
    });
    await user.save();

    const foundUser = await userService.getUser(user._id);
    expect(foundUser).toHaveProperty("name", "Jane Doe");
  });

  it("should get all users", async () => {
    const user1 = new User({
      name: "John Doe",
    });
    const user2 = new User({
      name: "Jane Doe",
    });
    await user1.save();
    await user2.save();

    const users = await userService.getUsers();
    expect(users.length).toBe(2);
  });

  it("should update user points balance", async () => {
    const user = new User({
      name: "John Doe",
      pointsBalance: 0,
    });
    await user.save();

    const updatedUser = await userService.updateUserPointsBalance(user._id, 10);
    expect(updatedUser).toHaveProperty("pointsBalance", 10);
  });

  it("should add points transaction to user", async () => {
    const user = new User({
      name: "John Doe",
    });
    await user.save();

    const transactionId = new mongoose.Types.ObjectId();
    const updatedUser = await userService.addPointsTransaction(
      user._id,
      transactionId
    );
    expect(updatedUser.pointsTransactions).toContainEqual(transactionId);
  });

  it("should add product purchase to user", async () => {
    const user = new User({
      name: "John Doe",
    });
    await user.save();

    const purchaseId = new mongoose.Types.ObjectId();
    const updatedUser = await userService.addProductPurchase(
      user._id,
      purchaseId
    );
    expect(updatedUser.productPurchases).toContainEqual(purchaseId);
  });
});
