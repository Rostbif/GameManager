import mongoose from "mongoose";

class PurchasesService {
  constructor(purchasesModel, pointsModel, userModel) {
    this.purchasesModel = purchasesModel;
    this.pointsModel = pointsModel;
    this.userModel = userModel;
  }

  /**
   * Handles the purchase of an item by a user.
   * @param {string} userId - The ID of the user making the purchase.
   * @param {number} price - The price of the item being purchased.
   * @returns {Object} - The purchase record.
   * @throws {Error} - If the user has insufficient points or any other error occurs.
   */
  async buyItem(userId, price) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Get the user and reduce the price from its balance (unless it doesn't have enough balance)
      const user = await this.userModel.findById(userId).session(session);
      if (!user || user.pointsBalance < price) {
        throw new Error("Insufficient points");
      }
      user.pointsBalance -= price;
      await user.save({ session });

      // Bring all transactions that have remaining points greater than 0
      // Sort by date (the oldest first)
      const transactions = await this.pointsModel
        .find({ userId, pointsRemaining: { $gt: 0 } })
        .sort({ timestamp: 1 })
        .session(session);

      let remainingPrice = price;

      // Run over the transactions and subtract the price from them until finishing reducing all the price points
      for (const transaction of transactions) {
        if (remainingPrice <= 0) break;

        if (transaction.pointsRemaining >= remainingPrice) {
          transaction.pointsRemaining -= remainingPrice;
          remainingPrice = 0;
        } else {
          remainingPrice -= transaction.pointsRemaining;
          transaction.pointsRemaining = 0;
          transaction.archived = true;
        }
        await transaction.save({ session });
      }

      // Create and save the new purchase log in the db
      const purchase = new this.purchasesModel({
        userId,
        price,
        timestamp: new Date(),
      });
      await purchase.save({ session });

      // Update the user model with the new purchase log
      await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $push: { productPurchases: purchase._id } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return purchase;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Retrieves the purchase history for a user.
   * @param {string} [userId] - The ID of the user whose purchases are to be retrieved.
   * @returns {Array} - A list of purchase records.
   */
  async getPurchases(userId) {
    // Get all purchases for the given userId, or all purchases if no userId is provided
    const query = userId ? { userId } : {};
    return await this.purchasesModel.find(query).sort({ timestamp: -1 });
  }
}

export default PurchasesService;
