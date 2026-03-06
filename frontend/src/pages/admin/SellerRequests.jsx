import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineCheckCircle, HiOutlineMail, HiOutlinePhone, HiOutlineClock } from "react-icons/hi";

const SellerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setRequests(res.data.pendingSellers);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load seller requests:', err);
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            const res = await axios.patch(`${API_URL}/api/admin/approve-seller/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRequests(requests.filter(req => req._id !== id));
                alert('Seller approved successfully!');
            }
        } catch (err) {
            alert('Failed to approve seller');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="seller-requests-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Seller Verification</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Review and approve new seller registration requests.</p>
            </div>

            <div className="card-premium">
                <div style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Pending Requests ({requests.length})</h2>

                    {requests.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <HiOutlineCheckCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No pending seller requests at the moment.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {requests.map((request) => (
                                <div key={request._id} className="request-card" style={{
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    background: '#f8fafc',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem' }}>
                                            {request.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{request.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <HiOutlineClock /> Joined {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                                            <HiOutlineMail size={18} color="var(--primary)" /> {request.email}
                                        </div>
                                        {request.phone && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                                                <HiOutlinePhone size={18} color="var(--primary)" /> {request.phone}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleApprove(request._id)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            border: 'none',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'transform 0.2s ease'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <HiOutlineCheckCircle size={20} />
                                        Approve Seller
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerRequests;
