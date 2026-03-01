import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineArrowRight, HiHeart, HiTrash } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setWishlistItems(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load wishlist.');
            setLoading(false);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        try {
            await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setWishlistItems(wishlistItems.filter(item => item.property._id !== propertyId));
        } catch (err) {
            alert('Failed to remove from wishlist.');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-alt)', minHeight: '100vh' }}>
            <Navbar />

            <main className="container fade-in wishlist-main" style={{ padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Wishlist</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Properties you've saved for later.</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="card-premium" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'var(--bg-alt)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--text-muted)' }}>
                            <HiHeart size={40} />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start exploring properties and save your favorites!</p>
                        <Link to="/" className="btn btn-primary">Browse Properties</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 wishlist-grid" style={{ gap: '2rem' }}>
                        {wishlistItems.map((item) => (
                            <PropertyCard
                                key={item._id}
                                property={item.property}
                                renderActions={() => (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(item.property._id);
                                        }}
                                        className="btn"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            backgroundColor: '#fff5f5',
                                            color: '#ef4444',
                                            border: '1px solid #fee2e2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 700
                                        }}
                                    >
                                        <HiTrash size={18} /> Remove from Wishlist
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                )}
            </main>
            <style>{`
                @media (max-width: 768px) {
                    .wishlist-main {
                        padding: 2rem 1rem !important;
                    }
                }
                @media (max-width: 640px) {
                    .wishlist-grid {
                        grid-template-columns: 1fr !important;
                        justify-items: center !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Wishlist;
