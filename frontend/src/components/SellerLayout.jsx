import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import PendingApproval from '../pages/seller/PendingApproval';

const SellerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="dashboard-layout">
            <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="dashboard-main">
                <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="dashboard-content fade-in">
                    {user?.isApproved ? <Outlet /> : <PendingApproval />}
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
