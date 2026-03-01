import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineTrash, HiOutlineExternalLink, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineTag } from "react-icons/hi";
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/admin/properties`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const props = Array.isArray(res.data) ? res.data : (res.data.properties || []);
                setProperties(props);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load properties:', err);
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property? This action is permanent.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/admin/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete property');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Property Moderation</h1>
                <p style={{ color: 'var(--text-muted)' }}>Review and manage all property listings across the platform.</p>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                {properties.length === 0 ? (
                    <div className="card-premium" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No properties pending moderation.
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
                                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', flex: 1 }}>
                                            <div style={{ fontWeight: 700 }}>Seller: {p.seller?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.7rem' }}>{p.seller?.email}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <Link to={`/property/${p._id}`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                                                <HiOutlineExternalLink size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="btn"
                                                style={{ background: '#fef2f2', color: '#dc2626', padding: '0.5rem', border: '1px solid #fee2e2' }}
                                            >
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminProperties;
