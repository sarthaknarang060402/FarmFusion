import Order from "../models/order.js";
import Product from "../models/product.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    let itemsChanged = []
    // Calculate the total amount for the orders
    for (const item of items) {
      const product = await Product.findOne({ id: item.itemId.id });
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      item.itemId.quantity = item.quantity
      item.itemId.tax = item.tax
      item.itemId.seller = product.createdBy

      itemsChanged = [...itemsChanged, item.itemId]
    }

    // Create the order
    const order = new Order({
      user: userId,
      id: nanoid(),
      items: itemsChanged,
      totalAmount: totalAmount,
    });

    await order.save();

    res.json({ success: true, message: "Order Confirmed", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get a list of all orders
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // const orders = await Order.find({ user: userId });
    // res.json({ success: true, orders });
    const orders = await Order.find({ user: userId })
    if (!orders || orders.length === 0) {
      return res.json({
        success: false,
        message: "No orders found for the specified user",
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get orders by seller
const getOrdersBySeller = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ "items.seller": userId });
    if (!orders || orders.length === 0) {
      return res.json({
        success: false,
        message: "No orders found for the specified seller",
      });
    }

    res.json({ success: true, orders: orders.items.filter(item => item.seller === userId) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
}

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const { orderId, itemId, status } = req.body;

    const order = await Order.find({ id: orderId });
    if (!order) return res.json({ success: false, message: "Order not found" });

    const item = order.items.filter(item => item._id === itemId)[0]
    if (!item) return res.json({ success: false, message: "Item not found" });

    item.status = status
    order.items.filter(item => item.status === "completed").length === order.items.length ? order.status = "completed" : order.status = "pending"

    await order.save();

    res.json({ success: true, message: "Order updated successfully" });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
}

export { createOrder, getOrdersByUser, getOrdersBySeller, updateOrder };
