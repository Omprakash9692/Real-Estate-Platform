import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import API_URL from "../../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            if (res.data.success) {
                setSuccess('Password reset link has been sent to your email.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not send reset link. Please try again.');
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
                        Forgot Password
                    </h2>
                    <p className="text-center text-text-muted mb-8">
                        Enter your email address to receive a password reset link
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

                        <button
                            className="btn btn-primary p-3.5 text-base mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-text-muted">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
