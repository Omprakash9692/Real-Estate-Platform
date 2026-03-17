import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
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
    const { token } = useAuth();

    useEffect(() => {
        console.log('AdminDashboard mounted');
        const fetchDashboardData = async () => {
            try {
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
            <div className="flex justify-between items-start mb-8 flex-wrap gap-6">
                <div>
                    <h1 className="text-[1.75rem] font-extrabold text-text-main mb-1">Admin Overview</h1>
                    <p className="text-text-muted text-[0.9375rem]">Welcome back, administrator. Here's today's summary.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); window.location.reload(); }}
                    className="btn btn-outline py-[0.6rem] px-5 text-[0.875rem] bg-white"
                >
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className="card-premium p-6 flex flex-col gap-4">
                        <div className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                            <card.icon size={22} />
                        </div>
                        <div>
                            <div className="text-[0.8125rem] font-semibold text-text-muted mb-1">{card.title}</div>
                            <div className="text-[1.75rem] font-extrabold text-text-main">{card.value.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mb-8">
                <div className="card-premium p-6">
                    <h3 className="mb-5 text-[1.125rem] font-bold">System Health</h3>
                    <div className="flex flex-col gap-5">
                        {['Database', 'Media Storage', 'Auth Service', 'API Gateway'].map((service, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="text-[0.875rem] font-semibold">{service}</div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                                    <span className="text-[0.8125rem] text-[#10b981] font-bold">Online</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-premium p-6 bg-primary text-white">
                    <h3 className="mb-3 text-[1.125rem] font-bold">Admin Tools</h3>
                    <p className="text-[0.8125rem] mb-6 opacity-90">Quickly manage platform resources and tasks.</p>
                    <div className="flex flex-col gap-3">
                        <button className="btn bg-white/20 text-white w-full justify-start text-[0.875rem]">System Logs</button>
                        <button className="btn bg-white/20 text-white w-full justify-start text-[0.875rem]">DB Backup</button>
                        <button className="btn bg-white/20 text-white w-full justify-start text-[0.875rem]">Settings</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
