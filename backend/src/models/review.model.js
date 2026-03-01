import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from the same buyer for the same seller
reviewSchema.index({ buyer: 1, seller: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
