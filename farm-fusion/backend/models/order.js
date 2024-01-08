import mongoose from 'mongoose'

// Define the user schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  items: [
    {
      type: {
        type: String, // 'product' or 'service'
        enum: ['product', 'service'],
        required: true,
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product or Service model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      seller: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
      },
    },
  ],
  totalAmount: {
    type: Number,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
})

const Order = mongoose.model('Order', orderSchema)

export default Order
