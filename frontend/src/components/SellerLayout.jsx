import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import DashboardNavbar from './DashboardNavbar';

const SellerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="dashboard-main">
                <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="dashboard-content fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
