import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { documentService } from '../services/documentService';
import { FiCalendar, FiClock, FiMessageSquare, FiFileText, FiArrowRight, FiSearch, FiBookOpen, FiShield } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        if (user) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [aptData, docData] = await Promise.all([
                        appointmentService.getUserAppointments(user.uid),
                        documentService.getUserDocuments(user.uid)
                    ]);

                    if (isMounted) {
                        setAppointments(aptData || []);
                        setDocuments(docData || []);
                    }
                } catch (error) {
                    console.error("Dashboard data fetch error:", error);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }

        return () => { isMounted = false; };
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const firstName = user?.displayName?.split(' ')[0] || 'there';

    if (loading) {
        return (
            <div className="ud-page">
                <div className="ud-container">
                    <div className="ud-loading">
                        <div className="ud-loading-spinner"></div>
                        <p>Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ud-page">
            <div className="ud-container">

                {/* Hero Greeting */}
                <div className="ud-hero">
                    <div className="ud-hero__content">
                        <span className="ud-hero__wave">👋</span>
                        <div>
                            <h1 className="ud-hero__title">{getGreeting()}, {firstName}</h1>
                            <p className="ud-hero__sub">Here's what's happening with your legal matters today.</p>
                        </div>
                    </div>
                    <div className="ud-hero__date">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="ud-stats">
                    <div className="ud-stat-card" onClick={() => navigate('/search')}>
                        <div className="ud-stat-card__icon ud-stat-card__icon--blue">
                            <FiSearch />
                        </div>
                        <div className="ud-stat-card__info">
                            <span className="ud-stat-card__label">Find Lawyers</span>
                            <span className="ud-stat-card__desc">Browse attorneys</span>
                        </div>
                        <FiArrowRight className="ud-stat-card__arrow" />
                    </div>
                    <div className="ud-stat-card" onClick={() => navigate('/messages')}>
                        <div className="ud-stat-card__icon ud-stat-card__icon--green">
                            <FiMessageSquare />
                        </div>
                        <div className="ud-stat-card__info">
                            <span className="ud-stat-card__label">Messages</span>
                            <span className="ud-stat-card__desc">Chat with lawyers</span>
                        </div>
                        <FiArrowRight className="ud-stat-card__arrow" />
                    </div>
                    <div className="ud-stat-card" onClick={() => navigate('/documents')}>
                        <div className="ud-stat-card__icon ud-stat-card__icon--purple">
                            <FiBookOpen />
                        </div>
                        <div className="ud-stat-card__info">
                            <span className="ud-stat-card__label">Documents</span>
                            <span className="ud-stat-card__desc">{documents.length} saved</span>
                        </div>
                        <FiArrowRight className="ud-stat-card__arrow" />
                    </div>
                    <div className="ud-stat-card" onClick={() => navigate('/ask')}>
                        <div className="ud-stat-card__icon ud-stat-card__icon--orange">
                            <FiShield />
                        </div>
                        <div className="ud-stat-card__info">
                            <span className="ud-stat-card__label">Ask a Lawyer</span>
                            <span className="ud-stat-card__desc">Get legal advice</span>
                        </div>
                        <FiArrowRight className="ud-stat-card__arrow" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="ud-grid">

                    {/* Appointments Panel */}
                    <section className="ud-panel ud-panel--appointments">
                        <div className="ud-panel__header">
                            <div className="ud-panel__title-group">
                                <div className="ud-panel__icon-wrap ud-panel__icon-wrap--blue">
                                    <FiCalendar />
                                </div>
                                <h2 className="ud-panel__title">Your Appointments</h2>
                            </div>
                            <span className="ud-panel__count">{appointments.length}</span>
                        </div>
                        <div className="ud-panel__body">
                            {appointments.length > 0 ? (
                                <div className="ud-apt-list">
                                    {appointments.map(apt => (
                                        <div key={apt.id} className="ud-apt-item">
                                            <div className="ud-apt-item__left">
                                                <div className="ud-apt-item__avatar">
                                                    {apt.lawyerName?.[0] || 'L'}
                                                </div>
                                                <div className="ud-apt-item__details">
                                                    <strong>{apt.lawyerName}</strong>
                                                    <div className="ud-apt-item__meta">
                                                        <span><FiCalendar /> {apt.date}</span>
                                                        <span><FiClock /> {apt.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`ud-status ud-status--${apt.status}`}>{apt.status}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="ud-empty">
                                    <div className="ud-empty__illustration">📅</div>
                                    <h3>No appointments yet</h3>
                                    <p>Book a consultation with a qualified attorney to get started.</p>
                                    <Link to="/search" className="ud-empty__btn">Find a Lawyer</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Documents Panel */}
                    <section className="ud-panel ud-panel--documents">
                        <div className="ud-panel__header">
                            <div className="ud-panel__title-group">
                                <div className="ud-panel__icon-wrap ud-panel__icon-wrap--purple">
                                    <FiFileText />
                                </div>
                                <h2 className="ud-panel__title">My Documents</h2>
                            </div>
                            <Link to="/documents" className="ud-panel__link">Browse Library →</Link>
                        </div>
                        <div className="ud-panel__body">
                            {documents.length > 0 ? (
                                <div className="ud-doc-list">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="ud-doc-item" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                                            <div className="ud-doc-item__icon">
                                                <FiFileText />
                                            </div>
                                            <div className="ud-doc-item__info">
                                                <strong>{doc.templateName}</strong>
                                                <span>
                                                    {doc.createdAt?.seconds
                                                        ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                        : 'Recently saved'}
                                                </span>
                                            </div>
                                            <FiArrowRight className="ud-doc-item__arrow" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="ud-empty">
                                    <div className="ud-empty__illustration">📄</div>
                                    <h3>No documents saved</h3>
                                    <p>Create legal documents from our template library.</p>
                                    <Link to="/documents" className="ud-empty__btn ud-empty__btn--secondary">Create a Document</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Messages Panel */}
                    <section className="ud-panel ud-panel--messages">
                        <div className="ud-panel__header">
                            <div className="ud-panel__title-group">
                                <div className="ud-panel__icon-wrap ud-panel__icon-wrap--green">
                                    <FiMessageSquare />
                                </div>
                                <h2 className="ud-panel__title">Recent Messages</h2>
                            </div>
                            <Link to="/messages" className="ud-panel__link">View All →</Link>
                        </div>
                        <div className="ud-panel__body">
                            <div className="ud-msg-promo">
                                <div className="ud-msg-promo__visual">💬</div>
                                <h3>Chat with your lawyers</h3>
                                <p>Get real-time legal advice through secure messaging.</p>
                                <Link to="/messages" className="ud-msg-promo__btn">Open Messages</Link>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
