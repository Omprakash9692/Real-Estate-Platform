import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineCheckCircle, HiOutlineMail, HiOutlinePhone, HiOutlineClock } from "react-icons/hi";

const SellerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setRequests(res.data.pendingSellers);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load seller requests:', err);
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            const res = await axios.patch(`${API_URL}/api/admin/approve-seller/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRequests(requests.filter(req => req._id !== id));
                alert('Seller approved successfully!');
            }
        } catch (err) {
            alert('Failed to approve seller');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="seller-requests-container">
            <div className="mb-8">
                <h1 className="text-[1.75rem] font-extrabold text-text-main mb-1">Seller Verification</h1>
                <p className="text-text-muted text-[0.875rem]">Review and approve new seller registration requests.</p>
            </div>

            <div className="card-premium">
                <div className="p-6">
                    <h2 className="text-[1.25rem] font-extrabold text-text-main mb-6">Pending Requests ({requests.length})</h2>

                    {requests.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <HiOutlineCheckCircle size={48} className="opacity-20 mb-4 mx-auto" />
                            <p>No pending seller requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
                            {requests.map((request) => (
                                <div key={request._id} className="request-card border border-[#f1f5f9] rounded-2xl p-6 bg-[#f8fafc] transition-all duration-300 ease-in-out hover:-translate-y-1">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[1.25rem]">
                                            {request.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[1.1rem] text-text-main">{request.name}</div>
                                            <div className="text-[0.75rem] text-text-muted flex items-center gap-1">
                                                <HiOutlineClock /> Joined {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-6">
                                        <div className="flex items-center gap-3 text-[0.9rem] text-[#475569]">
                                            <HiOutlineMail size={18} className="text-primary" /> {request.email}
                                        </div>
                                        {request.phone && (
                                            <div className="flex items-center gap-3 text-[0.9rem] text-[#475569]">
                                                <HiOutlinePhone size={18} className="text-primary" /> {request.phone}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleApprove(request._id)}
                                        className="w-full p-3 rounded-xl border-none bg-primary text-white font-bold cursor-pointer flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:-translate-y-[2px]"
                                    >
                                        <HiOutlineCheckCircle size={20} />
                                        Approve Seller
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerRequests;
