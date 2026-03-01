import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// GET PROFILE
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Handle profile pic upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profiles",
            });
            user.profilePic = result.secure_url;
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({
            success: true,
            message: "Profile updated",
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};