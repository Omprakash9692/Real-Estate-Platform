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
        // If it was already a rental mode, return rent, else sale
        if (p.status === 'rent' || p.status === 'rented') return 'rent';
        return 'sale';
    };

    return (
        <div className="fade-in">
            <div className="my-props-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>My Listings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Manage your listed properties and their status.</p>
                </div>
                <Link to="/add-property" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700 }}>
                    Add New Listing
                </Link>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                {!Array.isArray(properties) || properties.length === 0 ? (
                    <div className="card-premium" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ background: '#f8fafc', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <HiOutlineLibrary size={40} color="#94a3b8" />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>No properties found</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Start your journey by adding your first property listing.</p>
                        <Link to="/add-property" className="btn btn-primary">Add Your First Listing</Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        justifyItems: 'center'
                    }}>
                        {properties.map((p) => (
                            <PropertyCard
                                key={p._id}
                                property={p}
                                renderActions={() => (
                                    <>
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <select
                                                    value={p.status === 'sale' || p.status === 'rent' ? 'available' : p.status}
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
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.6rem 2rem 0.6rem 0.8rem',
                                                        fontSize: '0.8125rem',
                                                        fontWeight: 600,
                                                        borderRadius: '0.5rem',
                                                        border: '1px solid #e2e8f0',
                                                        background: 'white',
                                                        color: p.status === 'sold' || p.status === 'rented' ? '#ef4444' : '#10b981',
                                                        appearance: 'none',
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="sold">Sold</option>
                                                    <option value="rented">Rented</option>
                                                </select>
                                                <div style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
                                                    <HiOutlineCheckCircle size={14} />
                                                </div>
                                            </div>
                                            <Link to={`/edit-property/${p._id}`} className="btn btn-outline" style={{
                                                padding: '0.6rem',
                                                fontSize: '0.8125rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <HiOutlinePencilAlt /> Edit
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
                                                className="btn"
                                                style={{
                                                    padding: '0.6rem',
                                                    fontSize: '0.8125rem',
                                                    background: '#fff5f5',
                                                    color: '#ef4444',
                                                    border: '1px solid #fee2e2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.4rem'
                                                }}
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
            <style>{`
                @media (max-width: 768px) {
                    .my-props-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1rem !important;
                        text-align: left !important;
                    }
                    .my-props-header .btn {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyProperties;
