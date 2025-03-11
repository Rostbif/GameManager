import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pointsBalance: {
    type: Number,
    default: 0,
  },
  pointsTransactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PointsTransaction",
    },
  ],
  productPurchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductPurchase",
    },
  ],
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;
