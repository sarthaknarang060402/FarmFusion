import Product from "../models/product.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, type, createdBy } = req.body;
    const id = nanoid();

    // console.log(image );

    const product = new Product({
      id,
      name,
      price,
      description,
      image,
      type,
      createdBy: createdBy ? createdBy : "admin",
    });

    await product.save();

    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get a list of all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get products by user ID
const getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ createdBy: userId });
    if (!products || products.length === 0) {
      return res.json({ success: false, message: "No Products found" });
    }
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, image, type } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        image,
        type,
      },
      { new: true }, // Return the updated product
    );

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndRemove(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { productId, rating } = req.body;

    // Caluclate new rating
    const product = await Product.findById(productId);
    const newRating = (product.rating + rating) / 2;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { rating: newRating },
      { new: true },
    );

    res.json({ success: true, product: updatedProduct });
  }
  catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
}

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    console.log(query);

    const products = await Product.find({ name: { $regex: query, $options: 'i' } });

    res.json({ success: true, products: products.splice(0, 5) });
  }
  catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
  // console.log("hello")
}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addRating,
  searchProducts,
  getProductsByUserId,
};
