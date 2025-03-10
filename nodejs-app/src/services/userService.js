class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async createUser(userData) {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async getUser(userId) {
    return await this.userModel
      .findById(userId)
      .populate("pointsTransactions")
      .populate("productPurchases");
  }

  async updateUserPointsBalance(userId, points) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsBalance += points;
    return await user.save();
  }

  async addPointsTransaction(userId, transactionId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.pointsTransactions.push(transactionId);
    return await user.save();
  }

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
