import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiSearch, HiFilter, HiAdjustments, HiViewGrid, HiViewList, HiOutlineChevronDown, HiX } from "react-icons/hi";
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';

const Properties = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // Filter states
    const [filters, setFilters] = useState({
        city: '',
        propertyType: [],
        bhk: '',
        maxPrice: 100000000,
        amenities: [],
        furnishing: [],
        sort: 'latest'
    });

    const propertyTypes = [
        { label: 'Flat/Apartment', value: 'flat' },
        { label: 'Independent House/Villa', value: 'villa' },
        { label: 'Penthouse', value: 'penthouse' },
        { label: 'Commercial', value: 'commercial' }
    ];
    const bhkOptions = ['1', '2', '3', '4', '5+'];
    const amenitiesOptions = ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Play Area', 'Elevator'];
    const furnishingOptions = [
        { label: 'Furnished', value: 'furnished' },
        { label: 'Semi-Furnished', value: 'semi-furnished' },
        { label: 'Unfurnished', value: 'unfurnished' }
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const city = queryParams.get('city') || '';
        const type = queryParams.get('type') || '';
        const bhk = queryParams.get('bhk') || '';

        const initialFilters = {
            ...filters,
            city,
            propertyType: type ? [type] : [],
            bhk
        };

        setFilters(initialFilters);
        fetchProperties(initialFilters);
    }, [location.search]);

    const fetchProperties = async (currentFilters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentFilters.city) params.append('city', currentFilters.city);
            if (currentFilters.propertyType.length > 0) params.append('propertyType', currentFilters.propertyType.join(','));
            if (currentFilters.bhk) params.append('bhk', currentFilters.bhk);
            if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
            if (currentFilters.furnishing && currentFilters.furnishing.length > 0) params.append('furnishing', currentFilters.furnishing.join(','));
            if (currentFilters.sort) params.append('sort', currentFilters.sort);

            const res = await axios.get(`${API_URL}/api/property?${params.toString()}`);
            setProperties(res.data.properties);
            setError(null);
        } catch (err) {
            setError("Failed to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (category, value) => {
        const current = [...(filters[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }
        setFilters({ ...filters, [category]: current });
    };

    const handlePriceChange = (e) => {
        setFilters({ ...filters, maxPrice: parseInt(e.target.value) });
    };

    const handleBhkSelect = (value) => {
        setFilters({ ...filters, bhk: filters.bhk === value ? '' : value });
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        const updatedFilters = { ...filters, sort: newSort };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const applyFilters = () => {
        fetchProperties(filters);
    };

    const resetFilters = () => {
        const reset = { city: '', propertyType: [], bhk: '', maxPrice: 100000000, amenities: [], furnishing: [], sort: 'latest' };
        setFilters(reset);
        navigate('/properties');
        fetchProperties(reset);
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '1rem' }}>
                {/* Mobile Filter Toggle */}
                <div className="mobile-filter-btn" style={{ display: 'none', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="btn btn-outline"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem', background: 'white', py: '1rem' }}
                    >
                        <HiFilter /> Show Filters & Search
                    </button>
                </div>

                <div className="properties-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 300px) 1fr', gap: '2rem' }}>

                    {/* Sidebar Filters */}
                    <aside className={`filters-sidebar ${showMobileFilters ? 'show' : ''}`} style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '100px',
                        border: '1px solid #f1f5f9',
                        zIndex: 1001
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <HiFilter style={{ color: 'var(--primary)' }} />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Filters</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button
                                    onClick={resetFilters}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Reset
                                </button>
                                <button
                                    className="mobile-close-filters"
                                    onClick={() => setShowMobileFilters(false)}
                                    style={{ display: 'none', background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
                                >
                                    <HiX />
                                </button>
                            </div>
                        </div>

                        <div className="filters-scroll-area">
                            {/* Location */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <HiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        placeholder="Search location..."
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Price Range</label>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
                                        {filters.maxPrice >= 10000000
                                            ? `₹${(filters.maxPrice / 10000000).toFixed(2)} Cr`
                                            : `₹${(filters.maxPrice / 100000).toFixed(1)} L`}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="100000"
                                    max="100000000"
                                    step="500000"
                                    value={filters.maxPrice}
                                    onChange={handlePriceChange}
                                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                                    <span>₹1L</span>
                                    <span>₹10Cr</span>
                                </div>
                            </div>

                            {/* Property Type */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>Property Type</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {propertyTypes.map(type => (
                                        <label key={type.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}>
                                            <input
                                                type="checkbox"
                                                checked={filters.propertyType.includes(type.value)}
                                                onChange={() => handleCheckboxChange('propertyType', type.value)}
                                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* BHK */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>BHK (Bedrooms)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {bhkOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleBhkSelect(option)}
                                            style={{
                                                flex: '1 0 50px',
                                                padding: '0.5rem',
                                                borderRadius: '0.5rem',
                                                border: filters.bhk === option ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                                                background: filters.bhk === option ? 'var(--primary-light)' : 'white',
                                                color: filters.bhk === option ? 'var(--primary-dark)' : '#64748b',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Furnishing */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>Furnishing</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {furnishingOptions.map(option => (
                                        <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}>
                                            <input
                                                type="checkbox"
                                                checked={filters.furnishing?.includes(option.value)}
                                                onChange={() => handleCheckboxChange('furnishing', option.value)}
                                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    applyFilters();
                                    setShowMobileFilters(false);
                                }}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontWeight: 700 }}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main>
                        {/* Header Section */}
                        <div className="content-header" style={{
                            background: 'white',
                            padding: '1.25rem 2rem',
                            borderRadius: '1.25rem',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div>
                                <span style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                    Showing <strong style={{ color: 'var(--text-main)' }}>{loading ? '...' : properties.length}</strong> properties
                                </span>
                            </div>
                            <div className="view-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div className="view-mode-toggle" style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', background: '#f1f5f9', borderRadius: '0.75rem' }}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            background: viewMode === 'grid' ? 'white' : 'transparent',
                                            boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                            border: 'none',
                                            color: viewMode === 'grid' ? 'var(--primary)' : '#94a3b8',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <HiViewGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            background: viewMode === 'list' ? 'white' : 'transparent',
                                            boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                            border: 'none',
                                            color: viewMode === 'list' ? 'var(--primary)' : '#94a3b8',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <HiViewList size={20} />
                                    </button>
                                </div>
                                <div className="sort-control" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Sort:</span>
                                    <select
                                        value={filters.sort}
                                        onChange={handleSortChange}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.75rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            outline: 'none',
                                            color: 'var(--text-main)',
                                            appearance: 'auto'
                                        }}
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="priceLow">Price: Low to High</option>
                                        <option value="priceHigh">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Property Grid */}
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '1.25rem' }}></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '1.5rem' }}>
                                <HiX size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{error}</h3>
                                <button onClick={applyFilters} className="btn btn-outline">Try Again</button>
                            </div>
                        ) : properties.length === 0 ? (
                            <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <HiAdjustments size={32} style={{ color: '#94a3b8' }} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No properties found</h2>
                                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2rem' }}>Broaden your search criteria.</p>
                                <button onClick={resetFilters} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Clear All</button>
                            </div>
                        ) : (
                            <div className={`property-list ${viewMode}`} style={{
                                display: 'grid',
                                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
                                gap: '1.5rem'
                            }}>
                                {properties.map(p => (
                                    <PropertyCard key={p._id} property={p} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {showMobileFilters && (
                <div
                    onClick={() => setShowMobileFilters(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000
                    }}
                />
            )}

            <style>{`
                .skeleton {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 1024px) {
                    .properties-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .mobile-filter-btn {
                        display: block !important;
                    }
                    .filters-sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: -100% !important;
                        bottom: 0 !important;
                        width: 100% !important;
                        max-width: 350px !important;
                        border-radius: 0 !important;
                        transition: left 0.3s ease !important;
                        overflow-y: auto !important;
                    }
                    .filters-sidebar.show {
                        left: 0 !important;
                    }
                    .mobile-close-filters {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                    }
                    .content-header {
                        padding: 1rem !important;
                        flex-direction: column !important;
                        gap: 1rem !important;
                        align-items: flex-start !important;
                    }
                    .view-controls {
                        width: 100% !important;
                        justify-content: space-between !important;
                    }
                }

                @media (max-width: 640px) {
                    .view-mode-toggle {
                        display: none !important;
                    }
                    .property-list.grid {
                        grid-template-columns: 1fr !important;
                        justify-items: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Properties;
