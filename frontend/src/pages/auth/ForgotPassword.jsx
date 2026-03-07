import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import API_URL from "../../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
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
                    }}>
                        {step === 1 ? 'Enter your email to receive a 6-digit OTP' : 'Enter the OTP sent to your email and your new password'}
                    </p>

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

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>6-Digit OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="6"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border-color)',
                                        outline: 'none',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.5rem',
                                        fontWeight: '700'
                                    }}
                                />
                            </div>
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Confirm Password</label>
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
                                {isLoading ? 'Verifying...' : 'Reset Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                                Re-send OTP?
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                        Remember your password?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
