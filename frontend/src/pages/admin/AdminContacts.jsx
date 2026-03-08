import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineMail, HiOutlinePhone, HiOutlineClock, HiOutlineReply, HiPaperAirplane } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReplyId, setActiveReplyId] = useState(null); // ID of the contact being replied to
    const [replyMessage, setReplyMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useAuth();

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

    useEffect(() => {
        fetchContacts();
    }, [token]);

    const handleReply = async (contactId) => {
        if (!replyMessage.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/api/contact/reply`,
                { contactId, replyMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Reply sent successfully!");
                setActiveReplyId(null);
                setReplyMessage("");
                fetchContacts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reply");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                transition: 'all 0.3s ease'
                            }}>
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
                                                {contact.status === 'replied' && (
                                                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '2rem', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                                                        REPLIED
                                                    </span>
                                                )}
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
                                    <button
                                        onClick={() => {
                                            if (activeReplyId === contact._id) {
                                                setActiveReplyId(null);
                                                setReplyMessage("");
                                            } else {
                                                setActiveReplyId(contact._id);
                                                setReplyMessage("");
                                            }
                                        }}
                                        style={{
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '0.75rem',
                                            border: activeReplyId === contact._id ? '1px solid var(--primary)' : 'none',
                                            background: activeReplyId === contact._id ? 'white' : (contact.status === 'replied' ? '#f1f5f9' : 'var(--primary)'),
                                            color: activeReplyId === contact._id ? 'var(--primary)' : (contact.status === 'replied' ? 'var(--text-muted)' : 'white'),
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <HiOutlineReply size={18} /> {activeReplyId === contact._id ? 'Cancel' : (contact.status === 'replied' ? 'Reply Again' : 'Reply')}
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

                                {/* Inline Inline Reply Section */}
                                {activeReplyId === contact._id && (
                                    <div className="fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '2px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>YOUR REPLY</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User will receive this via email</span>
                                        </div>
                                        <textarea
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            placeholder={`Type your message to ${contact.name}...`}
                                            style={{
                                                width: '100%',
                                                minHeight: '120px',
                                                padding: '1rem',
                                                borderRadius: '0.75rem',
                                                border: '1px solid #e2e8f0',
                                                outline: 'none',
                                                fontSize: '0.95rem',
                                                background: '#fcfcfc',
                                                marginBottom: '1rem',
                                                resize: 'vertical'
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleReply(contact._id)}
                                                disabled={isSubmitting || !replyMessage.trim()}
                                                style={{
                                                    padding: '0.75rem 2rem',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    cursor: replyMessage.trim() ? 'pointer' : 'not-allowed',
                                                    opacity: replyMessage.trim() ? 1 : 0.6,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {isSubmitting ? 'Sending...' : (
                                                    <>
                                                        Send Message <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminContacts;
