import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HiOutlineViewGrid,
    HiOutlineClipboardList,
    HiOutlineChartBar,
    HiOutlineUser,
    HiOutlineLogout
} from "react-icons/hi";
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const SellerSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navItems = [
        { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
        { name: 'My Listings', icon: HiOutlineClipboardList, path: '/my-properties' },
        { name: 'Leads', icon: HiOutlineChartBar, path: '/inquiries' },
        { name: 'Messages', icon: HiOutlineViewGrid, path: '/chat-messages' },
        { name: 'Profile', icon: HiOutlineUser, path: '/profile' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 950,
                    display: 'none',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease'
                }}
            />

            <aside
                className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    width: '260px',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    background: 'white',
                    borderRight: '1px solid #f1f5f9',
                    padding: '2rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    transition: 'transform 0.3s ease'
                }}>
                {/* Logo Section */}
                <div style={{ padding: '0 0.75rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Logo fontSize="1.25rem" iconSize={20} />
                </div>

                {/* Navigation items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1rem',
                                borderRadius: '0.75rem',
                                textDecoration: 'none',
                                fontSize: '0.9375rem',
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? 'var(--primary)' : '#64748b',
                                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            })}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: 'auto' }}>
                    <button
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className="sidebar-link"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: '#dc2626',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <HiOutlineLogout size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SellerSidebar;
