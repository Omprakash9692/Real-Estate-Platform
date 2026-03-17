import React from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import Logo from './common/Logo';

const DashboardNavbar = ({ onMenuClick }) => {
    return (
        <header className="h-[64px] bg-white/70 backdrop-blur-[12px] border-b border-white/20 flex items-center px-4 sticky top-0 z-[900] w-full gap-4 md:hidden">
            <button
                onClick={onMenuClick}
                className="bg-primary/5 border-none text-primary cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            >
                <HiMenuAlt2 size={24} />
            </button>

            <div className="flex items-center overflow-hidden">
                <Logo fontSize="1.125rem" iconSize={18} />
            </div>
        </header>
    );
};

export default DashboardNavbar;
