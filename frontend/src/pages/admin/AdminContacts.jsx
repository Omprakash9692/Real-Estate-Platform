import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/contact`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setContacts(res.data.contacts);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load contacts:', err);
                setLoading(false);
            }
        };
        fetchContacts();
    }, [token]);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Contact Requests</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Read and manage inquiries from platform users.</p>
            </div>

            <div className="card-premium" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ borderBottom: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Inbox ({contacts.length})</h2>
                </div>

                {contacts.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <HiOutlineMail size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No contact messages yet. Inbox is clear.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {contacts.map((contact, index) => (
                            <div key={contact._id} style={{
                                padding: '2rem',
                                borderBottom: index !== contacts.length - 1 ? '1px solid #f1f5f9' : 'none',
                                background: 'white',
                                transition: 'all 0.3s ease',
                                cursor: 'default'
                            }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            background: contact.role === 'seller' ? '#dcfce7' : '#dbeafe',
                                            color: contact.role === 'seller' ? '#166534' : '#1e40af',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '1.25rem',
                                            flexShrink: 0
                                        }}>
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{contact.name}</h3>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '2rem',
                                                    background: contact.role === 'seller' ? '#dcfce7' : '#dbeafe',
                                                    color: contact.role === 'seller' ? '#166534' : '#1e40af',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {contact.role}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <HiOutlineMail size={16} /> {contact.email}
                                                </div>
                                                {contact.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <HiOutlinePhone size={16} /> {contact.phone}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <HiOutlineClock size={16} /> {new Date(contact.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        cursor: 'pointer'
                                    }}>
                                        Reply <HiOutlineChevronRight />
                                    </button>
                                </div>
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    color: '#334155',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    {contact.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminContacts;
