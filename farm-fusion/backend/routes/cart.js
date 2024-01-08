import express from "express";
import {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  changeQuantity,
} from "../controllers/cart.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart); // Add an item to the cart
cartRouter.post("/remove", removeFromCart); // Remove an item from the cart
cartRouter.post("/clear", clearCart); // Clear the entire cart
cartRouter.get("/:userId", getCart); // Get the current cart contents
cartRouter.post("/changeQuantity", changeQuantity); //Increase or decrease Quantity

export default cartRouter;
