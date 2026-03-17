import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiSearch, HiFilter, HiAdjustments, HiViewGrid, HiViewList, HiOutlineChevronDown, HiX } from "react-icons/hi";
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from '../../components/common/PropertyCard';
import Navbar from '../../components/common/Navbar';

const Properties = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
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
        if (user) {
            fetchWishlist();
        }
    }, [location.search, user]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistedIds(res.data.filter(item => item.property).map(item => String(item.property._id)));
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistedIds(prev => prev.filter(id => id !== propertyId));
            } else {
                await axios.post(`${API_URL}/api/wishlist/${propertyId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistedIds(prev => [...prev, propertyId]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

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

    // Debounce timer for search and price slider
    const fetchTimer = React.useRef(null);

    const debouncedFetch = (updatedFilters) => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchTimer.current = setTimeout(() => {
            fetchProperties(updatedFilters);
        }, 500);
    };

    const handleCheckboxChange = (category, value) => {
        const current = [...(filters[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }
        const updatedFilters = { ...filters, [category]: current };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters); // Instant update for discrete toggle
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        const updatedFilters = { ...filters, maxPrice: value };
        setFilters(updatedFilters);
        debouncedFetch(updatedFilters); // Debounced to prevent spam while sliding
    };

    const handleBhkSelect = (value) => {
        const updatedFilters = { ...filters, bhk: filters.bhk === value ? '' : value };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters); // Instant update for discrete toggle
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        const updatedFilters = { ...filters, sort: newSort };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const applyFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchProperties(filters);
    };

    const resetFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        const reset = { city: '', propertyType: [], bhk: '', maxPrice: 100000000, amenities: [], furnishing: [], sort: 'latest' };
        setFilters(reset);
        navigate('/properties');
        fetchProperties(reset);
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-16">
            <Navbar />

            <div className="container pt-4">
                {/* Mobile Filter Toggle */}
                <div className="mobile-filter-btn hidden mb-6 max-[1024px]:block">
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="btn btn-outline w-full flex justify-center gap-3 bg-white py-4"
                    >
                        <HiFilter /> Show Filters & Search
                    </button>
                </div>

                <div className="properties-layout grid grid-cols-[minmax(280px,300px)_1fr] gap-8 max-[1024px]:grid-cols-1">

                    {/* Sidebar Filters */}
                    <aside className={`filters-sidebar bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-h-[calc(100vh-120px)] overflow-y-auto sticky top-[100px] border border-[#f1f5f9] z-[90] max-[1024px]:fixed max-[1024px]:max-h-screen max-[1024px]:top-0 max-[1024px]:bottom-0 max-[1024px]:w-full max-[1024px]:max-w-[350px] max-[1024px]:rounded-none max-[1024px]:transition-[left] max-[1024px]:duration-300 max-[1024px]:ease ${showMobileFilters ? 'max-[1024px]:left-0' : 'max-[1024px]:-left-full'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                                <HiFilter className="text-primary" />
                                <h2 className="text-xl font-bold m-0">Filters</h2>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={resetFilters}
                                    className="bg-transparent border-none text-primary text-sm font-semibold cursor-pointer"
                                >
                                    Reset
                                </button>
                                <button
                                    className="mobile-close-filters hidden max-[1024px]:flex items-center justify-center bg-[#f1f5f9] border-none p-2 rounded-full cursor-pointer"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    <HiX />
                                </button>
                            </div>
                        </div>

                        <div className="filters-scroll-area">
                            {/* Location */}
                            <div className="mb-8">
                                <label className="block font-bold mb-3 text-[0.9375rem]">Location</label>
                                <div className="relative">
                                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                                    <input
                                        type="text"
                                        placeholder="Search location..."
                                        value={filters.city}
                                        onChange={(e) => {
                                            const updatedFilters = { ...filters, city: e.target.value };
                                            setFilters(updatedFilters);
                                            debouncedFetch(updatedFilters);
                                        }}
                                        className="w-full py-3 pr-4 pl-10 rounded-xl border border-[#e2e8f0] outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="font-bold text-[0.9375rem]">Price Range</label>
                                    <span className="text-primary font-bold text-[0.875rem]">
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
                                    className="w-full accent-primary cursor-pointer"
                                />
                                <div className="flex justify-between mt-2 text-[#94a3b8] text-[0.75rem]">
                                    <span>₹1L</span>
                                    <span>₹10Cr</span>
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="mb-8">
                                <label className="block font-bold mb-4 text-[0.9375rem]">Property Type</label>
                                <div className="flex flex-col gap-3">
                                    {propertyTypes.map(type => (
                                        <label key={type.value} className="flex items-center gap-3 cursor-pointer text-sm text-[#64748b]">
                                            <input
                                                type="checkbox"
                                                checked={filters.propertyType.includes(type.value)}
                                                onChange={() => handleCheckboxChange('propertyType', type.value)}
                                                className="w-[18px] h-[18px] cursor-pointer accent-primary"
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* BHK */}
                            <div className="mb-8">
                                <label className="block font-bold mb-4 text-[0.9375rem]">BHK (Bedrooms)</label>
                                <div className="flex flex-wrap gap-2">
                                    {bhkOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleBhkSelect(option)}
                                            className={`flex-1 min-w-[50px] p-2 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 ${filters.bhk === option
                                                ? 'border border-primary bg-primary-light text-primary-dark'
                                                : 'border border-[#e2e8f0] bg-white text-[#64748b]'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Furnishing */}
                            <div className="mb-8">
                                <label className="block font-bold mb-4 text-[0.9375rem]">Furnishing</label>
                                <div className="flex flex-col gap-3">
                                    {furnishingOptions.map(option => (
                                        <label key={option.value} className="flex items-center gap-3 cursor-pointer text-sm text-[#64748b]">
                                            <input
                                                type="checkbox"
                                                checked={filters.furnishing?.includes(option.value)}
                                                onChange={() => handleCheckboxChange('furnishing', option.value)}
                                                className="w-[18px] h-[18px] cursor-pointer accent-primary"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </aside>

                    {/* Main Content */}
                    <main>
                        {/* Header Section */}
                        <div className="content-header bg-white py-5 px-8 rounded-[1.25rem] mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex justify-between items-center border border-[#f1f5f9] max-[1024px]:p-4 max-[1024px]:flex-col max-[1024px]:gap-4 max-[1024px]:items-start">
                            <div>
                                <span className="text-[#64748b] text-[0.9375rem]">
                                    Showing <strong className="text-text-main">{loading ? '...' : properties.length}</strong> properties
                                </span>
                            </div>
                            <div className="view-controls flex items-center gap-6 max-[1024px]:w-full max-[1024px]:justify-between">
                                <div className="view-mode-toggle flex gap-2 p-1 bg-[#f1f5f9] rounded-xl max-sm:hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg border-none cursor-pointer ${viewMode === 'grid'
                                            ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-primary'
                                            : 'bg-transparent text-[#94a3b8]'
                                            }`}
                                    >
                                        <HiViewGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg border-none cursor-pointer ${viewMode === 'list'
                                            ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-primary'
                                            : 'bg-transparent text-[#94a3b8]'
                                            }`}
                                    >
                                        <HiViewList size={20} />
                                    </button>
                                </div>
                                <div className="sort-control flex items-center gap-2">
                                    <span className="text-sm text-[#64748b]">Sort:</span>
                                    <select
                                        value={filters.sort}
                                        onChange={handleSortChange}
                                        className="py-2 px-4 bg-white border border-[#e2e8f0] rounded-xl text-sm font-semibold cursor-pointer outline-none text-text-main appearance-auto"
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
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton h-[400px] rounded-[1.25rem]"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-16 text-center bg-white rounded-[1.5rem]">
                                <HiX size={48} className="text-red-500 mb-4 mx-auto" />
                                <h3 className="text-text-main mb-2">{error}</h3>
                                <button onClick={applyFilters} className="btn btn-outline">Try Again</button>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="py-24 px-8 text-center bg-white rounded-[1.5rem] border border-[#f1f5f9]">
                                <div className="w-[80px] h-[80px] bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HiAdjustments size={32} className="text-[#94a3b8]" />
                                </div>
                                <h2 className="text-2xl font-bold text-text-main mb-2">No properties found</h2>
                                <p className="text-[#64748b] max-w-[400px] mx-auto mb-8">Broaden your search criteria.</p>
                                <button onClick={resetFilters} className="btn btn-primary px-8 py-3">Clear All</button>
                            </div>
                        ) : (
                            <div className={`property-list ${viewMode} grid gap-6 ${viewMode === 'grid' ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))] max-sm:grid-cols-1 max-sm:justify-items-center' : 'grid-cols-1'}`}>
                                {properties.filter(p => p).map(p => (
                                    <PropertyCard
                                        key={p._id}
                                        property={p}
                                        isWishlisted={wishlistedIds.includes(String(p._id))}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {showMobileFilters && (
                <div
                    onClick={() => setShowMobileFilters(false)}
                    className="fixed inset-0 bg-black/50 z-80"
                />
            )}
        </div>
    );
};

export default Properties;
