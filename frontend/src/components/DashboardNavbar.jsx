import React from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import Logo from './Logo';

const DashboardNavbar = ({ onMenuClick }) => {
    return (
        <header style={{
            height: '64px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            width: '100%',
            gap: '1rem'
        }} className="dashboard-mobile-header">
            <button
                onClick={onMenuClick}
                style={{
                    background: 'rgba(13, 148, 136, 0.05)',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    flexShrink: 0
                }}
            >
                <HiMenuAlt2 size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <Logo fontSize="1.125rem" iconSize={18} />
            </div>
        </header>
    );
};

export default DashboardNavbar;
