import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from "../config";
import {
    HiLocationMarker, HiOutlineHome, HiArrowsExpand,
    HiPhone, HiChatAlt, HiHeart, HiOutlineLogout,
    HiShare, HiFlag, HiBadgeCheck, HiChevronRight,
    HiOutlineUserGroup, HiOutlineViewGrid, HiCalendar,
    HiX, HiChevronLeft, HiCollection, HiOutlineHeart
} from "react-icons/hi";
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
    const [inquiryStatus, setInquiryStatus] = useState({ loading: false, success: false, error: null });
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [sellerStats, setSellerStats] = useState({ avgRating: 0, totalReviews: 0 });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/property/${id}`);
                setProperty(res.data.property);
                setSimilarProperties(res.data.similarProperties || []);

                if (user && user.role === 'buyer') {
                    const wishRes = await axios.get(`${API_URL}/api/wishlist`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    const found = wishRes.data.some(item => item.property?._id === id);
                    setIsInWishlist(found);
                }
                if (res.data.property?.seller?._id) {
                    const statsRes = await axios.get(`${API_URL}/api/reviews/${res.data.property.seller._id}`);
                    setSellerStats(statsRes.data.stats);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load property details.');
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const handleWishlistToggle = async () => {
        if (!user) return navigate('/login');
        try {
            if (isInWishlist) {
                await axios.delete(`${API_URL}/api/wishlist/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setIsInWishlist(false);
            } else {
                await axios.post(`${API_URL}/api/wishlist/${id}`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setIsInWishlist(true);
            }
        } catch (err) {
            alert('Failed to update wishlist.');
        }
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        // Ensure only buyers can send inquiries
        if (user.role !== 'buyer') return alert('Only buyers can send inquiries');

        setInquiryStatus({ ...inquiryStatus, loading: true });
        try {
            await axios.post(`${API_URL}/api/inquiry`, {
                propertyId: id,
                message: inquiry.message
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setInquiryStatus({ loading: false, success: true, error: null });
            setInquiry({ ...inquiry, message: '' });
        } catch (err) {
            setInquiryStatus({ loading: false, success: false, error: 'Failed to send inquiry.' });
        }
    };

    const handleChatStart = async () => {
        if (!user) return navigate('/login');
        if (user.role !== 'buyer') return alert('Only buyers can chat with sellers');

        try {
            const res = await axios.post(`${API_URL}/api/chat/start`, {
                propertyId: id,
                sellerId: property.seller._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const chat = res.data;

            // Automatically send context message (like WhatsApp)
            await axios.post(`${API_URL}/api/chat/send`, {
                chatId: chat._id,
                text: `(Context: Interested in property "${property.title}")`
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            navigate('/chat-messages', { state: { chat } });
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Failed to start chat.');
        }
    };

    const [lightboxIndex, setLightboxIndex] = useState(null);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;
    if (error || !property) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>{error || 'Property not found'}</div>;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(property.price);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () => setLightboxIndex((prev) => (prev + 1) % property.images.length);
    const prevImage = () => setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />

            <main className="container fade-in" style={{ paddingTop: '1rem' }}>
                {/* Breadcrumbs */}
                <nav className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                    <HiChevronRight />
                    <Link to="/properties" style={{ color: 'inherit', textDecoration: 'none' }}>Listings</Link>
                    <HiChevronRight />
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{property.title}</span>
                </nav>

                <div className="property-gallery-container" style={{ marginBottom: '2rem' }}>
                    <div className="property-gallery" style={{
                        display: 'grid',
                        gridTemplateColumns: property.images.length > 1 ? 'repeat(4, 1fr)' : '1fr',
                        gridTemplateRows: property.images.length > 1 ? 'repeat(2, 180px)' : '400px',
                        gap: '0.75rem',
                        borderRadius: '1.5rem',
                        overflow: 'hidden'
                    }}>
                        {/* Main Large Image */}
                        <div className="gallery-item main-image" style={{
                            gridColumn: property.images.length > 1 ? 'span 2' : 'span 1',
                            gridRow: property.images.length > 1 ? 'span 2' : 'span 1',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }} onClick={() => openLightbox(0)}>
                            <img
                                src={property.images[0] || 'https://placehold.co/1200x800'}
                                alt="Main Property"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                className="hover-zoom"
                            />
                        </div>

                        {/* Side Images */}
                        {property.images.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="gallery-item" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => openLightbox(idx + 1)}>
                                <img
                                    src={img}
                                    alt={`Property Interior ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                    className="hover-zoom"
                                />
                                {idx === 3 && property.images.length > 5 && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.5)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', fontWeight: 700, pointerEvents: 'none'
                                    }}>
                                        +{property.images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Only Slider */}
                    <div className="mobile-gallery-wrapper">
                        <div className="mobile-slider">
                            {property.images.map((img, idx) => (
                                <div key={idx} className="mobile-slide" onClick={() => openLightbox(idx)}>
                                    <img src={img} alt={`Slide ${idx + 1}`} />
                                    <div className="slide-counter">{idx + 1} / {property.images.length}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {lightboxIndex !== null && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.35)', zIndex: 2000,
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                        paddingTop: '6rem',
                        flexDirection: 'column',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                    }} onClick={closeLightbox}>
                        {/* Close button */}
                        <button onClick={closeLightbox} style={{
                            position: 'absolute', top: '2rem', right: '2rem',
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '44px', height: '44px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)', zIndex: 2001,
                            transition: 'all 0.2s'
                        }}>
                            <HiX size={24} color="var(--primary)" />
                        </button>

                        <div style={{
                            width: '85%', maxWidth: '900px',
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '1.5rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                            position: 'relative'
                        }} onClick={(e) => e.stopPropagation()}>
                            <img
                                src={property.images[lightboxIndex]}
                                alt={`Property Full ${lightboxIndex + 1}`}
                                style={{ width: '100%', height: 'auto', maxHeight: '72vh', objectFit: 'contain', borderRadius: '1rem' }}
                            />

                            {property.images.length > 1 && (
                                <>
                                    <button onClick={prevImage} style={{
                                        position: 'absolute', left: '-22px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'white', border: 'none', color: 'var(--primary)',
                                        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', borderRadius: '50%',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                    }} className="lightbox-nav">
                                        <HiChevronLeft size={30} />
                                    </button>
                                    <button onClick={nextImage} style={{
                                        position: 'absolute', right: '-22px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'white', border: 'none', color: 'var(--primary)',
                                        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', borderRadius: '50%',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                    }} className="lightbox-nav">
                                        <HiChevronRight size={30} />
                                    </button>
                                </>
                            )}

                            <div style={{
                                position: 'absolute', bottom: '-45px', left: '50%', transform: 'translateX(-50%)',
                                color: 'white', fontSize: '1rem', fontWeight: 600,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                {lightboxIndex + 1} / {property.images.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content & Sidebar Grid */}
                <div className="details-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>

                    {/* Left Column: Property Info */}
                    <div className="info-column">
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid var(--primary)',
                                            color: 'var(--primary)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            display: 'inline-block',
                                            marginBottom: '0.75rem'
                                        }}>
                                            Premium Listing
                                        </span>
                                    </div>
                                    <h1 className="property-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                                        {property.title}
                                    </h1>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '1rem' }}>
                                        <HiLocationMarker style={{ color: 'var(--primary)', fontSize: '1.125rem' }} />
                                        {property.area}, {property.city}, India
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={handleWishlistToggle}
                                        className="wishlist-action-btn"
                                        style={{
                                            width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            color: isInWishlist ? '#ef4444' : '#64748b'
                                        }}>
                                        {isInWishlist ? <HiHeart size={26} fill="#ef4444" /> : <HiOutlineHeart size={26} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Boxes */}
                        <div className="stats-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '0.75rem',
                            marginBottom: '2.5rem'
                        }}>
                            {[
                                { label: 'Bedrooms', value: property.bhk || 0, icon: HiOutlineHome },
                                { label: 'Bathrooms', value: Math.max(1, (parseInt(property.bhk) || 1) - 1), icon: HiOutlineUserGroup },
                                { label: 'Furnishing', value: property.furnishing || 'N/A', icon: HiCollection },
                                { label: 'Living Area', value: `${property.areaSize} sqft`, icon: HiOutlineViewGrid },
                                { label: 'Type', value: property.propertyType, icon: HiCalendar }
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    padding: '1rem 0.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9', textAlign: 'center'
                                }}>
                                    {stat.icon && <stat.icon size={18} style={{ color: 'var(--primary)', marginBottom: '0.4rem' }} />}
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description Section */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Description</h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7' }}>
                                {property.description || "No description available for this property."}
                            </p>
                        </div>

                        {/* Amenities List */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Amenities</h3>
                            <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                {(property.amenities?.length ? property.amenities : ['Parking', 'Security', 'Water Supply', 'Power Backup']).map((amn, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#334155', fontWeight: 500, fontSize: '0.9375rem' }}>
                                        <HiBadgeCheck size={18} style={{ color: 'var(--primary)' }} />
                                        {amn}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Review Section */}
                        <ReviewSection sellerId={property.seller?._id} />
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="sidebar-column">
                        {/* Price Card */}
                        <div style={{
                            background: 'var(--primary)', color: 'white', padding: '1.5rem 2rem', borderRadius: '1.5rem', marginBottom: '1.5rem',
                            boxShadow: '0 10px 25px rgba(13, 148, 136, 0.2)'
                        }}>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                {property.status?.toLowerCase() === 'rent' ? 'Rental Details' : 'Listing Price'}
                            </div>
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.25rem 0' }}>
                                {property.status?.toLowerCase() === 'rent'
                                    ? `₹${Number(property.price).toLocaleString('en-IN')}`
                                    : formattedPrice}
                                {property.status?.toLowerCase() === 'rent' && <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}> /month</span>}
                            </div>
                            {property.status?.toLowerCase() === 'rent' && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ opacity: 0.8 }}>Security Deposit</span>
                                        <span style={{ fontWeight: 700 }}>₹{Number(property.securityDeposit || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ opacity: 0.8 }}>Maintenance</span>
                                        <span style={{ fontWeight: 700 }}>₹{Number(property.maintenance || 0).toLocaleString('en-IN')}/mo</span>
                                    </div>
                                </div>
                            )}
                            <div style={{ fontSize: '0.8125rem', opacity: 0.9, marginTop: property.status?.toLowerCase() === 'rent' ? '1rem' : '0.25rem' }}>
                                Available for {property.status?.toLowerCase() === 'rent' ? 'Rent' : 'Sale'}
                            </div>
                        </div>

                        {/* Seller & Contact */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9' }}>
                                    <img src={`https://ui-avatars.com/api/?name=${property.seller?.name || 'Seller'}&background=0d6e59&color=fff`} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{property.seller?.name || 'Seller'}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#eab308', fontWeight: 700 }}>
                                            <HiStar size={14} fill="#eab308" /> {sellerStats.avgRating}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({sellerStats.totalReviews} reviews)</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                                        <HiBadgeCheck /> Verified Seller
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem' }}>
                                    <HiPhone /> Call
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem' }}
                                    onClick={handleChatStart}
                                >
                                    <HiChatAlt /> Chat
                                </button>
                            </div>

                            {/* Inquiry Form */}
                            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>Inquire</h4>
                            <form onSubmit={handleInquirySubmit}>
                                {user?.role === 'buyer' ? (
                                    <>
                                        <textarea
                                            placeholder="Your Message..."
                                            value={inquiry.message}
                                            onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                                            style={{ width: '100%', height: '100px', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem', outline: 'none', resize: 'none', fontSize: '0.875rem' }}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 700 }}
                                            disabled={inquiryStatus.loading}
                                        >
                                            {inquiryStatus.loading ? 'Sending...' : 'Send Inquiry'}
                                        </button>
                                        {inquiryStatus.success && <p style={{ color: 'green', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>Inquiry sent!</p>}
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            {user ? 'Only buyers can send inquiries.' : 'Please login as a buyer to send inquiries.'}
                                        </p>
                                        {!user && <Link to="/login" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Login</Link>}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Additional Details Box */}
                <div className="additional-details" style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                        Property Details
                    </h3>
                    <div className="details-grid-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                        {[
                            { label: 'Property ID', value: property._id.slice(-8).toUpperCase() },
                            { label: 'Added On', value: new Date(property.createdAt).toLocaleDateString() },
                            { label: 'Property Type', value: property.propertyType },
                            { label: 'Status', value: `For ${property.status}` }
                        ].map((detail, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{detail.label}</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 600, textTransform: 'capitalize' }}>{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Properties */}
                <section style={{ marginTop: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Similar Properties</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Listings you might like in {property.city}.</p>
                        </div>
                        <Link to="/properties" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                            All Listings <HiChevronRight />
                        </Link>
                    </div>
                    <div className="similar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {similarProperties.length > 0 ? (
                            similarProperties.slice(0, 3).map(p => (
                                <PropertyCard key={p._id} property={p} />
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                padding: '3rem',
                                background: '#f8fafc',
                                borderRadius: '1.5rem',
                                textAlign: 'center',
                                border: '1px dashed #e2e8f0',
                                color: '#64748b'
                            }}>
                                No similar properties found in this location.
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <style>{`
                .gallery-item {
                    position: relative;
                    overflow: hidden;
                    background: #f1f5f9;
                }

                .hover-zoom:hover {
                    transform: scale(1.05);
                }

                .lightbox-nav {
                    transition: all 0.2s ease;
                }

                .lightbox-nav:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-50%) scale(1.1) !important;
                }

                .mobile-gallery-wrapper {
                    display: none;
                }

                @media (max-width: 1024px) {
                    .details-layout {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .sidebar-column {
                        position: static !important;
                    }
                    .property-gallery {
                        height: 350px !important;
                        grid-template-rows: repeat(2, 160px) !important;
                    }
                }

                @media (max-width: 768px) {
                    .property-gallery {
                        display: none !important;
                    }
                    
                    .mobile-gallery-wrapper {
                        display: block;
                        margin: -1rem -1rem 1.5rem -1rem; /* Negative margin to span full width on small screens */
                    }

                    .mobile-slider {
                        display: flex;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        scroll-behavior: smooth;
                        -webkit-overflow-scrolling: touch;
                        gap: 0;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }

                    .mobile-slider::-webkit-scrollbar {
                        display: none;
                    }

                    .mobile-slide {
                        flex: 0 0 100%;
                        scroll-snap-align: start;
                        position: relative;
                        aspect-ratio: 4/3;
                        overflow: hidden;
                    }

                    .mobile-slide img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .slide-counter {
                        position: absolute;
                        bottom: 1rem;
                        right: 1rem;
                        background: rgba(0, 0, 0, 0.6);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 1rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }

                    .property-title {
                        font-size: 2rem !important;
                    }
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .additional-details .details-grid-row {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                }
                @media (max-width: 480px) {
                    .property-title {
                        font-size: 1.75rem !important;
                    }
                    .stats-grid {
                        gap: 0.5rem !important;
                    }
                }
              .wishlist-action-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
        </div>
    );
};

export default PropertyDetails;

const HiCalendarTag = () => <HiCalendar />;
