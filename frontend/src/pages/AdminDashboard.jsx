import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";
import {
    HiOutlineUserGroup,
    HiOutlineLibrary,
    HiOutlineCheckCircle,
    HiOutlineTicket,
    HiOutlineTrendingUp,
    HiOutlineViewGrid
} from "react-icons/hi";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        activeListings: 0,
        soldProperties: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AdminDashboard mounted');
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load admin dashboard stats:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers || 0, icon: HiOutlineUserGroup, color: '#0d9488', bg: '#ccfbf1' },
        { title: 'Total Properties', value: stats.totalProperties || 0, icon: HiOutlineLibrary, color: '#f59e0b', bg: '#fef3c7' },
        { title: 'Active Listings', value: stats.activeListings || 0, icon: HiOutlineTicket, color: '#3b82f6', bg: '#dbeafe' },
        { title: 'Sold Properties', value: stats.soldProperties || 0, icon: HiOutlineCheckCircle, color: '#10b981', bg: '#dcfce7' },
    ];

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Admin Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Welcome back, administrator. Here's today's summary.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); window.location.reload(); }}
                    className="btn btn-outline"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', background: 'white' }}
                >
                    Refresh Data
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {statCards.map((card, i) => (
                    <div key={i} className="card-premium" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '0.875rem',
                            backgroundColor: card.bg,
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <card.icon size={22} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{card.title}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{card.value.toLocaleString()}</div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                            <HiOutlineTrendingUp /> +12% from last month
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                <div className="card-premium" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.125rem', fontWeight: 700 }}>System Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {['Database', 'Media Storage', 'Auth Service', 'API Gateway'].map((service, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{service}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                    <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 700 }}>Online</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-premium" style={{ padding: '1.5rem', background: 'var(--primary)', color: 'white' }}>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', fontWeight: 700 }}>Admin Tools</h3>
                    <p style={{ fontSize: '0.8125rem', marginBottom: '1.5rem', opacity: 0.9 }}>Quickly manage platform resources and tasks.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', width: '100%', justifyContent: 'flex-start', fontSize: '0.875rem' }}>System Logs</button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', width: '100%', justifyContent: 'flex-start', fontSize: '0.875rem' }}>DB Backup</button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', width: '100%', justifyContent: 'flex-start', fontSize: '0.875rem' }}>Settings</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
