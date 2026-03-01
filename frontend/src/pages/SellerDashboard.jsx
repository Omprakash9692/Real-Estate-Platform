import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";
import PropertyCard from '../components/PropertyCard';
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
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
    const { logout } = useAuth();
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
                const token = localStorage.getItem('token');
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
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`${API_URL}/api/property/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProperties(properties.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete property.');
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
        { title: 'Total Views', value: stats.totalViews?.toLocaleString() || '0', icon: HiOutlineEye, trend: '+0.0%', color: '#0d6e59' },
        { title: 'Active Leads', value: stats.totalInquiries?.toLocaleString() || '0', icon: HiOutlineUserGroup, trend: '+0.0%', color: '#0d6e59' },
        { title: 'Live Listings', value: stats.activeListings?.toLocaleString() || '0', icon: HiOutlineLibrary, trend: '0.0%', color: '#0d6e59' },
        { title: 'Properties Sold', value: stats.soldProperties?.toLocaleString() || '0', icon: HiOutlineCheckCircle, trend: '+0.0%', color: '#0d6e59' },
    ];

    const filteredProperties = Array.isArray(properties) ? properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.area.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <>
            {/* Header */}
            <header className="dashboard-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div style={{ minWidth: '280px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Seller Dashboard</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Manage your property portfolio and track performance.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleExport}
                        className="btn btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, flex: '1', justifyContent: 'center', whiteSpace: 'nowrap' }}
                    >
                        <HiOutlineDownload size={20} /> Export
                    </button>
                    <Link to="/add-property" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, padding: '0.75rem 1.25rem', flex: '1', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                        <HiPlus size={20} /> Add New
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '3rem'
            }}>
                {statCards.map((card, i) => (
                    <div key={i} style={{
                        background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '0.75rem', background: '#f1f5f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color
                            }}>
                                <card.icon size={20} />
                            </div>
                            <div style={{
                                fontSize: '0.7rem', fontWeight: 700,
                                color: card.trendDown ? '#ef4444' : '#10b981',
                                display: 'flex', alignItems: 'center', gap: '0.2rem',
                                background: card.trendDown ? '#fef2f2' : '#f0fdf4',
                                padding: '0.2rem 0.5rem', borderRadius: '2rem'
                            }}>
                                {card.trend}
                            </div>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.15rem' }}>{card.title}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Listings Section */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Property Listings</h2>
                    <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
                        <HiOutlineSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0',
                                outline: 'none', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="card-premium" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No properties found matching "{searchTerm}".
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        justifyItems: 'center'
                    }}>
                        {filteredProperties.map((p) => (
                            <PropertyCard
                                key={p._id}
                                property={p}
                                renderActions={() => (
                                    <div style={{ flex: 1, display: 'flex', gap: '0.4rem' }}>
                                        <Link to={`/edit-property/${p._id}`} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                            <HiOutlinePencilAlt size={14} /> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(p._id)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                            <HiOutlineTrash size={14} /> Delete
                                        </button>
                                        <Link to={`/property/${p._id}`} className="btn btn-primary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <HiExternalLink size={14} />
                                        </Link>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Widgets Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                {/* Recent Inquiries */}
                <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Recent Lead Inquiries</h2>
                    <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>New messages from potential buyers.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {inquiries.map((inq, i) => (
                            <div key={inq._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                        <HiOutlineBell size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{inq.buyer?.name || 'Potential Buyer'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inq.property?.title?.length > 30 ? inq.property?.title?.slice(0, 30) + '...' : inq.property?.title}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flex: '1' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.15rem' }}>{new Date(inq.createdAt).toLocaleDateString()}</div>
                                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: inq.status === 'read' ? '#f1f5f9' : 'var(--primary-light)', color: inq.status === 'read' ? '#64748b' : 'var(--primary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {inq.status === 'read' ? 'Read' : 'New'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {inquiries.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>No recent inquiries.</p>}
                    </div>
                </div>

                {/* Quick Tips */}
                <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Quick Tips</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: '#f0fdfa', padding: '1rem', borderRadius: '1rem', border: '1px solid #ccfbf1' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <HiOutlineEye size={16} /> High Views!
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#134e4a', lineHeight: '1.5' }}>
                                Your listings are trending. Try adding video tours to increase interest.
                            </p>
                        </div>

                        <div style={{ padding: '1rem', borderRadius: '1rem', background: '#f9fafb' }}>
                            <h4 style={{ color: '#4b5563', marginBottom: '0.25rem', fontWeight: 700, fontSize: '0.875rem' }}>Market Insight</h4>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
                                Properties in your area are selling fast. Your prices are competitive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1.5rem !important;
                    }
                    .dashboard-header > div {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .stats-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 1rem !important;
                    }
                }
                @media (max-width: 640px) {
                    .stats-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 480px) {
                    .dashboard-header h1 {
                        font-size: 1.5rem !important;
                    }
                }
            `}</style>
        </>
    );
};

export default SellerDashboard;
