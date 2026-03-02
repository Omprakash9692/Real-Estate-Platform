import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check existing
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: "User registered",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or Password",
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by an admin. Please contact support.",
            });
        }

        // create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            message: "Login success",
            token,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // generate token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // save token in DB
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Send reset link via email
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });

            res.json({
                success: true,
                message: "Password reset link sent to your email",
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            console.error("Email error:", err);
            return res.status(500).json({
                message: "Email could not be sent",
            });
        }
    } catch (err) {
        res.status(500).json({

            message: err.message,
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
 };


