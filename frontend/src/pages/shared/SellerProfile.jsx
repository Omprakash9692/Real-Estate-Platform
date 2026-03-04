import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from "../../config";
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import ReviewSection from '../../components/ReviewSection';
import { HiStar, HiBadgeCheck, HiMail, HiPhone, HiCalendar } from "react-icons/hi";

const SellerProfile = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                // Fetch public profile
                const userRes = await axios.get(`${API_URL}/api/user/public/${id}`);
                setSeller(userRes.data.user);

                // Fetch seller properties
                const propRes = await axios.get(`${API_URL}/api/property?seller=${id}`);
                setProperties(propRes.data.properties);

                // Fetch review stats
                const statsRes = await axios.get(`${API_URL}/api/reviews/${id}`);
                setStats(statsRes.data.stats);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching seller data:", err);
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [id]);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;
    if (!seller) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Seller not found</div>;

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />

            <div className="container fade-in" style={{ paddingTop: '3rem' }}>
                {/* Header Profile Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid #f1f5f9',
                    marginBottom: '3rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #f1f5f9'
                    }}>
                        <img
                            src={seller.profilePic || `https://ui-avatars.com/api/?name=${seller.name}&background=0d6e59&color=fff&size=150`}
                            alt={seller.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{seller.name}</h1>
                            <HiBadgeCheck size={28} color="var(--primary)" />
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <HiStar color="#eab308" size={20} />
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{stats.avgRating}</span>
                                <span>({stats.totalReviews} reviews)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <HiCalendar size={20} />
                                <span>Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href={`mailto:${seller.email}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <HiMail /> Email Seller
                            </a>
                            {seller.phone && (
                                <a href={`tel:${seller.phone}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <HiPhone /> Call Seller
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>
                    {/* Left Side: Properties */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Properties by this Seller</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {properties.length > 0 ? (
                                properties.map(property => (
                                    <PropertyCard key={property._id} property={property} />
                                ))
                            ) : (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    padding: '3rem',
                                    background: '#f8fafc',
                                    borderRadius: '1.5rem',
                                    textAlign: 'center',
                                    border: '1px dashed #e2e8f0'
                                }}>
                                    No properties listed by this seller yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Reviews */}
                    <div>
                        <ReviewSection sellerId={id} />
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 400px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 640px) {
                    div[style*="padding: 2.5rem"] {
                        padding: 1.5rem !important;
                        text-align: center;
                        justify-content: center;
                    }
                    div[style*="display: flex; gap: 1rem"] {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default SellerProfile;
