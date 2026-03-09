import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String, // Changed to String to support +, leading zeros, etc.
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
