import Review from "../models/review.model.js";

// ADD REVIEW
export const addReview = async (req, res) => {
    try {
        const { sellerId, propertyId, rating, comment } = req.body;
        const buyerId = req.user._id;

        // prevent self review
        if (buyerId.toString() === sellerId) {
            return res.status(400).json({
                success: false,
                message: "Sellers cannot review themselves",
            });
        }

        const reviewData = {
            buyer: buyerId,
            seller: sellerId,
            rating,
            comment,
        };

        if (propertyId) {
            reviewData.property = propertyId;
        }

        const review = new Review(reviewData);

        await review.save();

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        // duplicate review error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this seller",
            });
        }

        res.status(500).json({
            success: false,
            message: "Error adding review",
            error: error.message,
        });
    }
};

// GET SELLER REVIEWS
export const getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { propertyId } = req.query;

        let query = { seller: sellerId };
        if (propertyId) {
            query.property = propertyId;
        }

        const reviews = await Review.find(query)
            .populate("buyer", "name profilePic")
            .sort({ createdAt: -1 });

        const totalReviews = reviews.length;

        const avgRating =
            totalReviews > 0
                ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
                : 0;

        res.json({
            success: true,
            reviews,
            stats: {
                avgRating: avgRating.toFixed(1),
                totalReviews,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message,
        });
    }
};