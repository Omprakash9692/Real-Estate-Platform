import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from "../../config";
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import ReviewSection from '../../components/ReviewSection';
import { HiStar, HiBadgeCheck, HiMail, HiCalendar } from "react-icons/hi";

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
    if (!seller) return <div className="container p-16 text-center">Seller not found</div>;

    return (
        <div className="bg-[#fdfdfd] min-h-screen pb-24">
            <Navbar />

            <div className="container fade-in pt-12">
                {/* Header Profile Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#f1f5f9] mb-12 flex flex-wrap gap-10 items-center justify-center sm:justify-start text-center sm:text-left">
                    <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-[#f1f5f9]">
                        <img
                            src={seller.profilePic || `https://ui-avatars.com/api/?name=${seller.name}&background=0d6e59&color=fff&size=150`}
                            alt={seller.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-[300px]">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-extrabold text-text-main m-0">{seller.name}</h1>
                            <HiBadgeCheck size={28} className="text-primary" />
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-6 mb-6 text-[#64748b]">
                            <div className="flex items-center gap-2">
                                <HiStar className="text-[#eab308]" size={20} />
                                <span className="font-bold text-text-main">{stats.avgRating}</span>
                                <span>({stats.totalReviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiCalendar size={20} />
                                <span>Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-center sm:justify-start gap-4">
                            <a href={`mailto:${seller.email}`} className="btn btn-outline flex items-center gap-2">
                                <HiMail /> Email Seller
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
                    {/* Left Side: Properties */}
                    <div>
                        <h2 className="text-[1.75rem] font-extrabold mb-8">Properties by this Seller</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                            {properties.length > 0 ? (
                                properties.map(property => (
                                    <PropertyCard key={property._id} property={property} />
                                ))
                            ) : (
                                <div className="col-span-full p-12 bg-[#f8fafc] rounded-3xl text-center border font-dashed border-[#e2e8f0]">
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
        </div>
    );
};

export default SellerProfile;
