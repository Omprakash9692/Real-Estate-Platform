import React, { useState } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiCheck, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            data.append('address', formData.address);
            if (imageFile) {
                data.append('profilePic', imageFile);
            }

            const res = await axios.put(`${API_URL}/api/user/profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                const updatedUser = res.data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
                setImageFile(null);
                setImagePreview(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: user?.role !== 'seller' ? 'var(--bg-alt)' : 'transparent', minHeight: user?.role !== 'seller' ? '100vh' : 'auto' }}>
            {user?.role !== 'seller' && <Navbar />}
            <div className="container fade-in" style={{ maxWidth: '800px', margin: user?.role !== 'seller' ? '0 auto' : '0', paddingTop: user?.role !== 'seller' ? '3rem' : '0', paddingBottom: '4rem' }}>
                <header className="profile-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Personal Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and account settings.</p>
                </header>

                <div className="card-premium profile-card" style={{ padding: '3rem' }}>
                    <div className="profile-info-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div className="profile-avatar" style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '2.5rem',
                                background: 'var(--primary-light)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                border: '4px solid white',
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.name?.[0].toUpperCase()
                                )}
                            </div>
                            {isEditing && (
                                <label style={{
                                    position: 'absolute',
                                    bottom: '-10px',
                                    right: '-10px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                    border: '3px solid white'
                                }}>
                                    <input type="file" onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                                    <HiOutlineUser size={20} />
                                </label>
                            )}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
                            <span className="badge badge-sale" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                                {user?.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.75rem', marginBottom: '2rem' }}>{error}</div>}

                    {isEditing ? (
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none' }}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', height: '100px', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'none' }}
                                    placeholder="Enter your full address"
                                ></textarea>
                            </div>
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <HiCheck size={20} /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <HiX size={20} /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <HiOutlineMail size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Email Address</div>
                                    <div style={{ fontWeight: 600 }}>{user?.email}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <HiOutlinePhone size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Phone Number</div>
                                    <div style={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <HiOutlineLocationMarker size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Location / Address</div>
                                    <div style={{ fontWeight: 600 }}>{user?.address || 'Not provided'}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
                                    Edit Profile Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .profile-header {
                        text-align: center !important;
                        margin-bottom: 2rem !important;
                    }
                    .profile-header h1 {
                        font-size: 2rem !important;
                    }
                    .profile-card {
                        padding: 1.5rem !important;
                    }
                    .profile-info-header {
                        flex-direction: column !important;
                        text-align: center !important;
                        gap: 1rem !important;
                        margin-bottom: 2.5rem !important;
                    }
                    .form-actions {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
