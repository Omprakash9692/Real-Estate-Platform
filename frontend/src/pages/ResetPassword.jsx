import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_URL from '../config';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-alt)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '4rem'
            }}>
                <div className="glass fade-in" style={{
                    width: '100%',
                    maxWidth: '450px',
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
                    }}>Reset Password</h2>
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        marginBottom: '2rem'
                    }}>Enter your new password below</p>

                    {message && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={isLoading}
                            style={{ padding: '0.875rem', fontSize: '1rem' }}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                        Back to{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
