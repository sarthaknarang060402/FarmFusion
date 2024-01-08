import mongoose from "mongoose"


// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["consumer", "seller"],
    default: "consumer",
  },
});

// Create a User model from the schema
const User = mongoose.model('User', userSchema);

export default User
