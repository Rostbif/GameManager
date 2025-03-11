import mongoose from "mongoose";

class PointsService {
  constructor(pointsModel, userModel) {
    this.pointsModel = pointsModel;
    this.userModel = userModel;
  }

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

  async _updateUserPointsBalance(userId, points, session) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { pointsBalance: points } },
      { new: true, session }
    );
  }

  async _addPointsTransaction(userId, transactionId, session) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { pointsTransactions: transactionId } },
      { new: true, session }
    );
  }

  async getPoints() {
    let points = await this.pointsModel.find(); // query all points
    return points;
  }

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
