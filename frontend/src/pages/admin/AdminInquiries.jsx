import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineUser, HiOutlineAnnotation, HiOutlineHome, HiOutlineCalendar } from "react-icons/hi";

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchInquiries = async () => {
            if (!token) return;
            setLoading(true);
            try {
                console.log('Fetching inquiries...');
                const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Inquiries response:', res.data);
                if (res.data.success) {
                    setInquiries(res.data.inquiries);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load inquiries:', err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [token]);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    if (error) return <div className="error-container p-8 text-center text-[#dc2626]">
        <h3>Error loading inquiries</h3>
        <p>{error}</p>
        <button className="btn" onClick={() => window.location.reload()}>Retry</button>
    </div>;

    return (
        <>
            <div className="mb-12">
                <h1 className="text-[2rem] font-extrabold text-text-main mb-2">Platform Inquiries</h1>
                <p className="text-text-muted">Review communication between buyers and sellers.</p>
            </div>

            <div className="admin-inquiries-list flex flex-col gap-6">
                {inquiries.map((inq) => (
                    <div key={inq._id} className="card-premium p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-[#f1f5f9] pb-6 gap-4 sm:gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary-light p-3 rounded-xl text-primary">
                                    <HiOutlineHome size={24} />
                                </div>
                                <div className="w-full sm:w-auto text-left">
                                    <div className="font-bold">{inq.property?.title || 'Unknown Property'}</div>
                                    <div className="text-xs text-text-muted">Property ID: {inq.property?._id}</div>
                                </div>
                            </div>
                            <div className="text-sm text-text-muted text-left sm:text-right w-full sm:w-auto">
                                <HiOutlineCalendar className="inline align-middle mr-1" /> {new Date(inq.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                            <div className="bg-[#f8fafc] p-4 md:p-5 rounded-2xl border border-[#f1f5f9]">
                                <div className="text-xs font-bold text-text-muted uppercase mb-3 tracking-widest">Buyer Details</div>
                                <div className="font-bold text-text-main mb-1">{inq.buyer?.name}</div>
                                <div className="text-sm text-text-muted break-all">{inq.buyer?.email}</div>
                            </div>
                            <div className="bg-[#f8fafc] p-4 md:p-5 rounded-2xl border border-[#f1f5f9]">
                                <div className="text-xs font-bold text-text-muted uppercase mb-3 tracking-widest">Seller Details</div>
                                <div className="font-bold text-text-main mb-1">{inq.seller?.name}</div>
                                <div className="text-sm text-text-muted break-all">{inq.seller?.email}</div>
                            </div>
                        </div>

                        <div className="bg-bg-alt p-6 rounded-2xl border-l-[4px] border-primary">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                                <HiOutlineAnnotation /> MESSAGE
                            </div>
                            <p className="italic text-text-main leading-relaxed">"{inq.message}"</p>
                        </div>
                    </div>
                ))}

                {inquiries.length === 0 && (
                    <div className="card-premium py-24 px-8 text-center">
                        <div className="text-text-muted mb-4"><HiOutlineAnnotation size={48} className="mx-auto" /></div>
                        <h2>No inquiries found</h2>
                        <p className="text-text-muted">There are no inquiries recorded on the platform yet.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminInquiries;
