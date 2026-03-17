import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineMail, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/contact`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setContacts(res.data.contacts);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to load contacts:', err);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, [token]);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <>
            <div className="mb-10">
                <h1 className="text-[2rem] font-extrabold text-text-main mb-2">Contact Requests</h1>
                <p className="text-text-muted text-[0.9rem]">Read and manage inquiries from platform users.</p>
            </div>

            <div className="card-premium p-0 overflow-hidden">
                <div className="border-b border-[#f1f5f9] p-6 flex justify-between items-center">
                    <h2 className="text-[1.2rem] font-extrabold">Inbox ({contacts.length})</h2>
                </div>

                {contacts.length === 0 ? (
                    <div className="p-16 text-center text-text-muted">
                        <HiOutlineMail size={48} className="opacity-20 mb-4 mx-auto" />
                        <p>No contact messages yet. Inbox is clear.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {contacts.map((contact, index) => (
                            <div key={contact._id} className={`p-8 bg-white transition-all duration-300 ease-in-out border-b ${index !== contacts.length - 1 ? 'border-[#f1f5f9]' : 'border-transparent'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-5">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-[1.25rem] shrink-0 ${contact.role === 'seller' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#dbeafe] text-[#1e40af]'}`}>
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-[1.1rem] font-extrabold text-text-main">{contact.name}</h3>
                                                <span className={`text-[0.7rem] px-[0.6rem] py-[0.2rem] rounded-full font-bold uppercase ${contact.role === 'seller' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#dbeafe] text-[#1e40af]'}`}>
                                                    {contact.role}
                                                </span>
                                            </div>
                                            <div className="flex gap-6 flex-wrap">
                                                <div className="flex items-center gap-[0.4rem] text-[0.85rem] text-text-muted">
                                                    <HiOutlineMail size={16} /> {contact.email}
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center gap-[0.4rem] text-[0.85rem] text-text-muted">
                                                        <HiOutlinePhone size={16} /> {contact.phone}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-[0.4rem] text-[0.85rem] text-text-muted">
                                                    <HiOutlineClock size={16} /> {new Date(contact.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#f8fafc] py-5 px-6 rounded-2xl text-[0.95rem] leading-[1.6] text-[#334155] border border-[#f1f5f9]">
                                    {contact.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminContacts;
