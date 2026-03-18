import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import API_URL from "../../config";

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Get email passed from Register page, if any
    const emailFromState = location.state?.email || '';
    const [email, setEmail] = useState(emailFromState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/verify-email`, { email, code });
            if (res.data.success) {
                setSuccess('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-bg-alt min-h-screen">
            <Navbar />
            <div className="container flex justify-center items-center pt-16 sm:pt-8">
                <div className="glass fade-in w-full max-w-[450px] p-10 sm:p-6 rounded-3xl sm:rounded-2xl shadow-card">
                    <h2 className="text-[2rem] sm:text-2xl font-bold text-center mb-2 text-primary">
                        Verify Your Email
                    </h2>
                    <p className="text-center text-text-muted mb-8">
                        Enter the 6-digit code sent to your email
                    </p>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg mb-4 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {!emailFromState && (
                            <div>
                                <label className="block mb-2 font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full py-3 px-4 rounded-lg border border-border outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block mb-2 font-medium">Verification Code</label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="w-full py-3 px-4 rounded-lg border border-border outline-none focus:border-primary transition-colors text-center text-2xl tracking-[0.5em]"
                            />
                        </div>

                        <button
                            className="btn btn-primary p-3.5 text-base mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
