import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HiOutlineViewGrid,
    HiOutlineClipboardList,
    HiOutlineChartBar,
    HiOutlineUser,
    HiOutlineSupport,
    HiOutlineLogout
} from "react-icons/hi";
import { useAuth } from '../context/AuthContext';
import Logo from './common/Logo';

const SellerSidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
        { name: 'My Listings', icon: HiOutlineClipboardList, path: '/my-properties' },
        { name: 'Leads', icon: HiOutlineChartBar, path: '/inquiries' },
        { name: 'Messages', icon: HiOutlineViewGrid, path: '/chat-messages' },
        { name: 'Profile', icon: HiOutlineUser, path: '/profile' },
        { name: 'Support', icon: HiOutlineSupport, path: '/contact' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 w-full h-full bg-black/30 backdrop-blur-sm z-[950] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible hidden md:block'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 w-[260px] h-screen bg-white border-r border-[#f1f5f9] py-8 px-5 flex flex-col z-[1000] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Logo Section */}
                <div className="px-3 mb-10 flex justify-between items-center">
                    <Logo fontSize="1.25rem" iconSize={20} />
                </div>

                {/* Navigation items */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-4 py-3.5 px-4 rounded-xl no-underline text-[0.9375rem] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? 'font-bold text-primary bg-primary-light' : 'font-medium text-[#64748b] hover:bg-gray-50'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="border-t border-[#f1f5f9] pt-6 mt-auto">
                    <button
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className="w-full flex items-center gap-4 py-3.5 px-4 rounded-xl border-none bg-transparent text-[0.9375rem] font-semibold text-[#dc2626] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-red-50"
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
