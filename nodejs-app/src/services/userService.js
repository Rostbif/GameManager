class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // Create a new user with the provided user data
  async createUser(userData) {
    const user = new this.userModel(userData);
    return await user.save();
  }

  // Retrieve a user by their ID, including their points transactions and product purchases
  async getUser(userId) {
    return await this.userModel
      .findById(userId)
      .populate("pointsTransactions")
      .populate("productPurchases");
  }

  // Retrieve all users
  async getUsers() {
    let users = await this.userModel.find(); // query all users
    return users;
  }

  // Update the points balance of a user by their ID
  async updateUserPointsBalance(userId, points) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsBalance += points;
    return await user.save();
  }

  // Add a points transaction to a user's record by their ID
  async addPointsTransaction(userId, transactionId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsTransactions.push(transactionId);
    return await user.save();
  }

  // Add a product purchase to a user's record by their ID
  async addProductPurchase(userId, purchaseId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.productPurchases.push(purchaseId);
    return await user.save();
  }
}

export default UserService;
