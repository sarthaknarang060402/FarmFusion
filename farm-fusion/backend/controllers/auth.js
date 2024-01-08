import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const user = await User.findOne({ email });

    // Check if the user already exists
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash the user's password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      type: type === "seller" ? "seller" : "consumer",
    });
    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Internal server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in your user database
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Authentication failed" });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, message: "Authentication failed" });
    }

    const token = jwt.sign({ email, userId: user._id, type: user.type, name: user.name }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.json({ success: true, token });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Internal server error" });
  }
};

const verifyToken = (req, res) => {
  try {
    const { token } = req.body; // Get the token from the request headers

    if (!token) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        return res
          .json({ success: false, message: "Token verification failed" });
      }

      // Token is valid, you can access the decoded data
      const { email, userId, type, name } = decoded;

      // You can perform any additional checks or operations here if needed

      res.json({ success: true, message: "Token verified", email, userId, type, name });
    });
  } catch (error) {
    res.json({ success: false, message: "Internal server error" });
  }
};

export { signup, signin, verifyToken };
