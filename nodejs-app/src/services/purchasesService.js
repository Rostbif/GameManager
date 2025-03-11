import mongoose from "mongoose";

class PurchasesService {
  constructor(purchasesModel, pointsModel, userModel) {
    this.purchasesModel = purchasesModel;
    this.pointsModel = pointsModel;
    this.userModel = userModel;
  }

  async buyItem(userId, price) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // get the user and reduce the price from its balance (unless it doesn't have enough balance)
      const user = await this.userModel.findById(userId).session(session);
      if (!user || user.pointsBalance < price) {
        throw new Error("Insufficient points");
      }
      user.pointsBalance -= price;
      await user.save({ session });

      // bring all transactions that their remaining points is greater than 0
      // sort by date (the oldest first) TBD - verify that

      const transactions = await this.pointsModel
        .find({ userId, pointsRemaining: { $gt: 0 } })
        .sort({ timestamp: 1 })
        .session(session);

      let remainingPrice = price;

      // Run over the transactions and substract the price from them till finishing reducing all the price points...
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

      // update the user model with the new purchase log (find by ID and Update not require another save)
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

  async getPurchases(userId) {
    const query = userId ? { userId } : {};
    return await this.purchasesModel.find(query).sort({ timestamp: -1 });
  }
}

export default PurchasesService;
