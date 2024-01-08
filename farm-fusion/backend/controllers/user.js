import User from "../models/user.js";

const becomeASeller = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.type === "seller") {
            return res.json({ success: false, message: "User is already a seller" });
        }

        user.type = "seller";
        await user.save();

        res.json({ success: true, message: "User is now a seller" });
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: "Internal server error" });
    }
}

const getProfileDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: "Internal server error" })
    }
}

export {
    becomeASeller,
    getProfileDetails
}