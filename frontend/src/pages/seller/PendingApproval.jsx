import React, { useEffect, useState } from 'react';
import { HiOutlineClock, HiOutlineSupport, HiOutlineLogout, HiOutlineRefresh } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const PendingApproval = () => {
    const { logout, user, refreshUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // Auto-refresh every 10 seconds while on this page
    useEffect(() => {
        const interval = setInterval(() => {
            refreshUser();
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [refreshUser]);

    const handleManualRefresh = async () => {
        setRefreshing(true);
        await refreshUser();
        setTimeout(() => setRefreshing(false), 1000); // Slight delay for UX
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 8px 16px rgba(217, 119, 6, 0.1)',
                animation: 'pulse 2s infinite'
            }}>
                <HiOutlineClock size={48} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Approval Pending</h1>
            <p style={{ maxWidth: '500px', color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                Hello {user?.name}, your seller account is currently under review by our administration team.
                Approval usually takes less than 24 hours. You'll gain full dashboard access once verified.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/properties" style={{
                    padding: '0.875rem 1.5rem',
                    borderRadius: '0.75rem',
                    background: 'var(--primary)',
                    color: 'white',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.2)',
                    transition: 'all 0.3s ease'
                }}>
                    Browse Properties
                </a>

                <button
                    onClick={handleManualRefresh}
                    disabled={refreshing}
                    style={{
                        padding: '0.875rem 1.5rem',
                        borderRadius: '0.75rem',
                        background: '#eef2ff',
                        border: '1px solid #e0e7ff',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <HiOutlineRefresh size={20} className={refreshing ? 'spin-anim' : ''} />
                    {refreshing ? 'Checking...' : 'Check Status Now'}
                </button>
            </div>

            <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <HiOutlineSupport size={18} />
                Need help? <a href="mailto:support@realestate.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Contact Support</a>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin-anim {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default PendingApproval;
