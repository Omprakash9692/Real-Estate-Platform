import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { HiOutlineChatAlt2, HiChatAlt2, HiCalendar, HiCheckCircle, HiHome, HiExternalLink, HiUser, HiMail, HiPhone } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import Navbar from '../../components/common/Navbar';

const MyInquiries = () => {
    const { user, token } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInquiries = async () => {
            if (!user) return;
            try {
                const endpoint = user?.role === 'seller' ? 'seller' : 'my';
                const res = await axios.get(`${API_URL}/api/inquiry/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Both endpoints now return { success: true, inquiries: [...] }
                setInquiries(res.data.inquiries || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching inquiries:', err);
                setError(err.response?.data?.message || 'Failed to load inquiries.');
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/inquiry/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
        } catch (err) {
            console.error('Failed to mark read');
        }
    };

    const handleStartChat = async (inq) => {
        try {
            const res = await axios.post(`${API_URL}/api/chat/start`, {
                propertyId: inq.property?._id,
                buyerId: inq.buyer?._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Pass the chat object in state so ChatMessages can auto-focus it
            navigate('/chat-messages', { state: { chat: res.data } });
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Failed to start chat. Please try again.');
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    if (error) return (
        <div className={user?.role !== 'seller' ? 'bg-bg-alt min-h-screen' : 'bg-transparent min-h-screen'}>
            {user?.role !== 'seller' && <Navbar />}
            <div className="container py-12 text-center">
                <div className="card-premium py-16 px-8">
                    <h2 className="text-[var(--danger)] mb-4">Error</h2>
                    <p className="mb-8">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
                </div>
            </div>
        </div>
    );

    const isSeller = user?.role === 'seller';

    return (
        <div className={user?.role !== 'seller' ? 'bg-bg-alt min-h-screen' : 'bg-transparent h-auto'}>
            {user?.role !== 'seller' && <Navbar />}
            <div className={`container fade-in ${user?.role !== 'seller' ? 'py-12 pt-12' : 'pt-0'}`}>
                <div className="mb-12">
                    <h1 className="text-[2.5rem] md:text-[1.75rem] mb-2 sm:mb-1">
                        {isSeller ? 'Customer Inquiries' : 'My Inquiries'}
                    </h1>
                    <p className="text-text-muted">
                        {isSeller ? 'Review and respond to interest in your properties.' : 'Track the status of your property inquiries.'}
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <div className="card-premium py-24 px-8 text-center">
                        <div className="bg-bg-alt w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-text-muted">
                            <HiOutlineChatAlt2 size={40} />
                        </div>
                        <h2 className="mb-4">No inquiries {isSeller ? 'received' : 'sent'}</h2>
                        <p className="text-text-muted mb-8">
                            {isSeller ? "You haven't received any inquiries yet. Better listings get more attention!" : "You haven't contacted any sellers yet. Interested in a property? Send an inquiry!"}
                        </p>
                        <Link to="/" className="btn btn-primary">
                            {isSeller ? 'Improve My Listings' : 'Discover Properties'}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {inquiries.map((inq) => (
                            <div key={inq._id} className="card-premium p-8 lg:p-6 flex flex-col lg:flex-row justify-between items-stretch gap-6 lg:gap-0">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1">
                                    <div className="bg-primary-light p-3 md:p-5 rounded-xl md:rounded-2xl text-primary h-fit">
                                        <HiHome className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-[1.25rem]">{inq.property?.title}</h3>
                                            <span className={`badge ${inq.isRead ? 'bg-[#f3f4f6] text-text-muted' : 'bg-[#eff6ff] text-[#2563eb]'}`}>
                                                {inq.isRead ? 'READ' : 'NEW'}
                                            </span>
                                        </div>

                                        {isSeller && (
                                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-5 p-4 bg-bg-alt rounded-xl">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <HiUser className="text-muted" /> <span className="font-semibold">{inq.buyer?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <HiMail className="text-muted" /> {inq.buyer?.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <HiPhone className="text-muted" /> {inq.buyer?.phone || 'No phone provided'}
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-text-main text-base italic mb-5 pl-4 border-l-[3px] border-[var(--border-color)]">
                                            "{inq.message}"
                                        </p>

                                        <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-[0.8125rem] text-text-muted font-medium">
                                            <div className="flex items-center gap-2">
                                                <HiCalendar size={16} /> {isSeller ? 'Received' : 'Sent'} on {new Date(inq.createdAt).toLocaleDateString()}
                                            </div>
                                            {!isSeller && (
                                                <div className="flex items-center gap-2">
                                                    <HiCheckCircle size={16} /> {inq.isRead ? 'Seller viewed' : 'Waiting for seller'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col flex-wrap gap-4 ml-0 lg:ml-8 justify-center [&>*]:flex-1 [&>*]:min-w-[150px]">
                                    <Link to={`/property/${inq.property?._id}`} className="btn btn-outline gap-2 whitespace-nowrap">
                                        View Property <HiExternalLink />
                                    </Link>
                                    {isSeller && !inq.isRead && (
                                        <button onClick={() => markAsRead(inq._id)} className="btn btn-primary whitespace-nowrap">
                                            Mark as Read
                                        </button>
                                    )}
                                    {isSeller && (
                                        <button
                                            onClick={() => handleStartChat(inq)}
                                            className="btn btn-primary bg-[#2563eb] flex items-center justify-center gap-2"
                                        >
                                            <HiChatAlt2 /> Message
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInquiries;
