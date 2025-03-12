import redisClient from "../utils/redisClient.js";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // Create a new user with the provided user data
  async createUser(userData) {
    const user = new this.userModel(userData);
    const savedUser = await user.save();
    // const cacheKey = `user:${savedUser._id}`;
    // await redisClient.set(cacheKey, JSON.stringify(savedUser), {
    //   EX: 3600, // Cache for 1 hour
    // });
    // await redisClient.del("users"); // Invalidate cache for all users
    return savedUser;
  }

  // Retrieve a user by their ID, including their points transactions and product purchases
  async getUser(userId) {
    // const cacheKey = `user:${userId}`;
    // const cachedUser = await redisClient.get(cacheKey);
    // if (cachedUser) {
    //   console.log("Request for a user served from the cache");
    //   return JSON.parse(cachedUser);
    // }

    const user = await this.userModel
      .findById(userId)
      .populate("pointsTransactions")
      .populate("productPurchases");

    // if (user) {
    //   await redisClient.set(cacheKey, JSON.stringify(user), {
    //     EX: 3600, // Cache for 1 hour
    //   });
    // }

    return user;
  }

  // Retrieve all users (using cache here so keep in mind that the balance might not be updated...)
  async getUsers() {
    const cacheKey = "users";
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      console.log("Request for a user served from the cache");

      return JSON.parse(cachedUsers);
    }

    let users = await this.userModel.find(); // query all users

    if (users) {
      await redisClient.set(cacheKey, JSON.stringify(users), {
        EX: 3600, // Cache for 1 hour
      });
    }

    return users;
  }

  /// This section is relevant for handling the different actions of the user while considreing the cache
  // I decided not to use that currently, as I want to do all the changes in one mongoose transaction and didn't want to update that here...
  // Update the points balance of a user by their ID
  async updateUserPointsBalance(userId, points) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsBalance += points;
    await redisClient.del(`user:${userId}`); // Invalidate cache
    return await user.save();
  }

  // Add a points transaction to a user's record by their ID
  async addPointsTransaction(userId, transactionId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsTransactions.push(transactionId);
    await redisClient.del(`user:${userId}`); // Invalidate cache
    return await user.save();
  }

  // Add a product purchase to a user's record by their ID
  async addProductPurchase(userId, purchaseId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.productPurchases.push(purchaseId);
    await redisClient.del(`user:${userId}`); // Invalidate cache
    return await user.save();
  }
}

export default UserService;
