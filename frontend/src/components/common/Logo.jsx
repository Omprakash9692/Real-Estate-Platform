import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLibrary } from 'react-icons/hi';

const Logo = ({ fontSize = '1.5rem', iconSize = 24, showText = true, ...props }) => {
    return (
        <Link to="/" {...props} style={{
            fontSize: fontSize,
            fontWeight: 700,
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            ...props.style
        }}>
            <div style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(13, 110, 89, 0.2)'
            }}>
                <HiOutlineLibrary size={iconSize} />
            </div>
            {showText && (
                <span style={{
                    letterSpacing: '-0.02em',
                    color: '#0d6e59', // Match the teal color from the image
                    fontWeight: 800
                }}>
                    RealEstate
                </span>
            )}
        </Link>
    );
};

export default Logo;
