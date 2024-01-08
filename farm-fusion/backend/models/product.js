import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["product", "service"],
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
    default: "admin"
  },
  quality: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

});

const Product = mongoose.model("Product", productSchema);

export default Product;
