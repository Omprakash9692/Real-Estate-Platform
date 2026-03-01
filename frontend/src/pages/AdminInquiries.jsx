import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineUser, HiOutlineAnnotation, HiOutlineHome, HiOutlineCalendar } from "react-icons/hi";

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setInquiries(res.data.inquiries);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load inquiries:', err);
                setLoading(false);
            }
        };
        fetchInquiries();
    }, []);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Platform Inquiries</h1>
                <p style={{ color: 'var(--text-muted)' }}>Review communication between buyers and sellers.</p>
            </div>

            <div className="admin-inquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {inquiries.map((inq) => (
                    <div key={inq._id} className="card-premium inquiry-card-premium" style={{ padding: '2rem' }}>
                        <div className="inquiry-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                                    <HiOutlineHome size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{inq.property?.title || 'Unknown Property'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property ID: {inq.property?._id}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <HiOutlineCalendar style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> {new Date(inq.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="inquiry-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="detail-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Buyer Details</div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{inq.buyer?.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{inq.buyer?.email}</div>
                            </div>
                            <div className="detail-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Seller Details</div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{inq.seller?.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{inq.seller?.email}</div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-alt)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
                                <HiOutlineAnnotation /> MESSAGE
                            </div>
                            <p style={{ fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.6' }}>"{inq.message}"</p>
                        </div>
                    </div>
                ))}

                {inquiries.length === 0 && (
                    <div className="card-premium" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}><HiOutlineAnnotation size={48} /></div>
                        <h2>No inquiries found</h2>
                        <p style={{ color: 'var(--text-muted)' }}>There are no inquiries recorded on the platform yet.</p>
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .inquiry-card-premium {
                        padding: 1.5rem !important;
                    }
                }
                @media (max-width: 640px) {
                    .inquiry-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1rem !important;
                    }
                    .inquiry-header div:last-child {
                        text-align: left !important;
                        width: 100%;
                    }
                    .inquiry-details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                    .detail-box {
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminInquiries;
