import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { HiOutlineTrash, HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineMail, HiOutlineIdentification } from "react-icons/hi";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>User Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monitor platform users and access levels.</p>
                </div>
            </div>

            <div className="card-premium" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Platform Users</h2>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>User Info</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Role</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>Contact Details</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Account Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user._id.slice(-8).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.5rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            background: user.role === 'admin' ? '#fef3c7' : (user.role === 'seller' ? '#dcfce7' : '#dbeafe'),
                                            color: user.role === 'admin' ? '#92400e' : (user.role === 'seller' ? '#166534' : '#1e40af')
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><HiOutlineMail color="#94a3b8" /> {user.email}</div>
                                            {user.phone && <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><HiOutlineIdentification color="#94a3b8" /> {user.phone}</div>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.5rem', textAlign: 'center' }}>
                                        {user.isBlocked ? (
                                            <span style={{ color: '#dc2626', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', background: '#fff5f5', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>
                                                <HiOutlineLockClosed size={14} /> Suspended
                                            </span>
                                        ) : (
                                            <span style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', background: '#f0fdf4', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #dcfce7' }}>
                                                <HiOutlineLockOpen size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.5rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleBlock(user._id, user.isBlocked)}
                                                style={{ width: '36px', height: '36px', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: user.isBlocked ? '#10b981' : '#f59e0b' }}
                                                title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                            >
                                                {user.isBlocked ? <HiOutlineLockOpen size={18} /> : <HiOutlineLockClosed size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                style={{ width: '36px', height: '36px', borderRadius: '0.5rem', border: 'none', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
