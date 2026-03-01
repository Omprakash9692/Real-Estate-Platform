import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const result = await register(formData);

        if (result.success) {
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-alt)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '2rem',
                paddingBottom: '4rem'
            }}>
                <div className="glass fade-in" style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        color: 'var(--primary)'
                    }}>Create Account</h2>
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        marginBottom: '2rem'
                    }}>Join our community to find or list properties</p>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Select Role</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label style={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `2px solid ${formData.role === 'buyer' ? 'var(--primary)' : 'var(--border-color)'}`,
                                    backgroundColor: formData.role === 'buyer' ? 'var(--secondary)' : 'white',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="buyer"
                                        checked={formData.role === 'buyer'}
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    Buyer
                                </label>
                                <label style={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `2px solid ${formData.role === 'seller' ? 'var(--primary)' : 'var(--border-color)'}`,
                                    backgroundColor: formData.role === 'seller' ? 'var(--secondary)' : 'white',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="seller"
                                        checked={formData.role === 'seller'}
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    Seller
                                </label>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={isLoading}
                            style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in here</Link>
                    </p>
                    <style>{`
                @media (max-width: 640px) {
                    .container {
                        padding-top: 1rem !important;
                        padding-bottom: 2rem !important;
                    }
                    .glass {
                        padding: 1.5rem !important;
                        border-radius: 1rem !important;
                    }
                    h2 {
                        font-size: 1.5rem !important;
                    }
                    form {
                        gap: 1rem !important;
                    }
                }
            `}</style>
                </div>
            </div>
        </div>
    );
};

export default Register;
