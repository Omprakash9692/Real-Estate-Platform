import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLibrary } from 'react-icons/hi';

const Logo = ({ fontSize = '1.5rem', iconSize = 24, showText = true, ...props }) => {
    return (
        <Link to="/" {...props} className={`font-bold text-primary flex items-center gap-3 no-underline whitespace-nowrap ${props.className || ''}`} style={{ fontSize, ...props.style }}>
            <div className="bg-primary text-white p-2 rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(13,110,89,0.2)]">
                <HiOutlineLibrary size={iconSize} />
            </div>
            {showText && (
                <span className="tracking-[-0.02em] text-[#0d6e59] font-extrabold">
                    RealEstate
                </span>
            )}
        </Link>
    );
};

export default Logo;
