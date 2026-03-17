import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from "../../config";
import {
    HiLocationMarker, HiOutlineHome, HiArrowsExpand,
    HiChatAlt, HiHeart, HiOutlineLogout,
    HiShare, HiFlag, HiBadgeCheck, HiChevronRight,
    HiOutlineUserGroup, HiOutlineViewGrid, HiCalendar,
    HiX, HiChevronLeft, HiCollection, HiOutlineHeart
} from "react-icons/hi";
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import { useAuth } from '../../context/AuthContext';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
    const [inquiryStatus, setInquiryStatus] = useState({ loading: false, success: false, error: null });
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/property/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setProperty(res.data.property);
                setSimilarProperties(res.data.similarProperties || []);

                if (user && user.role === 'buyer') {
                    const wishRes = await axios.get(`${API_URL}/api/wishlist`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const found = wishRes.data.some(item => item.property?._id === id);
                    setIsInWishlist(found);
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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsInWishlist(false);
            } else {
                await axios.post(`${API_URL}/api/wishlist/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
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
                headers: { Authorization: `Bearer ${token}` }
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
                headers: { Authorization: `Bearer ${token}` }
            });

            const chat = res.data;

            // Automatically send context message (like WhatsApp)
            await axios.post(`${API_URL}/api/chat/send`, {
                chatId: chat._id,
                text: `(Context: Interested in property "${property.title}")`,
                image: property.images[0]
            }, {
                headers: { Authorization: `Bearer ${token}` }
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
        <div className="bg-[#fdfdfd] min-h-screen pb-24">
            <Navbar />

            <main className="container fade-in pt-4">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs flex items-center flex-wrap gap-2 text-sm text-[#64748b] mb-6">
                    <Link to="/" className="text-inherit no-underline">Home</Link>
                    <HiChevronRight />
                    <Link to="/properties" className="text-inherit no-underline">Listings</Link>
                    <HiChevronRight />
                    <span className="text-text-main font-semibold">{property.title}</span>
                </nav>

                <div className="property-gallery-container mb-8">
                    <div className="property-gallery hidden md:grid gap-3 rounded-3xl overflow-hidden"
                        style={{
                            gridTemplateColumns: property.images.length > 1 ? 'repeat(4, 1fr)' : '1fr',
                            gridTemplateRows: property.images.length > 1 ? 'repeat(2, 180px)' : '400px'
                        }}>
                        {/* Main Large Image */}
                        <div className="gallery-item main-image relative overflow-hidden bg-[#f1f5f9] cursor-pointer"
                            style={{
                                gridColumn: property.images.length > 1 ? 'span 2' : 'span 1',
                                gridRow: property.images.length > 1 ? 'span 2' : 'span 1'
                            }} onClick={() => openLightbox(0)}>
                            <img
                                src={property.images[0] || 'https://placehold.co/1200x800'}
                                alt="Main Property"
                                className="w-full h-full object-cover transition-transform duration-400 ease hover:scale-105"
                            />
                        </div>

                        {/* Side Images */}
                        {property.images.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="gallery-item relative overflow-hidden bg-[#f1f5f9] cursor-pointer" onClick={() => openLightbox(idx + 1)}>
                                <img
                                    src={img}
                                    alt={`Property Interior ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-400 ease hover:scale-105"
                                />
                                {idx === 3 && property.images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-2xl font-bold pointer-events-none">
                                        +{property.images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Only Slider */}
                    <div className="mobile-gallery-wrapper block md:hidden -mx-4 mb-6">
                        <div className="mobile-slider flex overflow-x-auto snap-x snap-mandatory scroll-smooth p-0 whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                            {property.images.map((img, idx) => (
                                <div key={idx} className="mobile-slide flex-[0_0_100%] snap-start relative aspect-[4/3] overflow-hidden" onClick={() => openLightbox(idx)}>
                                    <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="slide-counter absolute bottom-4 right-4 bg-black/60 text-white py-1 px-3 rounded-2xl text-xs font-semibold">
                                        {idx + 1} / {property.images.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 bg-black/35 z-[2000] flex flex-col items-center justify-start pt-24 backdrop-blur-[10px]" onClick={closeLightbox}>
                        {/* Close button */}
                        <button onClick={closeLightbox} className="absolute top-8 right-8 bg-white border-none rounded-full w-11 h-11 cursor-pointer flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.15)] z-[2001] transition-all duration-200 hover:bg-white/20 hover:scale-110">
                            <HiX size={24} className="text-primary" />
                        </button>

                        <div className="w-[85%] max-w-[900px] bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={property.images[lightboxIndex]}
                                alt={`Property Full ${lightboxIndex + 1}`}
                                className="w-full h-auto max-h-[72vh] object-contain rounded-2xl"
                            />

                            {property.images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute -left-[22px] top-1/2 -translate-y-1/2 bg-white border-none text-primary w-11 h-11 flex items-center justify-center cursor-pointer rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-white/20 hover:scale-110">
                                        <HiChevronLeft size={30} />
                                    </button>
                                    <button onClick={nextImage} className="absolute -right-[22px] top-1/2 -translate-y-1/2 bg-white border-none text-primary w-11 h-11 flex items-center justify-center cursor-pointer rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-white/20 hover:scale-110">
                                        <HiChevronRight size={30} />
                                    </button>
                                </>
                            )}

                            <div className="absolute -bottom-[45px] left-1/2 -translate-x-1/2 text-white text-base font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                {lightboxIndex + 1} / {property.images.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content & Sidebar Grid */}
                <div className="details-layout grid grid-cols-[1fr_380px] gap-10 items-start max-[1024px]:grid-cols-1 max-[1024px]:gap-8">

                    {/* Left Column: Property Info */}
                    <div className="info-column">
                        <div className="mb-8">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="py-1.5 px-4 rounded-lg border border-primary text-primary text-xs font-bold uppercase inline-block mb-3">
                                            Premium Listing
                                        </span>
                                    </div>
                                    <h1 className="property-title text-[2.5rem] font-extrabold text-text-main mb-2 tracking-tight max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
                                        {property.title}
                                    </h1>
                                    <p className="flex items-center gap-2 text-[#64748b] text-base">
                                        <HiLocationMarker className="text-primary text-lg" />
                                        {property.area}, {property.city}, India
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {(!user || user.role === 'buyer') && (
                                        <button
                                            onClick={handleWishlistToggle}
                                            className={`wishlist-action-btn w-12 h-12 rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-110 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:border-[#cbd5e1] ${isInWishlist ? 'text-red-500' : 'text-[#64748b]'}`}
                                        >
                                            {isInWishlist ? <HiHeart size={26} fill="#ef4444" /> : <HiOutlineHeart size={26} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Boxes */}
                        <div className="stats-grid grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 mb-10 max-[768px]:grid-cols-2 max-[480px]:gap-2">
                            {[
                                { label: 'Bedrooms', value: property.bhk || 0, icon: HiOutlineHome },
                                { label: 'Bathrooms', value: property.bathrooms || Math.max(1, (parseInt(property.bhk) || 1) - 1), icon: HiOutlineUserGroup },
                                { label: 'Furnishing', value: property.furnishing || 'N/A', icon: HiCollection },
                                { label: 'Living Area', value: `${property.areaSize} sqft`, icon: HiOutlineViewGrid },
                                { label: 'Type', value: property.propertyType, icon: HiCalendar }
                            ].map((stat, i) => (
                                <div key={i} className="py-4 px-2 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9] text-center">
                                    {stat.icon && <stat.icon size={18} className="text-primary mb-1.5 mx-auto" />}
                                    <div className="font-extrabold text-[0.9rem] text-text-main capitalize">{stat.value}</div>
                                    <div className="text-[0.6rem] text-[#94a3b8] uppercase font-bold tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description Section */}
                        <div className="mb-10">
                            <h3 className="text-xl font-bold mb-4">Description</h3>
                            <p className="text-[#475569] text-base leading-relaxed">
                                {property.description || "No description available for this property."}
                            </p>
                        </div>

                        {/* Amenities List */}
                        <div className="mb-10">
                            <h3 className="text-xl font-bold mb-5">Amenities</h3>
                            <div className="amenities-grid grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                                {(property.amenities?.length ? property.amenities : ['Parking', 'Security', 'Water Supply', 'Power Backup']).map((amn, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[#334155] font-medium text-[0.9375rem]">
                                        <HiBadgeCheck size={18} className="text-primary" />
                                        {amn}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="sidebar-column">
                        {/* Price Card */}
                        <div style={{
                            background: 'var(--primary)', color: 'white', padding: '1.5rem 2rem', borderRadius: '1.5rem', marginBottom: '1.5rem',
                            boxShadow: '0 10px 25px rgba(13, 148, 136, 0.2)'
                        }}>
                            <div className="text-[0.875rem] opacity-80 font-semibold uppercase mb-2">
                                {property.status?.toLowerCase() === 'rent' ? 'Rental Details' : 'Listing Price'}
                            </div>
                            <div className="text-[2.25rem] font-extrabold my-1">
                                {property.status?.toLowerCase() === 'rent'
                                    ? `₹${Number(property.price).toLocaleString('en-IN')}`
                                    : formattedPrice}
                                {property.status?.toLowerCase() === 'rent' && <span className="text-base font-normal opacity-80"> /month</span>}
                            </div>
                            {property.status?.toLowerCase() === 'rent' && (
                                <div className="mt-4 border-t border-white/20 pt-4 flex flex-col gap-2">
                                    <div className="flex justify-between text-[0.9rem]">
                                        <span className="opacity-80">Security Deposit</span>
                                        <span className="font-bold">₹{Number(property.securityDeposit || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[0.9rem]">
                                        <span className="opacity-80">Maintenance</span>
                                        <span className="font-bold">₹{Number(property.maintenance || 0).toLocaleString('en-IN')}/mo</span>
                                    </div>
                                </div>
                            )}
                            <div className={`text-[0.8125rem] opacity-90 ${property.status?.toLowerCase() === 'rent' ? 'mt-4' : 'mt-1'}`}>
                                Available for {property.status?.toLowerCase() === 'rent' ? 'Rent' : 'Sale'}
                            </div>
                        </div>

                        {/* Seller & Contact */}
                        <div className="bg-white p-6 rounded-[1.5rem] border border-[#f1f5f9] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-[#f1f5f9]">
                                    <img src={property.seller?.profilePic || `https://ui-avatars.com/api/?name=${property.seller?.name || 'Seller'}&background=0d6e59&color=fff`} alt="Agent" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <Link to={`/seller/${property.seller?._id}`} className="no-underline">
                                        <h4 className="text-base font-extrabold m-0 text-text-main transition-colors duration-200 hover:text-primary">{property.seller?.name || 'Seller'}</h4>
                                    </Link>
                                    <div className="flex items-center gap-1 text-[0.75rem] text-primary font-bold mt-2">
                                        <HiBadgeCheck /> Verified Seller
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <button
                                    className="btn btn-outline flex-1 p-2.5 text-[0.875rem] flex items-center justify-center gap-2"
                                    onClick={handleChatStart}
                                >
                                    <HiChatAlt /> Chat
                                </button>
                            </div>

                            {/* Inquiry Form */}
                            <h4 className="text-[0.9375rem] font-bold mb-4">Inquire</h4>
                            <form onSubmit={handleInquirySubmit}>
                                {user?.role === 'buyer' ? (
                                    <>
                                        <textarea
                                            placeholder="Your Message..."
                                            value={inquiry.message}
                                            onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                                            className="w-full h-[100px] p-3 rounded-xl border border-[#e2e8f0] mb-4 outline-none resize-none text-[0.875rem]"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-full p-3.5 rounded-xl font-bold"
                                            disabled={inquiryStatus.loading}
                                        >
                                            {inquiryStatus.loading ? 'Sending...' : 'Send Inquiry'}
                                        </button>
                                        {inquiryStatus.success && <p className="text-green-600 text-xs mt-2 text-center">Inquiry sent!</p>}
                                    </>
                                ) : (
                                    <div className="text-center p-4 bg-[#f8fafc] rounded-xl">
                                        <p className="text-[0.875rem] text-[#64748b]">
                                            {user ? 'Only buyers can send inquiries.' : 'Please login as a buyer to send inquiries.'}
                                        </p>
                                        {!user && <Link to="/login" className="btn btn-primary mt-2 w-full block">Login</Link>}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Additional Details Box */}
                <div className="additional-details bg-white p-8 rounded-[1.5rem] border border-[#f1f5f9] mt-12">
                    <h3 className="text-xl font-bold mb-6 border-b border-[#f1f5f9] pb-3">
                        Property Details
                    </h3>
                    <div className="details-grid-row grid grid-cols-2 gap-8 max-sm:grid-cols-1 max-sm:gap-0">
                        {[
                            { label: 'Property ID', value: property._id.slice(-8).toUpperCase() },
                            { label: 'Added On', value: new Date(property.createdAt).toLocaleDateString() },
                            { label: 'Property Type', value: property.propertyType },
                            { label: 'Status', value: `For ${property.status}` }
                        ].map((detail, i) => (
                            <div key={i} className="flex justify-between py-2 border-b border-dashed border-[#f1f5f9]">
                                <span className="text-[#64748b] text-[0.875rem]">{detail.label}</span>
                                <span className="text-text-main font-semibold capitalize">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Properties */}
                <section className="mt-16">
                    <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
                        <div>
                            <h2 className="text-[1.75rem] font-extrabold mb-1">Similar Properties</h2>
                            <p className="text-[#64748b] text-[0.9375rem]">Listings you might like in {property.city}.</p>
                        </div>
                        <Link to="/properties" className="btn btn-outline flex items-center gap-2 py-2.5 px-5 text-[0.875rem]">
                            All Listings <HiChevronRight />
                        </Link>
                    </div>
                    <div className="similar-grid grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                        {similarProperties.length > 0 ? (
                            similarProperties.slice(0, 3).map(p => (
                                <PropertyCard key={p._id} property={p} />
                            ))
                        ) : (
                            <div className="col-span-full p-12 bg-[#f8fafc] rounded-[1.5rem] text-center border border-dashed border-[#e2e8f0] text-[#64748b]">
                                No similar properties found in this location.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PropertyDetails;

const HiCalendarTag = () => <HiCalendar />;
