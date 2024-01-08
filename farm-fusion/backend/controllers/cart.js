import Cart from "../models/cart.js";

// Function to calculate tax based on item type and price
const calculateProductTax = (itemType, price) => {
  let tax = 0;
  console.log(price)
  if (itemType === "product") {
    if (price > 1000 && price <= 5000) {
      tax = price * 0.12; // Tax PA: 12% tax for the price range (1000, 5000]
    } else if (price > 5000) {
      tax = price * 0.18; // Tax PB: 18% tax for prices above 5000
    } else {
      tax = 200; // Tax PC: Flat tax amount of 200 for prices <= 1000
    }
  } else if (itemType === "service") {
    if (price > 1000 && price <= 8000) {
      tax = price * 0.1; // Tax SA: 10% tax for the price range (1000, 8000]
    } else if (price > 8000) {
      tax = price * 0.15; // Tax SB: 15% tax for prices above 8000
    } else {
      tax = 100; // Tax SC: Flat tax amount of 100 for prices <= 1000
    }
  }

  return tax;
};

// Add an item to the cart
const addToCart = async (req, res) => {
  try {
    const { user, itemType, itemId, quantity, price } = req.body;

    // Check if the user's cart already exists, if not, create one
    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = new Cart({ user, items: [], totalTax: 0 });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.itemType === itemType && item.itemId.equals(itemId),
    );
    const itemTax = 0; // Calculate tax
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.tax = 0;
    } else {
      cart.items.push({ itemType, itemId, quantity, price, tax: itemTax });
    }

    // Calculate total tax for the cart
    cart.totalTax = 0
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { user, itemType, itemId } = req.body;

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.itemType === itemType && item.itemId.equals(itemId)),
    );

    // Recalculate total tax for the cart
    cart.totalTax = 0
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);
    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Clear the entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    let cart = await Cart.findOne({ _id: userId });

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    cart.totalTax = 0; // Reset total tax to 0
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get the current cart contents
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    let cart = await Cart.findOne({ user: userId })
      .populate("items.itemId")
      .exec();

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Change the quantity of an item in the cart
const changeQuantity = async (req, res) => {
  try {
    const { user, itemType, itemId, quantityChange } = req.body;

    let cart = await Cart.findOne({ user }).populate("items.itemId");

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => item.itemType === itemType && item.itemId.equals(itemId),
    );

    if (!cartItem) {
      return res.json({ success: false, message: "Item not found in cart" });
    }
    const itemTax = 0
    if (cartItem.quantity === 1 && quantityChange === -1) {
      cart.items = cart.items.filter(
        (item) => !(item.itemType === itemType && item.itemId.equals(itemId)),
      );
    } else {
      cartItem.quantity += quantityChange;
      cartItem.tax = 0;
    }

    cart.totalTax = 0;
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, message: "Quantity changed successfully", cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, removeFromCart, clearCart, getCart, changeQuantity };