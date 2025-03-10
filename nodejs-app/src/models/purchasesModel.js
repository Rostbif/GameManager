import mongoose from "mongoose";
const productPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ProductPurchase = mongoose.model(
  "ProductPurchase",
  productPurchaseSchema
);

export default ProductPurchase;
