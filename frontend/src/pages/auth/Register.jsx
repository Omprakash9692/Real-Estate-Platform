import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/common/Navbar";
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";

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
            setTimeout(() => navigate('/login'), 1500);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-bg-alt min-h-screen">
            <Navbar />
            <div className="container flex justify-center items-center pt-8 pb-16 sm:pt-4 sm:pb-8">
                <div className="glass fade-in w-full max-w-[500px] p-10 sm:p-6 rounded-3xl sm:rounded-2xl shadow-card">
                    <h2 className="text-[2rem] sm:text-2xl font-bold text-center mb-2 text-primary">
                        Create Account
                    </h2>
                    <p className="text-center text-text-muted mb-8">
                        Join our community to find or list properties
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full py-3 px-4 rounded-lg border border-border outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full py-3 px-4 rounded-lg border border-border outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full py-3 px-4 rounded-lg border border-border outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block mb-3 font-medium">Select Role</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition-all duration-200 ${formData.role === 'buyer' ? 'border-primary bg-secondary' : 'border-border bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="buyer"
                                        checked={formData.role === 'buyer'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    Buyer
                                </label>
                                <label className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition-all duration-200 ${formData.role === 'seller' ? 'border-primary bg-secondary' : 'border-border bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="seller"
                                        checked={formData.role === 'seller'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    Seller
                                </label>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary p-3.5 text-base mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
