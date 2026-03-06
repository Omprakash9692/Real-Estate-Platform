import Contact from "../models/contact.model.js";

export const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({
            success: true,
            message: "Message sent successfully"
        });
    }
    catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to send message"
        });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
        });
    }
};
