import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiStar } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";
import "./ReviewSection.css";


const ReviewSection = ({ sellerId }) => {

    const { user } = useAuth();

    const [reviews, setReviews] = useState([]);

    const [stats, setStats] = useState({
        avgRating: 0,
        totalReviews: 0
    });

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState(null);



    const fetchReviews = async () => {

        try {

            const res = await axios.get(`${API_URL}/api/reviews/${sellerId}`);

            setReviews(res.data.reviews);

            setStats(res.data.stats);

            setLoading(false);

        }

        catch (err) {

            console.error(err);

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchReviews();

    }, [sellerId]);




    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);

        setMessage(null);


        try {

            await axios.post(

                `${API_URL}/api/reviews`,

                {
                    sellerId,
                    rating,
                    comment
                },

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }

            );

            setMessage({
                type: "success",
                text: "Review added successfully"
            });

            setComment("");

            setRating(5);

            fetchReviews();

        }

        catch (err) {

            setMessage({

                type: "error",

                text: err.response?.data?.message || "Error"

            });

        }

        finally {

            setSubmitting(false);

        }

    };



    if (loading) return <div>Loading...</div>;



    return (
        <div>

            {/* Your UI same as before */}

        </div>
    );

};


export default ReviewSection;