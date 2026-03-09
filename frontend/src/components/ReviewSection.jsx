import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HiStar } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";
import "./ReviewSection.css";

const ReviewSection = ({ sellerId, propertyId }) => {
    const { user, token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchReviews = useCallback(async () => {
        try {
            const url = propertyId
                ? `${API_URL}/api/reviews/${sellerId}?propertyId=${propertyId}`
                : `${API_URL}/api/reviews/${sellerId}`;
            const res = await axios.get(url);
            setReviews(res.data.reviews);
            setStats(res.data.stats);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [sellerId, propertyId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await axios.post(
                `${API_URL}/api/reviews`,
                { sellerId, propertyId, rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage({ type: "success", text: "Review added successfully" });
            setComment("");
            setRating(5);
            fetchReviews();
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Error submitting review"
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="no-reviews">Loading reviews...</div>;

    const currentRating = hoverRating || rating;

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <h3>{propertyId ? "Property Reviews" : "Seller Reviews"}</h3>
                <div className="reviews-stats">
                    <div className="avg-rating">
                        <HiStar color="#eab308" />
                        <span>{stats.avgRating}</span>
                    </div>
                    <span className="total-reviews">({stats.totalReviews} reviews)</span>
                </div>
            </div>

            {user && user.role === "buyer" && (
                <div className="add-review-form">
                    <h4>Add a Review</h4>
                    <div className="rating-select" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={star <= currentRating ? "star-active" : ""}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                            >
                                <HiStar size={24} />
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Share your experience with this seller..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                    {message && (
                        <div className={`form-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            )}

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-user">
                                <img
                                    src={review.buyer?.profilePic || `https://ui-avatars.com/api/?name=${review.buyer?.name || "User"}&background=random`}
                                    alt={review.buyer?.name}
                                />
                                <div>
                                    <div className="user-name">{review.buyer?.name}</div>
                                    <div className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar
                                        key={i}
                                        color={i < review.rating ? "#eab308" : "#cbd5e1"}
                                    />
                                ))}
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        {propertyId
                            ? "No reviews yet for this property."
                            : "No reviews yet for this seller."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;