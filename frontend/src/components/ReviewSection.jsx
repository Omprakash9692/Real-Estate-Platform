import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HiStar } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

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

    if (loading) return <div className="text-center text-[#6b7280] p-8 bg-[#f9fafb] rounded-2xl">Loading reviews...</div>;

    const currentRating = hoverRating || rating;

    return (
        <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl text-[#111827]">{propertyId ? "Property Reviews" : "Seller Reviews"}</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xl font-bold text-[#111827]">
                        <HiStar color="#eab308" />
                        <span>{stats.avgRating}</span>
                    </div>
                    <span className="text-[#6b7280] text-[15px]">({stats.totalReviews} reviews)</span>
                </div>
            </div>

            {user && user.role === "buyer" && (
                <div className="bg-[#f9fafb] p-8 rounded-2xl mb-12 border border-border">
                    <h4 className="mb-4">Add a Review</h4>
                    <div className="flex gap-2 mb-6" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`bg-transparent border-none cursor-pointer p-0 transition-colors duration-100 ${star <= currentRating ? "text-[#eab308]" : "text-[#cbd5e1] hover:text-[#eab308]"}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                            >
                                <HiStar size={24} />
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full min-h-[120px] p-4 rounded-xl border border-border mb-4 font-inherit resize-y"
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
                        <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="p-6 rounded-2xl bg-white border border-border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={review.buyer?.profilePic || `https://ui-avatars.com/api/?name=${review.buyer?.name || "User"}&background=random`}
                                    alt={review.buyer?.name}
                                />
                                <div>
                                    <div className="font-semibold text-[#111827]">{review.buyer?.name}</div>
                                    <div className="text-[13px] text-[#6b7280]">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar
                                        key={i}
                                        color={i < review.rating ? "#eab308" : "#cbd5e1"}
                                    />
                                ))}
                            </div>
                            <p className="text-[#4b5563] leading-relaxed text-[15px]">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-[#6b7280] p-8 bg-[#f9fafb] rounded-2xl">
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