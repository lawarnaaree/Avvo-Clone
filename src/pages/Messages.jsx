import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { lawyerService } from '../services/lawyerService';
import { FiSend, FiSearch, FiMessageSquare, FiSmile } from 'react-icons/fi';
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
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            const convs = await messageService.getConversations(user.uid);
            setConversations(convs);

            if (lawyerId && lawyerId !== user.uid) {
                const existingConv = convs.find(c => c.participants.includes(lawyerId));
                if (existingConv) {
                    setActiveConv(existingConv);
                } else {
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

            const participantsData = { ...participants };
            for (const conv of convs) {
                const otherPartyId = conv.participants.find(id => id !== user.uid);
                if (!participantsData[otherPartyId]) {
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

    const filteredConversations = conversations.filter(conv => {
        if (!searchTerm.trim()) return true;
        const otherPartyId = conv.participants.find(id => id !== user.uid);
        const name = participants[otherPartyId] || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="msg-page">
                <div className="msg-loading">
                    <div className="msg-loading__spinner"></div>
                    <p>Loading conversations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="msg-page">
            <div className="msg-shell">

                {/* Sidebar */}
                <aside className="msg-sidebar">
                    <div className="msg-sidebar__top">
                        <h2 className="msg-sidebar__title">Chats</h2>
                        <div className="msg-sidebar__search">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="msg-sidebar__list">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(conv => {
                                const otherPartyId = conv.participants.find(id => id !== user.uid);
                                const name = participants[otherPartyId] || 'Loading...';
                                const isActive = activeConv?.id === conv.id;
                                return (
                                    <div
                                        key={conv.id}
                                        className={`msg-contact ${isActive ? 'msg-contact--active' : ''}`}
                                        onClick={() => setActiveConv(conv)}
                                    >
                                        <div className="msg-contact__avatar">
                                            {name[0] || 'C'}
                                        </div>
                                        <div className="msg-contact__info">
                                            <span className="msg-contact__name">{name}</span>
                                            <span className="msg-contact__preview">{conv.lastMessage || 'Start a conversation...'}</span>
                                        </div>
                                        {isActive && <div className="msg-contact__indicator"></div>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="msg-sidebar__empty">
                                <FiMessageSquare />
                                <p>No conversations found</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="msg-chat">
                    {activeConv ? (
                        <>
                            <header className="msg-chat__header">
                                <div className="msg-chat__header-avatar">
                                    {participants[activeConv.participants.find(id => id !== user.uid)]?.[0] || 'C'}
                                </div>
                                <div className="msg-chat__header-info">
                                    <h3>{participants[activeConv.participants.find(id => id !== user.uid)]}</h3>
                                    <span className="msg-chat__header-status">
                                        <span className="msg-online-dot"></span> Online
                                    </span>
                                </div>
                            </header>

                            <div className="msg-chat__body">
                                {messages.length === 0 && (
                                    <div className="msg-chat__start">
                                        <div className="msg-chat__start-emoji">🤝</div>
                                        <p>Start the conversation! Say hello to your lawyer.</p>
                                    </div>
                                )}
                                {messages.map(msg => (
                                    <div key={msg.id} className={`msg-bubble ${msg.senderId === user.uid ? 'msg-bubble--sent' : 'msg-bubble--received'}`}>
                                        <div className="msg-bubble__text">{msg.text}</div>
                                        <div className="msg-bubble__time">
                                            {msg.createdAt?.seconds
                                                ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : '...'}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="msg-chat__composer" onSubmit={handleSendMessage}>
                                <button type="button" className="msg-chat__emoji-btn" title="Emoji">
                                    <FiSmile />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Write a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className={`msg-chat__send-btn ${newMessage.trim() ? 'msg-chat__send-btn--active' : ''}`}
                                    disabled={!newMessage.trim()}
                                >
                                    <FiSend />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="msg-chat__empty">
                            <div className="msg-chat__empty-visual">
                                <div className="msg-chat__empty-circle msg-chat__empty-circle--1"></div>
                                <div className="msg-chat__empty-circle msg-chat__empty-circle--2"></div>
                                <div className="msg-chat__empty-icon">💬</div>
                            </div>
                            <h2>Your messages</h2>
                            <p>Select a conversation from the sidebar to start chatting with your lawyer.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Messages;
