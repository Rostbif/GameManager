import mongoose from "mongoose";
const pointsTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  originalNumberOfPoints: {
    type: Number,
    required: true,
    min: 0,
  },
  pointsRemaining: {
    type: Number,
    required: true,
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    // expires: "6w", // This option Automatically remove points older
    // than 6 weeks using mongo mechanism but we won't use it as we prefer doing it programmatically
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const PointsTransaction = mongoose.model(
  "PointsTransaction",
  pointsTransactionSchema
);

export default PointsTransaction;
