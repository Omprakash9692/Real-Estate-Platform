import React, { useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import Navbar from '../../components/common/Navbar';
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineAnnotation, HiOutlineCheckCircle } from 'react-icons/hi';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        message: '',
        role: user?.role || 'buyer'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/api/contact`, formData);
            if (res.data.success) {
                setSuccess(true);
                setFormData({ ...formData, message: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {user?.role !== 'seller' && <Navbar />}

            <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Have questions or feedback? We'd love to hear from you. Our team is here to help you with anything you need.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card-premium" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HiOutlineMail size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Email Us</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@realestate.com</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HiOutlinePhone size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Call Us</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+1 (234) 567-890</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium" style={{ height: '200px', background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Quick Support</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Available 24/7 for our premium members. Your satisfaction is our priority.</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card-premium" style={{ padding: '2.5rem' }}>
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <HiOutlineCheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                                <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for reaching out. We've received your message and will get back to you shortly.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem' }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                            <HiOutlineUser size={16} style={{ marginRight: '0.3rem' }} /> Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                            <HiOutlineMail size={16} style={{ marginRight: '0.3rem' }} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <HiOutlinePhone size={16} style={{ marginRight: '0.3rem' }} /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                                    />
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <HiOutlineAnnotation size={16} style={{ marginRight: '0.3rem' }} /> Message
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help..."
                                        rows="5"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', resize: 'none' }}
                                    />
                                </div>

                                {error && (
                                    <div style={{ color: '#dc2626', fontSize: '0.875rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', marginTop: '1rem' }}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
