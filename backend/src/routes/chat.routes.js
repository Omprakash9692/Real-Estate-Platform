import express from "express";
const router = express.Router();
import Chat from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

router.use(protect);

// create or get chat
router.post("/start", async (req, res) => {
    try {
        const { propertyId, sellerId } = req.body;
        const buyerId = req.user._id;

        // Check for an existing chat between this buyer and seller
        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: sellerId,
        });

        if (!chat) {
            chat = await Chat.create({
                property: propertyId, // Initial property context
                buyer: buyerId,
                seller: sellerId,
                messages: [],
            });
        }
        res.json(chat);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error creating or getting chat", error: err.message });
    }
});

// send message
router.post("/send", async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const newMessage = {
            sender: userId,
            text,
            createdAt: new Date(),
        };
        chat.messages.push(newMessage);
        await chat.save();

        // Return both chat and the specific new message for frontend updates
        const savedMessage = chat.messages[chat.messages.length - 1];

        res.json({ chat, newMessage: savedMessage });
    } catch (err) {
        res.status(500).json({
            message: "Error sending message",
            error: err.message,
        });
    }
});

// get all chats for user
router.get("/user", async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }],
        })
            .populate("buyer", "name email")
            .populate("seller", "name email")
            .populate("property", "title price images")
            .sort({ updatedAt: -1 });
        res.json(chats);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching user chats", error: err.message });
    }
});

// get chat messages
router.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "messages.sender",
            "name"
        );
        res.json(chat);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching chat messages", error: err.message });
    }
});

// delete entire chat
router.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Ensure user is part of the chat
        if (
            chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message: "Chat deleted successfully" });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error deleting chat", error: err.message });
    }
});

// delete specific message
router.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const message = chat.messages.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        // Only sender can delete their message
        if (message.sender.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this message" });
        }

        chat.messages.pull(req.params.messageId);
        await chat.save();
        res.json({ message: "Message deleted successfully", chat });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error deleting message", error: err.message });
    }
});

export default router;