import mongoose from "mongoose";

// Define the product purchase schema
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

// Create the ProductPurchase model from the schema
const ProductPurchase = mongoose.model(
  "ProductPurchase",
  productPurchaseSchema
);

export default ProductPurchase;
