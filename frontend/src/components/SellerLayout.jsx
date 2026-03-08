import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import PendingApproval from '../pages/seller/PendingApproval';

const SellerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    // Allow access to contact and profile pages even if not approved
    const isPublicDashboardRoute = ['/contact', '/profile'].includes(location.pathname);

    return (
        <div className="dashboard-layout">
            <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="dashboard-main">
                <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="dashboard-content fade-in">
                    {user?.isApproved || isPublicDashboardRoute ? <Outlet /> : <PendingApproval />}
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
