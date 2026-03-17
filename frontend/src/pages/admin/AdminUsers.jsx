import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineTrash, HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineMail, HiOutlineIdentification } from "react-icons/hi";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUsers(res.data.users);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load users:', err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleBlock = async (id, currentStatus) => {
        try {
            const res = await axios.patch(`${API_URL}/api/admin/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setUsers(users.map(u => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u));
            }
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <>
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-[1.75rem] font-extrabold text-text-main mb-1">User Management</h1>
                    <p className="text-text-muted text-[0.875rem]">Monitor platform users and access levels.</p>
                </div>
            </div>

            <div className="card-premium overflow-hidden mb-8 p-0">
                <div className="pt-6 px-6 pb-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[1.25rem] font-extrabold text-text-main">Platform Users</h2>
                    </div>
                </div>

                <div className="overflow-x-auto touch-pan-x">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead className="bg-[#f8fafc] text-[#64748b] text-[0.7rem] font-bold uppercase tracking-[0.05em]">
                            <tr className="border-b border-[#f1f5f9]">
                                <th className="py-4 px-6 text-left">User Info</th>
                                <th className="py-4 px-6 text-center">Role</th>
                                <th className="py-4 px-6 text-left">Contact Details</th>
                                <th className="py-4 px-6 text-center">Account Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-[#f1f5f9]">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[0.9375rem]">{user.name}</div>
                                                <div className="text-[0.75rem] text-text-muted">ID: {user._id.slice(-8).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[0.75rem] font-bold uppercase ${user.role === 'admin' ? 'bg-[#fef3c7] text-[#92400e]' : (user.role === 'seller' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#dbeafe] text-[#1e40af]')}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-[0.875rem] flex items-center gap-2 text-text-main"><HiOutlineMail color="#94a3b8" /> {user.email}</div>
                                            {user.phone && <div className="text-[0.875rem] flex items-center gap-2 text-text-main"><HiOutlineIdentification color="#94a3b8" /> {user.phone}</div>}
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        {user.isBlocked ? (
                                            <span className="text-[#dc2626] text-[0.8125rem] font-bold inline-flex items-center gap-1.5 justify-center bg-[#fff5f5] py-1 px-2 rounded-lg border border-[#fee2e2]">
                                                <HiOutlineLockClosed size={14} /> Suspended
                                            </span>
                                        ) : (
                                            <span className="text-[#10b981] text-[0.8125rem] font-bold inline-flex items-center gap-1.5 justify-center bg-[#f0fdf4] py-1 px-2 rounded-lg border border-[#dcfce7]">
                                                <HiOutlineLockOpen size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-6 px-6 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleBlock(user._id, user.isBlocked)}
                                                className={`w-9 h-9 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer ${user.isBlocked ? 'text-[#10b981]' : 'text-[#f59e0b]'} hover:bg-gray-50`}
                                                title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                            >
                                                {user.isBlocked ? <HiOutlineLockOpen size={18} /> : <HiOutlineLockClosed size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="w-9 h-9 rounded-lg border-none bg-[#fef2f2] text-[#dc2626] flex items-center justify-center cursor-pointer hover:bg-red-100"
                                                title="Delete User"
                                            >
                                                <HiOutlineTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminUsers;
