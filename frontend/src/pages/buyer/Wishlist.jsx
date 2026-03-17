import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { HiOutlineArrowRight, HiHeart, HiTrash } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import { useAuth } from "../../context/AuthContext";

const Wishlist = () => {
    const { token } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistItems(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load wishlist.');
            setLoading(false);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        if (!propertyId) {
            alert('Invalid property ID');
            return;
        }
        try {
            await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistItems(prev => prev.filter(item => item.property && item.property._id !== propertyId));
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to remove from wishlist.';
            alert(errorMsg);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="bg-bg-alt min-h-screen">
            <Navbar />

            <main className="container fade-in py-12 px-4 md:px-8">
                <div className="mb-12">
                    <h1 className="text-[2.5rem] mb-2">Your Wishlist</h1>
                    <p className="text-text-muted">Properties you've saved for later.</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="card-premium py-24 px-8 text-center">
                        <div className="bg-bg-alt w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-text-muted">
                            <HiHeart size={40} />
                        </div>
                        <h2 className="mb-4">Your wishlist is empty</h2>
                        <p className="text-text-muted mb-8">Start exploring properties and save your favorites!</p>
                        <Link to="/" className="btn btn-primary">Browse Properties</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:justify-items-center">
                        {wishlistItems.filter(item => item.property).map((item) => (
                            <PropertyCard
                                key={item._id}
                                property={item.property}
                                renderActions={() => (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeFromWishlist(item.property._id);
                                        }}
                                        className="btn w-full p-3 rounded-xl bg-[#fff5f5] text-[#ef4444] border border-[#fee2e2] flex items-center justify-center gap-2 font-bold"
                                    >
                                        <HiTrash size={18} /> Remove from Wishlist
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Wishlist;
