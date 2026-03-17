import React, { useEffect, useState } from 'react';
import { HiOutlineClock, HiOutlineSupport, HiOutlineLogout, HiOutlineRefresh } from "react-icons/hi";
import { Link } from "react-router-dom";
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
            <div className="w-[100px] h-[100px] rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center mb-8 shadow-[0_8px_16px_rgba(217,119,6,0.1)] animate-pulse">
                <HiOutlineClock size={48} />
            </div>

            <h1 className="text-[2rem] font-extrabold text-[#1e293b] mb-4">Approval Pending</h1>
            <p className="max-w-[500px] text-[#64748b] text-[1.1rem] leading-relaxed mb-10">
                Hello {user?.name}, your seller account is currently under review by our administration team.
                Approval usually takes less than 24 hours. You'll gain full dashboard access once verified.
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
                <a href="/properties" className="py-3.5 px-6 rounded-xl bg-primary text-white font-bold no-underline flex items-center gap-2 shadow-[0_4px_12px_rgba(var(--primary-rgb),0.2)] transition-all duration-300">
                    Browse Properties
                </a>

                <button
                    onClick={handleManualRefresh}
                    disabled={refreshing}
                    className={`py-3.5 px-6 rounded-xl bg-[#eef2ff] border border-[#e0e7ff] text-primary font-bold flex items-center gap-2 transition-all duration-300 ${refreshing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <HiOutlineRefresh size={20} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Checking...' : 'Check Status Now'}
                </button>
            </div>

            <div className="mt-16 flex items-center gap-2 text-[#94a3b8] text-[0.9rem]">
                <HiOutlineSupport size={18} />
                Need help? <Link to="/contact" className="text-primary no-underline font-semibold">Contact Support</Link>
            </div>
        </div>
    );
};

export default PendingApproval;
