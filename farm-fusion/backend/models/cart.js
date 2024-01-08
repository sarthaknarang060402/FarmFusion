import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  itemType: {
    type: String, // 'product' or 'service'
    enum: ["product", "service"],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Product or Service model
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  totalTax: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  items: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;