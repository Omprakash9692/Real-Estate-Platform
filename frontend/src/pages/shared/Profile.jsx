import React, { useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiCheck, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const Profile = () => {
    const { user, setUser, token } = useAuth();
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
        const { name, value } = e.target;
        if (name === 'phone') {
            // Only numbers, max 10
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
        <div className={user?.role !== 'seller' ? 'bg-bg-alt min-h-screen' : 'bg-transparent min-h-auto'}>
            {user?.role !== 'seller' && <Navbar />}
            <div className={`container fade-in max-w-[800px] mb-16 ${user?.role !== 'seller' ? 'mx-auto pt-12' : 'mx-0 pt-0'}`}>
                <header className="mb-12 md:text-center md:mb-8">
                    <h1 className="text-[2.5rem] mb-2 md:text-[2rem]">Personal Profile</h1>
                    <p className="text-text-muted">Manage your personal information and account settings.</p>
                </header>

                <div className="card-premium p-12 md:p-6">
                    <div className="flex items-center gap-8 mb-16 md:flex-col md:text-center md:gap-4 md:mb-10">
                        <div className="relative">
                            <div className="w-[120px] h-[120px] rounded-[2.5rem] bg-primary-light overflow-hidden flex items-center justify-center text-[3rem] font-bold text-primary border-4 border-white shadow-lg">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.[0].toUpperCase()
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-2.5 -right-2.5 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-4 border-white">
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                    <HiOutlineUser size={20} />
                                </label>
                            )}
                        </div>
                        <div>
                            <h2 className="text-[1.75rem] mb-1">{user?.name}</h2>
                            <span className="badge badge-sale bg-primary-light text-primary px-4 py-2 rounded-xl">
                                {user?.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl mb-8">{error}</div>}

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="flex flex-col gap-8">
                            <div>
                                <label className="block mb-2 text-sm font-semibold">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3.5 rounded-xl border border-border outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    pattern="\d*"
                                    className="w-full p-3.5 rounded-xl border border-border outline-none focus:border-primary transition-colors"
                                    placeholder="Enter your 10-digit phone number"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full h-[100px] p-3.5 rounded-xl border border-border outline-none resize-none focus:border-primary transition-colors"
                                    placeholder="Enter your full address"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 mt-4 md:flex-col">
                                <button type="submit" disabled={loading} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                                    <HiCheck size={20} /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline flex-1 flex items-center justify-center gap-2">
                                    <HiX size={20} /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-primary">
                                    <HiOutlineMail size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-text-muted mb-0.5">Email Address</div>
                                    <div className="font-semibold">{user?.email}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-primary">
                                    <HiOutlinePhone size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-text-muted mb-0.5">Phone Number</div>
                                    <div className="font-semibold">{user?.phone || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-primary">
                                    <HiOutlineLocationMarker size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-text-muted mb-0.5">Location / Address</div>
                                    <div className="font-semibold">{user?.address || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border">
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary px-10 py-3.5">
                                    Edit Profile Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
