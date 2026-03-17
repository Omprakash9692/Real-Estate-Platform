import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlinePencilAlt, HiOutlineTrash, HiExternalLink, HiEye, HiOutlineLibrary, HiOutlineCheckCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/common/PropertyCard';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const fetchMyProperties = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/property/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const props = Array.isArray(res.data) ? res.data : (res.data.properties || []);
            setProperties(props);
            setLoading(false);
        } catch (err) {
            setError('Failed to load your properties.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`${API_URL}/api/property/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete property.');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`${API_URL}/api/property/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    const getAvailableStatus = (p) => {
        return 'sale';
    };

    return (
        <div className="fade-in">
            <div className="fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 flex-wrap gap-6 my-props-header text-left">
                    <div>
                        <h1 className="text-[1.75rem] font-extrabold text-text-main mb-1">My Listings</h1>
                        <p className="text-text-muted text-[0.9375rem]">Manage your listed properties and their status.</p>
                    </div>
                    <Link to="/add-property" className="btn btn-primary py-3 px-6 rounded-xl font-bold w-full md:w-auto text-center">
                        Add New Listing
                    </Link>
                </div>

                <div className="mb-8">
                    {!Array.isArray(properties) || properties.length === 0 ? (
                        <div className="card-premium py-24 px-8 text-center">
                            <div className="bg-[#f8fafc] w-[80px] h-[80px] rounded-full flex items-center justify-center mx-auto mb-8">
                                <HiOutlineLibrary size={40} color="#94a3b8" />
                            </div>
                            <h2 className="mb-4 text-2xl font-bold text-text-main">No properties found</h2>
                            <p className="text-[#64748b] mb-8">Start your journey by adding your first property listing.</p>
                            <Link to="/add-property" className="btn btn-primary">Add Your First Listing</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 justify-items-center">
                            {properties.map((p) => (
                                <PropertyCard
                                    key={p._id}
                                    property={p}
                                    renderActions={() => (
                                        <>
                                            <div className="flex-1 flex gap-2 items-center">
                                                <div className="flex-1 relative">
                                                    <select
                                                        value={p.status === 'sale' ? 'available' : p.status}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === 'available') {
                                                                updateStatus(p._id, getAvailableStatus(p));
                                                            } else {
                                                                updateStatus(p._id, val);
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        className={`w-full py-2.5 pr-8 pl-3 text-[0.8125rem] font-semibold rounded-lg border border-[#e2e8f0] bg-white appearance-none cursor-pointer outline-none ${p.status === 'sold' ? 'text-[#ef4444]' : 'text-[#10b981]'}`}
                                                    >
                                                        <option value="available">Available</option>
                                                        <option value="sold">Sold</option>
                                                    </select>
                                                    <div className="absolute right-[0.8rem] top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                                                        <HiOutlineCheckCircle size={14} />
                                                    </div>
                                                </div>
                                                <Link to={`/edit-property/${p._id}`} className="btn btn-outline p-2.5 text-[0.8125rem] flex items-center justify-center gap-1.5 border border-[#e2e8f0]">
                                                    <HiOutlinePencilAlt /> Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
                                                    className="btn p-2.5 text-[0.8125rem] bg-[#fff5f5] text-[#ef4444] border border-[#fee2e2] flex items-center justify-center gap-1.5 transition-colors hover:bg-[#fee2e2]"
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProperties;