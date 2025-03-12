import mongoose from "mongoose";

class PointsService {
  constructor(pointsModel, userModel) {
    this.pointsModel = pointsModel;
    this.userModel = userModel;
  }

  /**
   * Adds points to a user's account and creates a transaction record.
   * @param {string} userId - The ID of the user.
   * @param {number} points - The number of points to add.
   * @returns {Object} - The created transaction.
   */
  async addPoints(userId, points) {
    // using mongo session in order to do all the actions in one transaction
    // https://www.mongodb.com/docs/drivers/node/current/fundamentals/transactions/
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transaction = new this.pointsModel({
        userId,
        originalNumberOfPoints: points,
        pointsRemaining: points,
      });
      await transaction.save({ session });

      await this._updateUserPointsBalance(userId, points, session);
      await this._addPointsTransaction(userId, transaction._id, session);

      await session.commitTransaction();
      session.endSession();

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Updates the user's points balance.
   * @param {string} userId - The ID of the user.
   * @param {number} points - The number of points to add.
   * @param {Object} session - The MongoDB session.
   * @returns {Object} - The updated user document.
   */
  async _updateUserPointsBalance(userId, points, session) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { pointsBalance: points } },
      { new: true, session }
    );
  }

  /**
   * Adds a points transaction to the user's transaction history.
   * @param {string} userId - The ID of the user.
   * @param {string} transactionId - The ID of the transaction.
   * @param {Object} session - The MongoDB session.
   * @returns {Object} - The updated user document.
   */
  async _addPointsTransaction(userId, transactionId, session) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { pointsTransactions: transactionId } },
      { new: true, session }
    );
  }

  /**
   * Retrieves all points transactions.
   * @returns {Array} - An array of points transactions.
   */
  async getPoints() {
    let points = await this.pointsModel.find(); // query all points
    return points;
  }

  /**
   * Expires points that are older than the specified expiration time.
   * @param {Date} expirationTime - The expiration time. Defaults to six weeks ago.
   */
  async expirePoints(expirationTime) {
    const expiration =
      expirationTime || new Date(Date.now() - 6 * 7 * 24 * 60 * 60 * 1000); // default: six weeks ago
    const expiredTransactions = await this.pointsModel.find({
      timestamp: { $lt: expiration },
      pointsRemaining: { $gt: 0 },
      archived: { $ne: true },
    });

    for (const transaction of expiredTransactions) {
      const user = await this.userModel.findById(transaction.userId);
      if (user) {
        user.pointsBalance -= transaction.pointsRemaining;
        transaction.pointsRemaining = 0;
        transaction.archived = true;
        await transaction.save();
        await user.save();
      }
    }
  }
}

export default PointsService;
