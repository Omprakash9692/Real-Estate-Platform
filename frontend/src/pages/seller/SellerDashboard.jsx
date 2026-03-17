import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import PropertyCard from '../../components/common/PropertyCard';
import {
    HiOutlineEye,
    HiOutlineUserGroup,
    HiOutlineLibrary,
    HiOutlineCheckCircle,
    HiPlus,
    HiOutlineDownload,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlinePencilAlt,
    HiOutlineTrash,
    HiExternalLink,
    HiOutlineLogout,
    HiOutlineBell
} from "react-icons/hi";
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const { logout, token } = useAuth();
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeListings: 0,
        soldProperties: 0,
        totalInquiries: 0,
        totalViews: 0
    });
    const [properties, setProperties] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, propsRes, inqRes] = await Promise.all([
                    axios.get(`${API_URL}/api/property/seller/dashboard`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/property/my`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/inquiry/seller`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setStats(statsRes.data.stats || statsRes.data);
                const props = Array.isArray(propsRes.data) ? propsRes.data : (propsRes.data.properties || []);
                setProperties(props);
                setInquiries(Array.isArray(inqRes.data.inquiries) ? inqRes.data.inquiries.slice(0, 3) : (Array.isArray(inqRes.data) ? inqRes.data.slice(0, 3) : []));
                setLoading(false);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`${API_URL}/api/property/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete property.');
        }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === 'sold' ? 'sale' : 'sold';

        try {
            await axios.patch(`${API_URL}/api/property/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const handleExport = () => {
        const headers = ["Title", "Location", "Type", "Price", "Status", "Views"];
        const csvRows = properties.map(p => [
            p.title,
            `${p.area}, ${p.city}`,
            p.propertyType,
            p.price,
            p.status,
            p.views || 0
        ]);

        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "property_listings.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    const statCards = [
        { title: 'Total Views', value: stats.totalViews?.toLocaleString() || '0', icon: HiOutlineEye, color: '#0d6e59' },
        { title: 'Active Leads', value: stats.totalInquiries?.toLocaleString() || '0', icon: HiOutlineUserGroup, color: '#0d6e59' },
        { title: 'Live Listings', value: stats.activeListings?.toLocaleString() || '0', icon: HiOutlineLibrary, color: '#0d6e59' },
        { title: 'Properties Sold', value: stats.soldProperties?.toLocaleString() || '0', icon: HiOutlineCheckCircle, color: '#0d6e59' },
    ];

    const filteredProperties = Array.isArray(properties) ? properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.area.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    return (
        <>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start mb-8 flex-wrap gap-6 md:gap-6">
                <div className="min-w-0 w-full md:w-auto md:min-w-[280px]">
                    <h1 className="text-[1.5rem] sm:text-[1.75rem] font-extrabold text-text-main mb-1">Seller Dashboard</h1>
                    <p className="text-[#64748b] text-[0.9375rem]">Manage your property portfolio and track performance.</p>
                </div>
                <div className="flex gap-3 flex-wrap w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="btn btn-outline bg-white flex items-center gap-2 font-bold flex-1 justify-center whitespace-nowrap"
                    >
                        <HiOutlineDownload size={20} /> Export
                    </button>
                    <Link to="/add-property" className="btn btn-primary flex items-center gap-2 font-bold py-3 px-5 flex-1 justify-center whitespace-nowrap">
                        <HiPlus size={20} /> Add New
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 sm:gap-5 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-[1.25rem] border border-[#f1f5f9] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-start mb-5">
                            <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-[var(--card-color)]" style={{ '--card-color': card.color }}>
                                <card.icon size={20} />
                            </div>
                        </div>
                        <div className="text-[#64748b] text-[0.8125rem] font-semibold mb-1">{card.title}</div>
                        <div className="text-[1.5rem] font-extrabold text-text-main">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Listings Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className="text-[1.25rem] font-extrabold text-text-main">Property Listings</h2>
                    <div className="relative w-full max-w-[300px]">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-2.5 pr-4 pl-10 rounded-xl border border-[#e2e8f0] outline-none text-[0.875rem] w-full"
                        />
                    </div>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="card-premium py-16 text-center text-[#64748b]">
                        No properties found matching "{searchTerm}".
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 justify-items-center">
                            {filteredProperties.slice(0, 3).map((p) => (
                                <PropertyCard
                                    key={p._id}
                                    property={p}
                                    renderActions={() => (
                                        <div className="flex-1 flex gap-[0.4rem]">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(p._id, p.status); }}
                                                className={`btn btn-outline flex-1 p-2 text-[0.75rem] flex items-center justify-center gap-1 ${p.status === 'sold' ? 'text-primary border-primary hover:bg-primary-light' : 'text-[#64748b]'}`}
                                                title={p.status === 'sold' ? "Mark as Available" : "Mark as Sold"}
                                            >
                                                <HiOutlineCheckCircle size={14} /> {p.status === 'sold' ? 'Available' : 'Sold'}
                                            </button>
                                            <Link to={`/edit-property/${p._id}`} className="btn btn-outline flex-1 p-2 text-[0.75rem] flex items-center justify-center gap-1">
                                                <HiOutlinePencilAlt size={14} /> Edit
                                            </Link>
                                            <button onClick={() => handleDelete(p._id)} className="btn btn-outline flex-1 p-2 text-[0.75rem] text-[#ef4444] border-[#fee2e2] flex items-center justify-center gap-1 hover:bg-red-50">
                                                <HiOutlineTrash size={14} /> Delete
                                            </button>
                                            <Link to={`/property/${p._id}`} className="btn btn-primary p-2 flex items-center justify-center">
                                                <HiExternalLink size={14} />
                                            </Link>
                                        </div>
                                    )}
                                />
                            ))}
                        </div>

                        {filteredProperties.length > 3 && (
                            <div className="text-center mt-10">
                                <Link to="/my-properties" className="btn btn-outline py-3 px-10 font-extrabold text-[0.9rem] rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] inline-flex items-center gap-2">
                                    Show More Listings <HiOutlinePencilAlt size={18} style={{ transform: 'rotate(90deg)' }} />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bottom Widgets Grid */}
            {/* Bottom Widgets Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mb-8">
                {/* Recent Inquiries */}
                <div className="bg-white rounded-3xl border border-[#f1f5f9] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <h2 className="text-[1.125rem] font-extrabold text-text-main mb-1">Recent Lead Inquiries</h2>
                    <p className="text-[#64748b] text-[0.8125rem] mb-6">New messages from potential buyers.</p>

                    <div className="flex flex-col gap-5">
                        {inquiries.map((inq, i) => (
                            <div key={inq._id} className="flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-center gap-4 min-w-[200px]">
                                    <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                                        <HiOutlineBell size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[0.875rem] text-text-main">{inq.buyer?.name || 'Potential Buyer'}</div>
                                        <div className="text-[0.75rem] text-[#64748b]">{inq.property?.title?.length > 30 ? inq.property?.title?.slice(0, 30) + '...' : inq.property?.title}</div>
                                    </div>
                                </div>
                                <div className="text-right flex-1">
                                    <div className="text-[0.7rem] text-[#94a3b8] mb-0.5">{new Date(inq.createdAt).toLocaleDateString()}</div>
                                    <span className={`py-0.5 px-2 rounded-full text-[0.65rem] font-extrabold uppercase ${inq.status === 'read' ? 'bg-[#f1f5f9] text-[#64748b]' : 'bg-primary-light text-primary'}`}>
                                        {inq.status === 'read' ? 'Read' : 'New'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {inquiries.length === 0 && <p className="text-center text-[#64748b] p-4">No recent inquiries.</p>}
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-white rounded-3xl border border-[#f1f5f9] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <h2 className="text-[1.125rem] font-extrabold text-text-main mb-6">Quick Tips</h2>

                    <div className="flex flex-col gap-4">
                        <div className="bg-[#f0fdfa] p-4 rounded-2xl border border-[#ccfbf1]">
                            <h4 className="text-primary mb-1 flex items-center gap-2 text-[0.875rem]">
                                <HiOutlineEye size={16} /> High Views!
                            </h4>
                            <p className="text-[0.75rem] text-[#134e4a] leading-relaxed">
                                Your listings are trending. Try adding video tours to increase interest.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#f9fafb]">
                            <h4 className="text-[#4b5563] mb-1 font-bold text-[0.875rem]">Market Insight</h4>
                            <p className="text-[0.75rem] text-[#6b7280] leading-relaxed">
                                Properties in your area are selling fast. Your prices are competitive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerDashboard;
