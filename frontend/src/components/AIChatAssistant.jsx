import API_URL from "../config";
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { HiPaperAirplane, HiChat, HiX, HiMinus } from 'react-icons/hi';
import './AIChatAssistant.css';

const AIChatAssistant = () => {
    const location = useLocation();
    const isChatPage = location.pathname === '/chat-messages';
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'ai',
            content: 'Hello! I am your Real Estate Assistant. How can I help you find your dream property today?'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [chatHistory, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: message
        };

        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message: userMessage.content
            });

            const aiReply = {
                role: 'ai',
                content: response.data.reply
            };

            setChatHistory(prev => [...prev, aiReply]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setChatHistory(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: 'Sorry, I encountered an error. Please try again later.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`ai-assistant-wrapper ${isChatPage ? 'on-chat-page' : ''} ${isOpen ? 'active' : ''}`}>
            {!isOpen ? (
                <button
                    className="ai-chat-bubble"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open AI Assistant"
                >
                    <HiChat />
                </button>
            ) : (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <div className="header-info">
                            <span className="ai-status-dot"></span>
                            <h3>AI Assistant</h3>
                        </div>
                        <button
                            className="ai-chat-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Chat"
                        >
                            <HiX size={20} />
                        </button>
                    </div>

                    <div className="ai-chat-messages">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`message-container ${msg.role}`}>
                                <div className={`message ${msg.role}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-container ai">
                                <div className="message ai typing">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="ai-chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="ai-chat-send" disabled={!message.trim() || isLoading}>
                            <HiPaperAirplane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatAssistant;