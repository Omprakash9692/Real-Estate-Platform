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
            isApproved: role === 'seller' ? false : true,
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

        // generate OTP (6 digit number)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // save OTP in DB
        user.resetPasswordToken = otp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 10px;">
                <h1 style="color: #0d9488; text-align: center;">Password Reset Request</h1>
                <p>You requested a password reset. Please use the 6-digit OTP code below to reset your password:</p>
                <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 2.5rem; font-weight: 800; letter-spacing: 0.5rem; color: #1e293b;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset OTP",
                message,
            });

            res.json({
                success: true,
                message: "OTP sent to your email",
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

// Reset Password (OTP based)
export const resetPassword = async (req, res) => {
    try {
        const { otp, password } = req.body;

        if (!otp || !password) {
            return res.status(400).json({ message: "OTP and password are required" });
        }

        const user = await User.findOne({
            resetPasswordToken: otp,
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

// GET ME (profile)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};