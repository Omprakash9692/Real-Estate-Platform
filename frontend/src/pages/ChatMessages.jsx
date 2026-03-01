import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from "../config";
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { HiChevronLeft, HiOutlineChatAlt2, HiPaperAirplane, HiOutlineTrash } from 'react-icons/hi';
import './ChatMessages.css';

const ChatMessages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { socket, activeChat, setActiveChat, joinChat, sendMessage } = useChat();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/chat/user`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const fetchedConversations = res.data;
                setConversations(fetchedConversations);

                // If we came here from a specific property, auto-select that chat
                if (location.state?.chat) {
                    const existingChat = fetchedConversations.find(c => c._id === location.state.chat._id);
                    if (existingChat) {
                        setActiveChat(existingChat);
                    } else {
                        // If it's a brand new chat not yet in the list
                        setActiveChat(location.state.chat);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setLoading(false);
            }
        };
        fetchConversations();
    }, [user, location.state]);

    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setMessages(res.data.messages || []);
                    joinChat(activeChat._id);
                    scrollToBottom();
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            };
            fetchMessages();
        }
    }, [activeChat]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (data) => {
                if (activeChat && data.chatId === activeChat._id) {
                    setMessages((prev) => [...prev, data]);
                }
            });
        }
        return () => socket?.off('receiveMessage');
    }, [socket, activeChat]);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Additional scroll for when activeChat changes to ensure initial load scrolls
    useEffect(() => {
        if (activeChat) {
            const timer = setTimeout(() => scrollToBottom(), 100);
            return () => clearTimeout(timer);
        }
    }, [activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const textToSend = newMessage;
        setNewMessage('');

        try {
            // Save to DB
            const res = await axios.post(`${API_URL}/api/chat/send`, {
                chatId: activeChat._id,
                text: textToSend
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Emit to socket with database-provided fields
            if (res.data.newMessage) {
                sendMessage(activeChat._id, textToSend, res.data.newMessage._id, res.data.newMessage.createdAt);
            }

            scrollToBottom();
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this conversation?')) return;

        try {
            await axios.delete(`${API_URL}/api/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setConversations((prev) => prev.filter((c) => c._id !== chatId));
            if (activeChat?._id === chatId) setActiveChat(null);
        } catch (err) {
            console.error('Error deleting chat:', err);
        }
    };

    const handleDeleteMessage = async (chatId, messageId) => {
        if (!window.confirm('Delete this message?')) return;

        try {
            const res = await axios.delete(`${API_URL}/api/chat/${chatId}/message/${messageId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(res.data.chat.messages);
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    };

    const getChatPartner = (chat) => {
        return user._id === chat.buyer._id ? chat.seller : chat.buyer;
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="chat-page-wrapper" style={{ height: user?.role === 'seller' ? 'calc(100vh - 120px)' : '100vh' }}>
            {user?.role !== 'seller' && <Navbar />}
            <div className="chat-container">
                {/* Conversations Sidebar */}
                <div className={`chat-sidebar ${activeChat ? 'hidden' : ''}`}>
                    <div className="chat-sidebar-header">
                        <h2>Messages</h2>
                    </div>
                    <div className="conversation-list">
                        {conversations.length === 0 ? (
                            <div className="chat-empty-state">
                                <HiOutlineChatAlt2 />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((chat) => (
                                <div
                                    key={chat._id}
                                    className={`conversation-item ${activeChat?._id === chat._id ? 'active' : ''}`}
                                    onClick={() => setActiveChat(chat)}
                                >
                                    <div className="conversation-avatar">
                                        {getChatPartner(chat)?.name?.charAt(0)}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-name">{getChatPartner(chat)?.name}</div>
                                        <div className="conversation-last-msg">
                                            {chat.messages.at(-1)?.text || 'Started a conversation'}
                                        </div>
                                    </div>
                                    <button
                                        className="delete-chat-btn"
                                        onClick={(e) => handleDeleteChat(e, chat._id)}
                                        title="Delete Conversation"
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="chat-main">
                    {activeChat ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <button className="back-btn" onClick={() => setActiveChat(null)}>
                                        <HiChevronLeft size={24} />
                                    </button>
                                    <div className="conversation-avatar">
                                        {getChatPartner(activeChat)?.name?.charAt(0)}
                                    </div>
                                    <div className="chat-header-name">{getChatPartner(activeChat)?.name}</div>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`msg-bubble ${(msg.sender?._id || msg.sender) === user._id ? 'sent' : 'received'}`}
                                    >
                                        <div className="msg-content">
                                            {msg.text}
                                            {(msg.sender?._id || msg.sender) === user._id && (
                                                <button
                                                    className="delete-msg-btn"
                                                    onClick={() => handleDeleteMessage(activeChat._id, msg._id)}
                                                    title="Delete Message"
                                                >
                                                    <HiOutlineTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <span className="msg-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="chat-send-btn">
                                    <HiPaperAirplane />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="chat-empty-state">
                            <HiOutlineChatAlt2 />
                            <h3>Your Messages</h3>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessages;
