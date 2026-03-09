import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { lawyerService } from '../services/lawyerService';
import { FiSend, FiUser, FiSearch, FiMessageSquare } from 'react-icons/fi';
import './Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const lawyerId = searchParams.get('lawyerId');
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            const convs = await messageService.getConversations(user.uid);
            setConversations(convs);

            // Handle initiating a new conversation from lawyer profile
            if (lawyerId && lawyerId !== user.uid) {
                const existingConv = convs.find(c => c.participants.includes(lawyerId));
                if (existingConv) {
                    setActiveConv(existingConv);
                } else {
                    // Create a placeholder conversation object for the UI
                    const newConvId = messageService.getConversationId(user.uid, lawyerId);
                    const newConv = {
                        id: newConvId,
                        participants: [user.uid, lawyerId],
                        lastMessage: '',
                        isNew: true
                    };
                    setConversations(prev => [newConv, ...prev]);
                    setActiveConv(newConv);
                }
            }

            // Fetch names for participants
            const participantsData = { ...participants };
            for (const conv of convs) {
                const otherPartyId = conv.participants.find(id => id !== user.uid);
                if (!participantsData[otherPartyId]) {
                    // Try to fetch as lawyer first, then user (simplified for now)
                    const lawyer = await lawyerService.getLawyerById(otherPartyId);
                    participantsData[otherPartyId] = lawyer ? lawyer.name : 'Client';
                }
            }
            setParticipants(participantsData);
            setLoading(false);
        };

        fetchConversations();
    }, [user, lawyerId]);

    useEffect(() => {
        if (!activeConv) return;

        const unsubscribe = messageService.subscribeToMessages(activeConv.id, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [activeConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;

        const receiverId = activeConv.participants.find(id => id !== user.uid);
        try {
            await messageService.sendMessage(user.uid, receiverId, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (loading) return <div className="messages-page container"><h2>Loading messages...</h2></div>;

    return (
        <div className="messages-page container">
            <div className="messages-container glass-card">
                <aside className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h3>Messages</h3>
                        <div className="search-bar">
                            <FiSearch />
                            <input type="text" placeholder="Search chats..." />
                        </div>
                    </div>
                    <div className="conversations-list">
                        {conversations.length > 0 ? (
                            conversations.map(conv => {
                                const otherPartyId = conv.participants.find(id => id !== user.uid);
                                return (
                                    <div
                                        key={conv.id}
                                        className={`conversation-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                                        onClick={() => setActiveConv(conv)}
                                    >
                                        <div className="avatar">{participants[otherPartyId]?.[0] || 'C'}</div>
                                        <div className="conv-info">
                                            <div className="conv-name">{participants[otherPartyId] || 'Loading...'}</div>
                                            <div className="conv-last">{conv.lastMessage}</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-convs">No messages yet.</div>
                        )}
                    </div>
                </aside>

                <main className="chat-window">
                    {activeConv ? (
                        <>
                            <header className="chat-header">
                                <div className="avatar">
                                    {participants[activeConv.participants.find(id => id !== user.uid)]?.[0] || 'C'}
                                </div>
                                <h4>{participants[activeConv.participants.find(id => id !== user.uid)]}</h4>
                            </header>
                            <div className="messages-list">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                                        <div className="bubble-content">{msg.text}</div>
                                        <div className="bubble-time">
                                            {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chat-input" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary"><FiSend /></button>
                            </form>
                        </>
                    ) : (
                        <div className="chat-placeholder">
                            <FiMessageSquare size={48} />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Messages;
