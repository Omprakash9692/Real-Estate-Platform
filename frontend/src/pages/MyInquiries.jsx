import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineChatAlt2, HiCalendar, HiCheckCircle, HiHome, HiExternalLink, HiUser, HiMail, HiPhone } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const MyInquiries = () => {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            if (!user) return;
            try {
                const endpoint = user?.role === 'seller' ? 'seller' : 'my';
                const res = await axios.get(`${API_URL}/api/inquiry/${endpoint}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                // Both endpoints now return { success: true, inquiries: [...] }
                setInquiries(res.data.inquiries || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching inquiries:', err);
                setError(err.response?.data?.message || 'Failed to load inquiries.');
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/inquiry/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
        } catch (err) {
            console.error('Failed to mark read');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    if (error) return (
        <div style={{ backgroundColor: user?.role !== 'seller' ? 'var(--bg-alt)' : 'transparent', minHeight: '100vh' }}>
            {user?.role !== 'seller' && <Navbar />}
            <div className="container py-12" style={{ textAlign: 'center' }}>
                <div className="card-premium" style={{ padding: '4rem 2rem' }}>
                    <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Error</h2>
                    <p style={{ marginBottom: '2rem' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
                </div>
            </div>
        </div>
    );

    const isSeller = user?.role === 'seller';

    return (
        <div style={{ backgroundColor: user?.role !== 'seller' ? 'var(--bg-alt)' : 'transparent', minHeight: user?.role !== 'seller' ? '100vh' : 'auto' }}>
            {user?.role !== 'seller' && <Navbar />}
            <div className={`container fade-in ${user?.role !== 'seller' ? 'py-12' : ''}`} style={{ paddingTop: user?.role !== 'seller' ? '3rem' : '0' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {isSeller ? 'Customer Inquiries' : 'My Inquiries'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isSeller ? 'Review and respond to interest in your properties.' : 'Track the status of your property inquiries.'}
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <div className="card-premium" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'var(--bg-alt)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--text-muted)' }}>
                            <HiOutlineChatAlt2 size={40} />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>No inquiries {isSeller ? 'received' : 'sent'}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {isSeller ? "You haven't received any inquiries yet. Better listings get more attention!" : "You haven't contacted any sellers yet. Interested in a property? Send an inquiry!"}
                        </p>
                        <Link to="/" className="btn btn-primary">
                            {isSeller ? 'Improve My Listings' : 'Discover Properties'}
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {inquiries.map((inq) => (
                            <div key={inq._id} className="card-premium inquiry-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                                <div className="inquiry-main-content" style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                                    <div className="inquiry-icon" style={{ backgroundColor: 'var(--primary-light)', padding: '1.25rem', borderRadius: '1.25rem', color: 'var(--primary)', height: 'fit-content' }}>
                                        <HiHome size={32} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem' }}>{inq.property?.title}</h3>
                                            <span className="badge" style={{
                                                backgroundColor: inq.isRead ? '#f3f4f6' : '#eff6ff',
                                                color: inq.isRead ? 'var(--text-muted)' : '#2563eb'
                                            }}>
                                                {inq.isRead ? 'READ' : 'NEW'}
                                            </span>
                                        </div>

                                        {isSeller && (
                                            <div className="buyer-info-grid" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--bg-alt)', borderRadius: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                    <HiUser className="text-muted" /> <span style={{ fontWeight: 600 }}>{inq.buyer?.name}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                    <HiMail className="text-muted" /> {inq.buyer?.email}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                    <HiPhone className="text-muted" /> {inq.buyer?.phone || 'No phone provided'}
                                                </div>
                                            </div>
                                        )}

                                        <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.25rem', paddingLeft: '1rem', borderLeft: '3px solid var(--border-color)' }}>
                                            "{inq.message}"
                                        </p>

                                        <div className="inquiry-meta" style={{ display: 'flex', gap: '2rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <HiCalendar size={16} /> {isSeller ? 'Received' : 'Sent'} on {new Date(inq.createdAt).toLocaleDateString()}
                                            </div>
                                            {!isSeller && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <HiCheckCircle size={16} /> {inq.isRead ? 'Seller viewed' : 'Waiting for seller'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="inquiry-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem', justifyContent: 'center' }}>
                                    <Link to={`/property/${inq.property?._id}`} className="btn btn-outline" style={{ gap: '0.5rem', whiteSpace: 'nowrap' }}>
                                        View Property <HiExternalLink />
                                    </Link>
                                    {isSeller && !inq.isRead && (
                                        <button onClick={() => markAsRead(inq._id)} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                            Mark as Read
                                        </button>
                                    )}
                                    {isSeller && (
                                        <a href={`mailto:${inq.buyer?.email}`} className="btn btn-primary" style={{ backgroundColor: '#2563eb' }}>
                                            Reply via Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 1024px) {
                    .inquiry-card {
                        flex-direction: column !important;
                        padding: 1.5rem !important;
                        gap: 1.5rem !important;
                    }
                    .inquiry-actions {
                        margin-left: 0 !important;
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                    }
                    .inquiry-actions > * {
                        flex: 1 !important;
                        min-width: 150px !important;
                    }
                }

                @media (max-width: 768px) {
                    .inquiry-main-content {
                        flex-direction: column !important;
                        gap: 1rem !important;
                    }
                    .buyer-info-grid {
                        flex-direction: column !important;
                        gap: 0.5rem !important;
                    }
                    .inquiry-meta {
                        flex-direction: column !important;
                        gap: 0.5rem !important;
                    }
                    h1 {
                        font-size: 1.75rem !important;
                        margin-bottom: 0.25rem !important;
                    }
                    .inquiry-icon {
                        padding: 0.75rem !important;
                        border-radius: 0.75rem !important;
                    }
                    .inquiry-icon svg {
                        width: 24px !important;
                        height: 24px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyInquiries;
